package com.example.frontservice.dto.store;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ManagerMappingDTO {
    private Long userUid; // 매니저의 user_uid(auth 서비스의 PK)
    private String storeName; //이미 매니저로 등록된 경우 해당 지점명, 없으면 null
}
