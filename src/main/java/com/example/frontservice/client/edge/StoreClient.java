package com.example.frontservice.client.edge;

import com.example.frontservice.dto.store.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@FeignClient(name="storeClient", url="http://localhost:9001")
public interface StoreClient {

    @GetMapping("/stores/list")
    StoreListResponseDTO getStoreList(@RequestParam("limit") int limit,
                                      @RequestParam("lastUid") Long lastUid,
                                      @RequestHeader("Authorization") String token);

    @GetMapping("/stores/{uid}")
    StoreResponseDTO getStore(@PathVariable(name="uid") Long uid,
                              @RequestHeader("Authorization") String token);

    @PostMapping("/stores")
    StoreResponseDTO addStore(@Valid @RequestBody StoreRequestDTO storeRequestDTO,
                              @RequestHeader("Authorization") String token);



    @PutMapping("/stores/{uid}")
    StoreResponseDTO updateStore(@PathVariable(name="uid") Long uid,
                                 @Valid @RequestBody StoreRequestDTO storeRequestDTO,
                                 @RequestHeader("Authorization") String token);

    @DeleteMapping("/stores/{uid}")
    StoreResponseDTO deleteStore(@PathVariable(name="uid") Long uid,
                                 @RequestHeader("Authorization") String token);

    @PatchMapping("/stores/{uid}")
    StoreResponseDTO updateStatusByUid(@PathVariable(name="uid") Long uid,
                                       @RequestParam("storeStatus") String storeStatus,
                                       @RequestHeader("Authorization") String token);

}
