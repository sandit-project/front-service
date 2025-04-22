package com.example.frontservice.client.store;

import com.example.frontservice.dto.ProfileResponseDTO;
import com.example.frontservice.dto.store.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@FeignClient(name="storeClient", url="http://localhost:9001/stores")
public interface StoreClient {

    @GetMapping("/list")
    StoreListResponseDTO getStoreList(@RequestBody StoreListRequestDTO storeListRequestDTO);

    @GetMapping("/{uid}")
    StoreResponseDTO getStore(@PathVariable(name="uid") Long uid);

    @PostMapping
    StoreResponseDTO addStore(@Valid @RequestBody StoreRequestDTO storeRequestDTO,
                              @RequestHeader("Authorization") String token);


    @PutMapping("/{uid}")
    StoreResponseDTO updateStore(@PathVariable(name="uid") Long uid,
                                           @Valid @RequestBody StoreRequestDTO storeRequestDTO);

    @DeleteMapping("/{uid}")
    StoreResponseDTO deleteStore(@PathVariable(name="uid") Long uid);

    @PatchMapping("{uid}")
    StoreResponseDTO updateStatusByUid(@PathVariable(name="uid") Long uid,
                                                 @RequestParam("storeStatus") String storeStatus);

}
