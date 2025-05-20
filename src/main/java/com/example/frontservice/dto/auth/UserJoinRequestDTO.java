package com.example.frontservice.dto.auth;

import com.example.frontservice.type.Role;
import lombok.Getter;

import java.util.List;

@Getter
public class UserJoinRequestDTO {
    private String userId;
    private String password;
    private String userName;
    private List<String> allergies;
    private String email;
    private String emailyn;
    private String phone;
    private String phoneyn;
    private String mainAddress;
    private String mainLat;
    private String mainLan;
    private Role role;

}
