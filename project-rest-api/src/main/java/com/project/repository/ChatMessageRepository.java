package com.project.repository;

import com.project.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// Rozszerza JpaRepository, co daje nam gotowe metody CRUD (Create, Read, Update, Delete)
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // Ta metoda zostanie automatycznie zaimplementowana przez Spring Data JPA
    // Pobiera do 500 wiadomości, posortowanych malejąco według czasu (najnowsze na początku)
    List<ChatMessage> findTop500ByOrderByTimestampDesc();
}