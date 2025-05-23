package com.example.frontservice.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomReadStatusResponseDTO {
    private String roomId;
    private String userId;
    private boolean read;
    private LocalDateTime lastReadAt;
}
