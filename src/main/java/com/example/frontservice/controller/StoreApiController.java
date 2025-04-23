package com.example.frontservice.controller;

import com.example.frontservice.dto.store.StoreListRequestDTO;
import com.example.frontservice.dto.store.StoreListResponseDTO;
import com.example.frontservice.dto.store.StoreRequestDTO;
import com.example.frontservice.dto.store.StoreResponseDTO;
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

    @GetMapping("/stores/{uid}")
    StoreResponseDTO getStore (@PathVariable Long uid, HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        return storeService.getStore(uid,token);
    }

    @PostMapping("/stores")
    StoreResponseDTO addStore (@RequestBody StoreRequestDTO storeRequestDTO, HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        return storeService.addStore(storeRequestDTO, token);
    }

    @PutMapping("/stores/{uid}")
    StoreResponseDTO updateStore(@PathVariable(name = "uid") Long uid,
                                 @Valid @RequestBody StoreRequestDTO storeRequestDTO,
                                 HttpServletRequest request){
        String token = request.getHeader("Authorization");

        return storeService.updateStore(uid, storeRequestDTO,token);
    }

    @PatchMapping("/stores/{uid}")
    StoreResponseDTO updateStatusByUid(@PathVariable("uid") Long uid,
                                       @RequestParam("storeStatus") String storeStatus,
                                       HttpServletRequest request){
        String token = request.getHeader("Authorization");

        return storeService.updateStatusByUid(uid,storeStatus,token);
    }

    @DeleteMapping("/stores/{uid}")
    void deleteStore(@PathVariable("uid") Long uid, HttpServletRequest request){
        String token= request.getHeader("Authorization");

        storeService.deleteStore(uid,token);
    }
}
