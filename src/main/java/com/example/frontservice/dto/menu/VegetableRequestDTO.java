package com.example.frontservice.dto.menu;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VegetableRequestDTO {


    private String vegetableName;


    private Double calorie;


    private int price;


    private String img;

    private String status;



}
