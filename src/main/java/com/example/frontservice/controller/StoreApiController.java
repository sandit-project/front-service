package com.example.frontservice.controller;

import com.example.frontservice.dto.store.*;
import com.example.frontservice.service.StoreService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class StoreApiController {

    private final StoreService storeService;

    @GetMapping("/stores/list")
    StoreListResponseDTO getAllStores (@RequestParam(name = "limit", defaultValue = "10") int limit,
                                       @RequestParam(name = "lastUid", required = false) Long lastUid,
                                       HttpServletRequest request) {
        StoreListRequestDTO storeListRequestDTO = new StoreListRequestDTO(limit, lastUid);
        String token = request.getHeader("Authorization");

        return storeService.getAllStores(storeListRequestDTO,token);
    }

    @GetMapping("/stores/{storeUid}")
    StoreResponseDTO getStore (@PathVariable Long storeUid, HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        return storeService.getStore(storeUid,token);
    }

    @GetMapping("/stores/storeUid")
    StoreUidResponseDTO getStoreUid (@RequestParam Long managerUid, HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        return storeService.getStoreUidByManager(managerUid,token);
    }

    @PostMapping("/stores")
    StoreResponseDTO addStore (@RequestBody StoreRequestDTO storeRequestDTO, HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        return storeService.addStore(storeRequestDTO, token);
    }

    @PutMapping("/stores/{storeUid}")
    StoreResponseDTO updateStore(@PathVariable(name = "storeUid") Long uid,
                                 @Valid @RequestBody StoreRequestDTO storeRequestDTO,
                                 HttpServletRequest request){
        String token = request.getHeader("Authorization");

        return storeService.updateStore(uid, storeRequestDTO,token);
    }

    @PatchMapping("/stores/{storeUid}")
    StoreResponseDTO updateStatusByUid(@PathVariable("storeUid") Long storeUid,
                                       @RequestParam("storeStatus") String storeStatus,
                                       HttpServletRequest request){
        String token = request.getHeader("Authorization");

        return storeService.updateStatusByUid(storeUid,storeStatus,token);
    }

    @DeleteMapping("/stores/{storeUid}")
    void deleteStore(@PathVariable("storeUid") Long storeUid, HttpServletRequest request){
        String token= request.getHeader("Authorization");

        storeService.deleteStore(storeUid,token);
    }
}
