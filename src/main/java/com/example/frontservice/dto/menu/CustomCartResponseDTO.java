package com.example.frontservice.dto.menu;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomCartResponseDTO {
    private Long userUid;
    private Long socialUid;
    private Long uid;
    private Double calorie;
    private int price;
    private Long breadId;
    private String breadName;

    private Long material1Id;
    private String material1Name;
    private Long material2Id;
    private String material2Name;
    private Long material3Id;
    private String material3Name;

    private Long cheeseId;
    private String cheeseName;

    private Long vegetable1Id;
    private String vegetable1Name;
    private Long vegetable2Id;
    private String vegetable2Name;
    private Long vegetable3Id;
    private String vegetable3Name;
    private Long vegetable4Id;
    private String vegetable4Name;
    private Long vegetable5Id;
    private String vegetable5Name;
    private Long vegetable6Id;
    private String vegetable6Name;
    private Long vegetable7Id;
    private String vegetable7Name;
    private Long vegetable8Id;
    private String vegetable8Name;

    private Long sauce1Id;
    private String sauce1Name;
    private Long sauce2Id;
    private String sauce2Name;
    private Long sauce3Id;
    private String sauce3Name;


    private int version;



}
