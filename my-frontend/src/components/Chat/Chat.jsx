import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [status, setStatus] = useState('Łączenie...');
    const [user, setUser] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);

    // Auto-scroll do nowych wiadomości
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // Pobierz dane użytkownika
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Brak tokenu autoryzacyjnego');
                }
                
                const response = await fetch('http://localhost:8080/api/auth/current-user', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!response.ok) throw new Error('Błąd autoryzacji');
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Błąd pobierania użytkownika:', error);
                setUser({
                    id: null,
                    firstName: 'Anonim',
                    lastName: ''
                });
            }
        };

        // Połącz z WebSocket
        const connectWebSocket = () => {
            const socket = new SockJS('http://localhost:8080/ws-chat');
            stompClient.current = new Client({
                webSocketFactory: () => socket,
                connectHeaders: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                debug: (str) => console.log(str),
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });

            stompClient.current.onConnect = () => {
                setIsConnected(true);
                setStatus('Połączono z czatem');
                
                // Subskrybuj kanał czatu
                stompClient.current.subscribe('/topic/publicChat', (message) => {
                    try {
                        const newMessage = JSON.parse(message.body);
                        setMessages(prev => [...prev, newMessage]);
                    } catch (error) {
                        console.error('Błąd parsowania wiadomości:', error);
                    }
                });

                // Pobierz historię czatu
                fetchChatHistory();
            };

            stompClient.current.onStompError = (frame) => {
                console.error('Błąd STOMP:', frame.headers.message);
                setStatus('Błąd połączenia: ' + frame.headers.message);
                setIsConnected(false);
            };

            stompClient.current.onWebSocketError = (error) => {
                console.error('Błąd WebSocket:', error);
                setStatus('Błąd połączenia WebSocket');
                setIsConnected(false);
            };

            stompClient.current.onDisconnect = () => {
                setStatus('Rozłączono');
                setIsConnected(false);
            };

            stompClient.current.activate();
        };

        // Pobierz historię czatu
        const fetchChatHistory = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/chat/history');
                if (!response.ok) throw new Error('Błąd pobierania historii');
                const history = await response.json();
                setMessages(Array.isArray(history) ? history.reverse() : []);
            } catch (error) {
                console.error('Błąd ładowania historii:', error);
                setMessages([]);
            }
        };

        fetchUser();
        connectWebSocket();

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !isConnected || !stompClient.current) return;

        const message = {
            content: messageInput.trim(),
            sender: user ? `${user.firstName} ${user.lastName}` : 'Anonim',
            senderId: user?.id,
            timestamp: new Date().toISOString()
        };

        try {
            stompClient.current.publish({
                destination: '/app/chat.send',
                body: JSON.stringify(message),
                headers: { 'content-type': 'application/json' }
            });
            setMessageInput('');
        } catch (error) {
            console.error('Błąd wysyłania wiadomości:', error);
            setStatus('Błąd wysyłania wiadomości');
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return isNaN(date.getTime()) 
                ? '--:--' 
                : date.toLocaleTimeString('pl-PL', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit'
                });
        } catch (error) {
            console.error('Błąd formatowania daty:', error);
            return '--:--';
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Czat</h2>
                <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
                    {status}
                </div>
            </div>

            <div className="messages-container">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.senderId === user?.id ? 'own' : ''}`}>
                            <div className="message-info">
                                <span className="sender">{msg.sender || 'Anonim'}</span>
                                <span className="time">{formatDate(msg.timestamp)}</span>
                            </div>
                            <div className="message-content">{msg.content || ''}</div>
                        </div>
                    ))
                ) : (
                    <div className="no-messages">Brak wiadomości</div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="message-form">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Napisz wiadomość..."
                    disabled={!isConnected}
                />
                <button 
                    type="submit" 
                    disabled={!messageInput.trim() || !isConnected}
                    className={!isConnected ? 'disabled' : ''}
                >
                    Wyślij
                </button>
            </form>
        </div>
    );
};

export default Chat;