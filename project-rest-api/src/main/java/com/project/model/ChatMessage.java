package com.project.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ZMIANA: Zmieniono nazwę pola z "message" na "content",
    // ale nazwa kolumny w bazie danych pozostaje "message".
    @Column(name = "message")
    private String content;

    // ZMIANA: Zmieniono nazwę pola z "senderName" na "sender",
    // ale nazwa kolumny w bazie danych pozostaje "sender_name".
    @Column(name = "sender_name")
    private String sender;

    @Column(name = "sender_id")
    private String senderId;

    @Column(name = "timestamp")
    private String timestamp;

    // Gettery i settery dla zmienionych pól

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}