package com.example.frontservice.client.edge;

import com.example.frontservice.dto.chat.ChatMessageResponseDTO;
import com.example.frontservice.dto.chat.ChatRoomRequestDTO;
import com.example.frontservice.dto.chat.ChatRoomResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "chatClient", url = "${sandit.edge-service-url}/chat")
public interface ChatClient {

    @PostMapping("/rooms")
    ChatRoomResponseDTO createRoom(@RequestHeader("Authorization") String token, @RequestBody ChatRoomRequestDTO request);


    @GetMapping("/rooms")
    List<ChatRoomResponseDTO> getAllRooms(@RequestHeader("Authorization") String token);

    @GetMapping("/rooms/{roomId}/messages")
    List<ChatMessageResponseDTO> getMessages(@RequestHeader("Authorization") String token, @PathVariable String roomId);

    @DeleteMapping("/rooms/{roomId}")
    void deleteRoom(@RequestHeader("Authorization") String token, @PathVariable String roomId);



}
