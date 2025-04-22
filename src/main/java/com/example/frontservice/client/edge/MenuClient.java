package com.example.frontservice.client.edge;

import com.example.frontservice.dto.menu.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "menuClient", url = "${sandit.edge-service-url}/menus")
public interface MenuClient {

    @GetMapping("/breads")
    BreadResponseDTO getBreads(@RequestHeader("Authorization") String token);

    @GetMapping("/breads/{breadName}")
    BreadResponseDTO getBread(@RequestHeader("Authorization") String token, @PathVariable("breadName") String breadName);

    @PostMapping(value = "/breads", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    BreadResponseDTO addBread(
            @RequestHeader("Authorization") String token,
            @RequestPart("bread") BreadRequestDTO bread,
            @RequestPart("file") MultipartFile file
    );

    @PutMapping(value = "/breads/{breadName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    BreadResponseDTO updateBread(
            @RequestHeader("Authorization") String token,
            @PathVariable("breadName") String breadName,
            @RequestPart("bread") BreadRequestDTO bread,
            @RequestPart("file") MultipartFile file
    );

    @DeleteMapping("/breads/{breadName}")
    void deleteBread(@RequestHeader("Authorization") String token, @PathVariable String breadName);





    @GetMapping("/cheeses")
    CheeseResponseDTO getCheeses(@RequestHeader("Authorization") String token);

    @GetMapping("/cheeses/{cheeseName}")
    CheeseResponseDTO getCheese(@RequestHeader("Authorization") String token, @PathVariable("cheeseName") String cheeseName);

    @PostMapping(value = "/cheeses", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    CheeseResponseDTO addCheese(
            @RequestHeader("Authorization") String token,
            @RequestPart("cheese") CheeseRequestDTO cheese,
            @RequestPart("file") MultipartFile file
    );

    @PutMapping(value = "/cheeses/{cheeseName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    CheeseResponseDTO updateCheese(
            @RequestHeader("Authorization") String token,
            @PathVariable("cheeseName") String cheeseName,
            @RequestPart("cheese") CheeseRequestDTO cheese,
            @RequestPart("file") MultipartFile file
    );

    @DeleteMapping("/cheeses/{cheeseName}")
    void deleteCheese(@RequestHeader("Authorization") String token, @PathVariable String cheeseName);





    @GetMapping("/materials")
    MaterialResponseDTO getMaterials(@RequestHeader("Authorization") String token);

    @GetMapping("/materials/{materialName}")
    MaterialResponseDTO getMaterial(@RequestHeader("Authorization") String token, @PathVariable("materialName") String materialName);

    @PostMapping(value = "/materials", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    MaterialResponseDTO addMaterial(
            @RequestHeader("Authorization") String token,
            @RequestPart("material") MaterialRequestDTO material,
            @RequestPart("file") MultipartFile file
    );

    @PutMapping(value = "/materials/{materialName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    MaterialResponseDTO updateMaterial(
            @RequestHeader("Authorization") String token,
            @PathVariable("materialName") String materialName,
            @RequestPart("material") MaterialRequestDTO material,
            @RequestPart("file") MultipartFile file
    );

    @DeleteMapping("/materials/{materialName}")
    void deleteMaterial(@RequestHeader("Authorization") String token, @PathVariable String materialName);



    @GetMapping("/sauces")
    SauceResponseDTO getSauces(@RequestHeader("Authorization") String token);

    @GetMapping("/sauces/{sauceName}")
    SauceResponseDTO getSauce(@RequestHeader("Authorization") String token, @PathVariable("sauceName") String sauceName);

    @PostMapping(value = "/sauces", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    SauceResponseDTO addSauce(
            @RequestHeader("Authorization") String token,
            @RequestPart("sauce") SauceRequestDTO sauce,
            @RequestPart("file") MultipartFile file
    );

    @PutMapping(value = "/sauces/{sauceName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    SauceResponseDTO updateSauce(
            @RequestHeader("Authorization") String token,
            @PathVariable("sauceName") String sauceName,
            @RequestPart("sauce") SauceRequestDTO sauce,
            @RequestPart("file") MultipartFile file
    );

    @DeleteMapping("/sauces/{sauceName}")
    void deleteSauce(@RequestHeader("Authorization") String token, @PathVariable String sauceName);




    @GetMapping("/vegetables")
    VegetableResponseDTO getVegetables(@RequestHeader("Authorization") String token);

    @GetMapping("/vegetables/{vegetableName}")
    VegetableResponseDTO getVegetable(@RequestHeader("Authorization") String token, @PathVariable("vegetableName") String vegetableName);

    @PostMapping(value = "/vegetables", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    VegetableResponseDTO addVegetable(
            @RequestHeader("Authorization") String token,
            @RequestPart("vegetable") VegetableRequestDTO vegetable,
            @RequestPart("file") MultipartFile file
    );

    @PutMapping(value = "/vegetables/{vegetableName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    VegetableResponseDTO updateVegetable(
            @RequestHeader("Authorization") String token,
            @PathVariable("vegetableName") String vegetableName,
            @RequestPart("vegetable") VegetableRequestDTO vegetable,
            @RequestPart("file") MultipartFile file
    );

    @DeleteMapping("/vegetables/{vegetableName}")
    void deleteVegetable(@RequestHeader("Authorization") String token, @PathVariable String vegetableName);





    @GetMapping("/sides")
    SideResponseDTO getSides(@RequestHeader("Authorization") String token);

    @GetMapping("/sides/{sideName}")
    SideResponseDTO getSide(@RequestHeader("Authorization") String token, @PathVariable("sideName") String sideName);

    @PostMapping(value = "/sides", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    SideResponseDTO addSide(
            @RequestHeader("Authorization") String token,
            @RequestPart("side") SideRequestDTO side,
            @RequestPart("file") MultipartFile file
    );

    @PutMapping(value = "/sides/{sideName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    SideResponseDTO updateSide(
            @RequestHeader("Authorization") String token,
            @PathVariable("sideName") String sideName,
            @RequestPart("side") SideRequestDTO side,
            @RequestPart("file") MultipartFile file
    );

    @DeleteMapping("/sides/{sideName}")
    void deleteSide(@RequestHeader("Authorization") String token, @PathVariable String sideName);
}











