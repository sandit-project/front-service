package com.example.frontservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinClientResponseDTO {

    private boolean isSuccess;

    public JoinResponseDTO toJoinResponseDTO(){
        return JoinResponseDTO.builder()
                .isSuccess(isSuccess)
                .url(isSuccess ? "/webs/login" : "/webs/join")
                .build();
    }
}
