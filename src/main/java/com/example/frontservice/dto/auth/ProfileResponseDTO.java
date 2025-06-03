package com.example.frontservice.dto.auth;

import com.example.frontservice.type.Role;
import com.example.frontservice.type.Type;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ProfileResponseDTO {
    private int uid;
    private String userId;
    private String userName;
    private String email;
    private String emailyn;
    private String phone;
    private String phoneyn;
    private Type type;
    private int point;
    private Role role;
    private LocalDateTime createdDate;
    private String mainAddress;
    private String subAddress1;
    private String subAddress2;
    private double mainLat;
    private double mainLan;
    private double sub1Lat;
    private double sub1Lan;
    private double sub2Lat;
    private double sub2Lan;
}
