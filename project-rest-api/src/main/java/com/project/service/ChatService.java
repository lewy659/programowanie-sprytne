package com.project.service;

import com.project.model.ChatMessage;
import java.util.List;

public interface ChatService {
    ChatMessage saveMessage(ChatMessage message); // Zapisuje wiadomość
    List<ChatMessage> getRecentMessages(); // Pobiera ostatnie wiadomości
}