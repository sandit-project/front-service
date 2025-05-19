package com.example.frontservice.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageResponseDTO {
    private String id;
    private String roomId;
    private String sender;
    private String senderRole;
    private String senderType;
    private String message;
    private LocalDateTime createdAt;
}
