package com.example.frontservice.dto.menu;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuResponseDTO {


        private Long uid;
        private String menuName;
        private Long price;
        private Double calorie;

        private Long breadId;
        private String breadName;
        private String breadImg; // ✅ 추가

        private Long material1Id;
        private String material1Name;
        private String material1Img; // ✅ 추가
        private Long material2Id;
        private String material2Name;
        private String material2Img; // ✅ 추가
        private Long material3Id;
        private String material3Name;
        private String material3Img; // ✅ 추가

        private Long cheeseId;
        private String cheeseName;
        private String cheeseImg; // ✅ 추가

        private Long vegetable1Id;
        private String vegetable1Name;
        private String vegetable1Img; // ✅ 추가
        private Long vegetable2Id;
        private String vegetable2Name;
        private String vegetable2Img; // ✅ 추가
        private Long vegetable3Id;
        private String vegetable3Name;
        private String vegetable3Img; // ✅ 추가
        private Long vegetable4Id;
        private String vegetable4Name;
        private String vegetable4Img; // ✅ 추가
        private Long vegetable5Id;
        private String vegetable5Name;
        private String vegetable5Img; // ✅ 추가
        private Long vegetable6Id;
        private String vegetable6Name;
        private String vegetable6Img; // ✅ 추가
        private Long vegetable7Id;
        private String vegetable7Name;
        private String vegetable7Img; // ✅ 추가
        private Long vegetable8Id;
        private String vegetable8Name;
        private String vegetable8Img; // ✅ 추가


        private Long sauce1Id;
        private String sauce1Name;
        private String sauce1Img; // ✅ 추가
        private Long sauce2Id;
        private String sauce2Name;
        private String sauce2Img; // ✅ 추가
        private Long sauce3Id;
        private String sauce3Name;
        private String sauce3Img; // ✅ 추가

        private String img;
        private String status;
        private Instant createdDate;
        private int version;
    }

