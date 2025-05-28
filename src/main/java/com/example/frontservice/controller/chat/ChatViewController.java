package com.example.frontservice.controller.chat;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ChatViewController {
    @Value("${app.websocket.url}")
    private String websocketUrl;


    // 채팅방 목록을 반환하는 메소드
    @GetMapping("/chat")
    public String listChatRooms(Model model) {
        model.addAttribute("websocketUrl", websocketUrl);
        return "chat/chat-rooms"; // templates/chat-rooms.html을 렌더링
    }

    @GetMapping("/chat-room")
    public String chatRoom(Model model) {
        model.addAttribute("websocketUrl", websocketUrl);
        return "chat/chat-room";  // 모델 없이 'chat-room' 템플릿만 반환
    }



}