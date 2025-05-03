package com.example.frontservice.controller.store;

import com.example.frontservice.dto.store.StoreOrderCountResponseDTO;
import com.example.frontservice.dto.store.StoreOrderListResponseDTO;
import com.example.frontservice.service.StoreOrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class StoreOrderApiController {

    private final StoreOrderService storeOrderService;

    @GetMapping("/orders/store/{storeUid}")
    public StoreOrderListResponseDTO getAllOrdersByStoreUid(  @PathVariable(name = "storeUid") Integer storeUid,
                                                              @RequestParam(name = "limit", defaultValue = "10") int limit,
                                                              @RequestParam(name = "lastUid", required = false) Integer lastUid,
                                                              @RequestParam(name = "status", required = false) String status,
                                                              HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        return storeOrderService.getOrdersByStoreUid(storeUid,limit,lastUid,status,token);
    }

    @GetMapping("orders/store/{storeUid}/count")
    public StoreOrderCountResponseDTO countByStoreUid(@PathVariable(name = "storeUid") Integer storeUid,
                                                      HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        return storeOrderService.countByStoreUid(storeUid,token);
    }
}
