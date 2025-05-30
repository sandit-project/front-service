package com.example.frontservice.controller.store;

import com.example.frontservice.dto.store.*;
import com.example.frontservice.service.StoreService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/stores")
@RequiredArgsConstructor
public class StoreApiController {

    private final StoreService storeService;

    @GetMapping
    public List<CustomerStoreListResponseDTO> getStoreList(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        return storeService.getStores(token);
    }

    @GetMapping("/list")
    StoreListResponseDTO getAllStores (@RequestParam(name = "limit", defaultValue = "10") int limit,
                                       @RequestParam(name = "lastUid", required = false) Long lastUid,
                                       HttpServletRequest request) {
        StoreListRequestDTO storeListRequestDTO = new StoreListRequestDTO(limit, lastUid);
        String token = request.getHeader("Authorization");

        return storeService.getAllStores(storeListRequestDTO,token);
    }

//    @GetMapping("/customerList")
//    public List<StoreCustomerListResponseDTO>getStores(HttpServletRequest requset){
//        String token = requset.getHeader("Authorization");
//        return storeService.getStores(token);
//    }

    @GetMapping("/{storeUid}")
    StoreResponseDTO getStore (@PathVariable Long storeUid, HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        return storeService.getStore(storeUid,token);
    }

    @GetMapping("/storeUid")
    StoreUidResponseDTO getStoreUid (@RequestParam Long userUid, HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        return storeService.getStoreUidByManager(userUid,token);
    }
    @GetMapping("/check-manager")
    public ResponseEntity<Map<String,Boolean>> checkManagerAssigned (@RequestParam Long userUid, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        boolean assigned = storeService.isManagerAlreadyAssigned(userUid,token);
        Map<String,Boolean> result = new HashMap<>();
        result.put("assigned",assigned);

        return ResponseEntity.ok(result);
    }
    @GetMapping("/manager-mapping")
    public List<ManagerMappingDTO> getManagerMapping (@RequestHeader("Authorization") String token) {
        return storeService.getManagerMapping(token);
    }

    @PostMapping
    StoreResponseDTO addStore (@RequestBody StoreRequestDTO storeRequestDTO, HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        return storeService.addStore(storeRequestDTO, token);
    }

    @PutMapping("/{storeUid}")
    StoreResponseDTO updateStore(@PathVariable(name = "storeUid") Long uid,
                                 @Valid @RequestBody StoreRequestDTO storeRequestDTO,
                                 HttpServletRequest request){
        String token = request.getHeader("Authorization");

        return storeService.updateStore(uid, storeRequestDTO,token);
    }

    @DeleteMapping("/{storeUid}")
    void deleteStore(@PathVariable("storeUid") Long storeUid, HttpServletRequest request){
        String token= request.getHeader("Authorization");

        storeService.deleteStore(storeUid,token);
    }

    @PutMapping("/orders/{action}")
    public RemoteOrderResponseDTO remoteOrder(@PathVariable(name = "action") String action,
                                              HttpServletRequest request,
                                              @RequestBody RemoteOrderRequestDTO remoteOrderRequestDTO) {
        String token = request.getHeader("Authorization");

        return storeService.remoteOrder(token, action, remoteOrderRequestDTO);
    }
}
