package com.example.frontservice.dto.menu;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BreadRequestDTO {


    @NotBlank(message = "The bread name must be defined.")
    private String breadName;

    @NotNull(message = "The calorie count must be defined.")
    private Double calorie;

    @NotNull(message = "The price must be defined.")
    @Positive(message = "The price must be greater than zero.")
    private int price;

    private String status;

    private String img;
}
