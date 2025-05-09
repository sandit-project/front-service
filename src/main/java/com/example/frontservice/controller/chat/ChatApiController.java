package com.example.frontservice.controller.chat;


import com.example.frontservice.dto.chat.ChatMessageResponseDTO;
import com.example.frontservice.dto.chat.ChatRoomRequestDTO;
import com.example.frontservice.dto.chat.ChatRoomResponseDTO;
import com.example.frontservice.service.ChatService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatApiController {


    private final ChatService chatService;



    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null)
        {
            throw new RuntimeException("Authorization header is missing");
        }
        if (!authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization header must start with 'Bearer '");
        }
        return authHeader.substring(7);
    }

    // 채팅방 생성
    @PostMapping("/rooms")
    public ResponseEntity<ChatRoomResponseDTO> createRoom(@RequestBody ChatRoomRequestDTO request, HttpServletRequest servletRequest) {
        String token = extractToken(servletRequest);
        return ResponseEntity.ok(chatService.createRoom("Bearer " + token, request));
    }

    // 채팅방 목록 조회
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomResponseDTO>> listRooms(HttpServletRequest servletRequest) {
        String token = extractToken(servletRequest);
        return ResponseEntity.ok(chatService.getAllRooms("Bearer " + token));
    }

    // 특정 채팅방 메시지 목록 조회
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessageResponseDTO>> getMessages(@PathVariable String roomId, HttpServletRequest servletRequest) {
        String token = extractToken(servletRequest);
        return ResponseEntity.ok(chatService.getMessages("Bearer " + token, roomId));
    }
}
