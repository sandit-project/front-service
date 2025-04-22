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
    private String subAddress1;
    private String subAddress2;
    private String mainLat;
    private String mainLan;
    private String subLat1;
    private String subLan1;
    private String subLat2;
    private String subLan2;
    private Role role;

}
