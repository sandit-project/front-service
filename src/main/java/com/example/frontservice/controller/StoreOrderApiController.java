package com.example.frontservice.controller;

import com.example.frontservice.dto.store.StoreOrderListRequestDTO;
import com.example.frontservice.dto.store.StoreOrderListResponseDTO;
import com.example.frontservice.service.StoreOrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class StoreOrderApiController {

    private final StoreOrderService storeOrderService;

    @GetMapping("/stores/test/orders/list")
    StoreOrderListResponseDTO getAllOrdersByStoreUid(@RequestParam(name = "limit", defaultValue = "10") int limit,
                                                     @RequestParam(name = "lastUid", required = false) Long lastUid,
                                                     HttpServletRequest request) {
        StoreOrderListRequestDTO storeOrderListRequestDTO = new StoreOrderListRequestDTO(limit,lastUid);

        return storeOrderService.storeOrderList(storeOrderListRequestDTO,request.getHeader("Authorization"));
    }
}
