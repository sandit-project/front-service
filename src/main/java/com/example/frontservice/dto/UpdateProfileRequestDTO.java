package com.example.frontservice.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UpdateProfileRequestDTO {
    private String userName;
    private String email;
    private String emailyn;
    private String phone;
    private String phoneyn;
    private String mainAddress;
    private String mainLat;
    private String mainLan;
    private String subLat1;
    private String subLan1;
    private String subLat2;
    private String subLan2;
    private String subAddress1;
    private String subAddress2;
}
