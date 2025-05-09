package com.example.frontservice.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageRequestDTO {
    private String roomId;
    private String sender;
    private String message;
}
