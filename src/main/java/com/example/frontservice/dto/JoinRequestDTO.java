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
    private String subAddress1;
    private String sub1Lat;
    private String sub1Lan;
    private String subAddress2;
    private String sub2Lat;
    private String sub2Lan;
    private Role role;

}
