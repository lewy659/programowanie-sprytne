package com.project.controller;

import com.project.model.ChatMessage;
import com.project.model.Student;
import com.project.service.ChatService;
import com.project.service.StudentService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Controller
public class ChatController {

    private final ChatService chatService;
    private final StudentService studentService;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public ChatController(ChatService chatService, StudentService studentService) {
        this.chatService = chatService;
        this.studentService = studentService;
    }

    @MessageMapping("/chat.send")
    @SendTo("/topic/publicChat")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage,
                                     SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        String senderName = "Anonim";
        String senderId = null;

        if (principal != null) {
            String nrIndeksu = principal.getName();
            // Używamy orElse(null) dla bezpieczeństwa, jeśli studenta nie znaleziono
            Student student = studentService.getStudentByNrIndeksu(nrIndeksu).orElse(null);

            if (student != null) {
                senderName = student.getImie() + " " + student.getNazwisko();
                senderId = student.getStudentId().toString();
            }
        }

        // ZMIANA: Używamy setSender() zamiast setSenderName()
        chatMessage.setSender(senderName);
        chatMessage.setSenderId(senderId);
        
        // ZMIANA: Nie ma potrzeby ponownego ustawiania treści wiadomości.
        // Spring automatycznie zmapował pole "content" z JSONa na obiekt chatMessage.
        // Usunięto: chatMessage.setMessage(chatMessage.getMessage());

        chatMessage.setTimestamp(LocalDateTime.now().format(formatter));

        return chatService.saveMessage(chatMessage);
    }

    @GetMapping("/api/chat/history")
    @ResponseBody
    public List<ChatMessage> getChatHistory() {
        return chatService.getRecentMessages();
    }
}