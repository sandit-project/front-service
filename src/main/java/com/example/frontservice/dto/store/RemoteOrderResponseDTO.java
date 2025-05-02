package com.example.frontservice.dto.store;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RemoteOrderResponseDTO {
    private boolean isSuccess;
    private String message;
}
