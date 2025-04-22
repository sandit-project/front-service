package com.example.frontservice.dto.menu;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class BreadRequestDTO {



    private String breadName;


    private Double calorie;


    private int price;

    private String status;
    
    private String img;

   
    // 이미지 파일과 URL을 함께 관리
    private MultipartFile file; // 업로드할 이미지 파일


}

