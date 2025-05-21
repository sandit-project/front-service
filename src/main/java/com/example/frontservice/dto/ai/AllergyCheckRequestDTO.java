package com.example.frontservice.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class AllergyCheckRequestDTO {

    @JsonProperty("user_uid")
    private Long userUid;

    @JsonProperty("social_uid")
    private Long socialUid;

    private List<String> allergy;
    private List<String> ingredients;
}
