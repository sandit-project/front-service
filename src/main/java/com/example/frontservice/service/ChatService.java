package com.example.frontservice.service;

import com.example.frontservice.client.edge.ChatClient;
import com.example.frontservice.dto.chat.ChatMessageResponseDTO;
import com.example.frontservice.dto.chat.ChatRoomRequestDTO;
import com.example.frontservice.dto.chat.ChatRoomResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatClient chatClient;

    public ChatRoomResponseDTO createRoom(String token, ChatRoomRequestDTO request) {
        return chatClient.createRoom(token, request);
    }

    public List<ChatRoomResponseDTO> getAllRooms(String token) {
        return chatClient.getAllRooms(token);
    }

    public List<ChatMessageResponseDTO> getMessages(String token, String roomId) {
        return chatClient.getMessages(token, roomId);
    }

    // 채팅방 삭제
    public void deleteRoom(String token, String roomId) {
        chatClient.deleteRoom(token, roomId);
    }


}
