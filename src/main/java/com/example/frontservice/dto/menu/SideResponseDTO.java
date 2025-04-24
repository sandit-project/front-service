package com.example.frontservice.dto.menu;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SideResponseDTO {

    private Long uid;
    private String sideName;
    private Double calorie;
    private int price;
    private String img;
    private String status;
    private Instant createdDate;
    private int version;
}
