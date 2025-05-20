package com.example.frontservice.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
public class AllergyCheckRequestDTO {
    @JsonProperty("user_uid")
    private Long user_uid;

    @JsonProperty("social_uid")
    private Long social_uid;

    private List<String> allergy;
    private List<String> ingredients;
}
