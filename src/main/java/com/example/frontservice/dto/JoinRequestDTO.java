package com.example.frontservice.dto;

import com.example.frontservice.type.Role;
import lombok.Getter;

@Getter
public class JoinRequestDTO {
    private String userId;
    private String password;
    private String userName;
    private String email;
    private String emailyn;
    private String phone;
    private String phoneyn;
    private String mainAddress;
    private String mainLat;
    private String mainLan;
    private Role role;

}
