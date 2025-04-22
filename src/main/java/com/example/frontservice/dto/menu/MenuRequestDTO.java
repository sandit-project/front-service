package com.example.frontservice.dto.menu;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuRequestDTO {


    private String menuName;


    private Long price;


    private Double calorie;


    private Long bread;


    private Long material1;

    private Long material2;
    private Long material3;

    private Long cheese;


    private Long vegetable1;

    private Long vegetable2;
    private Long vegetable3;
    private Long vegetable4;
    private Long vegetable5;
    private Long vegetable6;
    private Long vegetable7;
    private Long vegetable8;


    private Long sauce1;

    private Long sauce2;
    private Long sauce3;

    private String img;

    private String status;

    private MultipartFile file;


}
