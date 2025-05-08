package com.example.frontservice.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomResponseDTO {
    private String id;
    private String name;
    private LocalDateTime createdAt;
}
