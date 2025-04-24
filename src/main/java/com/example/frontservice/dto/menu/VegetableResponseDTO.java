package com.example.frontservice.dto.menu;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VegetableResponseDTO {

    private Long uid;
    private String vegetableName;
    private Double calorie;
    private int price;
    private String img;
    private String status;
    private Instant createdDate;
    private int version;
}
