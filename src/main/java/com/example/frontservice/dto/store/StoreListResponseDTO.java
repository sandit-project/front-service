package com.example.frontservice.dto.store;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class StoreListResponseDTO {
    private List<StoreResponseDTO> storeList;  // 지점 리스트
    private boolean lastPage;  // 마지막 페이지 여부
    private Long nextCursor;  // 다음 페이지를 위한 커서 (lastUid 또는 lastCreatedDate)

    // 생성자, 빌더 등 추가적인 메서드 구현
}