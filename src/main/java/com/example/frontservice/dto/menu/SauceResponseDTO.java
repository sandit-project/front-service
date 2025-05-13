package com.example.frontservice.dto.menu;

import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SauceResponseDTO {

    private Long uid;
    private String sauceName;
    private Double calorie;
    private int price;
    private String img;
    private String status;
    private LocalDateTime createdDate;
    private int version;
}
