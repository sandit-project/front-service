package com.example.frontservice.controller.store;

import com.example.frontservice.dto.store.StoreOrderCountResponseDTO;
import com.example.frontservice.dto.store.StoreOrderListResponseDTO;
import com.example.frontservice.dto.store.StoreOrderResponseDTO;
import com.example.frontservice.service.StoreOrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<StoreOrderResponseDTO>> getAllOrdersByStoreUidAndStatus(
                                                        @PathVariable(name = "storeUid") Integer storeUid,
                                                        @RequestParam(name = "status", required = false) String status,
                                                        HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        List<StoreOrderResponseDTO> storeOrderResponseDTOList = storeOrderService.getOrdersByStoreUidAndStatus(storeUid,status,token);

        return ResponseEntity.ok(storeOrderResponseDTOList);
    }

    @GetMapping("orders/store/{storeUid}/count")
    public StoreOrderCountResponseDTO countByStoreUid(@PathVariable(name = "storeUid") Integer storeUid,
                                                      HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        return storeOrderService.countByStoreUid(storeUid,token);
    }
}
