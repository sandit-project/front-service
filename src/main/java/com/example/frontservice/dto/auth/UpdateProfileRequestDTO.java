package com.example.frontservice.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class UpdateProfileRequestDTO {
    private int uid;
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
    private List<String> allergies;
}
