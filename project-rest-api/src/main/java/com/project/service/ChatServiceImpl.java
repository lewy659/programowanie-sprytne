package com.project.service;

import com.project.model.ChatMessage;
import com.project.repository.ChatMessageRepository;
import org.springframework.stereotype.Service; // Oznacza, że to komponent serwisu Springa

import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;

    // Spring automatycznie dostarcza nam ChatMessageRepository
    public ChatServiceImpl(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    @Override
    public ChatMessage saveMessage(ChatMessage message) {
        return chatMessageRepository.save(message); // Zapisuje wiadomość do bazy danych
    }

    @Override
    public List<ChatMessage> getRecentMessages() {
        return chatMessageRepository.findTop500ByOrderByTimestampDesc(); // Pobiera ostatnie wiadomości
    }
}