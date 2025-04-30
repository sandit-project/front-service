package com.example.frontservice.controller;

import com.example.frontservice.dto.store.StoreOrderCountResponseDTO;
import com.example.frontservice.dto.store.StoreOrderListRequestDTO;
import com.example.frontservice.dto.store.StoreOrderListResponseDTO;
import com.example.frontservice.dto.store.StoreOrderResponseDTO;
import com.example.frontservice.service.StoreOrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class StoreOrderApiController {

    private final StoreOrderService storeOrderService;

    @GetMapping("/orders/store/{storeUid}")
    public StoreOrderListResponseDTO getAllOrdersByStoreUid(  @PathVariable(name = "storeUid") Integer storeUid,
                                                              @RequestParam(name = "limit", defaultValue = "10") int limit,
                                                              @RequestParam(name = "lastUid", required = false) Integer lastUid,
                                                              HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        return storeOrderService.getAllOrders(storeUid,limit,lastUid,token);
    }

    @GetMapping("orders/store/{storeUid}/count")
    public StoreOrderCountResponseDTO countByStoreUid(@PathVariable(name = "storeUid") Integer storeUid) {
        return storeOrderService.countByStoreUid(storeUid);
    }
}
