package com.example.frontservice.client.edge;

import com.example.frontservice.config.FeignMultipartSupportConfig;
import com.example.frontservice.dto.menu.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@FeignClient(name = "menuClient", url = "${sandit.edge-service-url}/menus", configuration = FeignMultipartSupportConfig.class)
public interface MenuClient {

    // --- Bread ---
    @GetMapping("/breads")
    List<BreadResponseDTO> getBreads(@RequestHeader("Authorization") String token);

    @GetMapping("/breads/{breadName}")
    BreadResponseDTO getBread(@RequestHeader("Authorization") String token, @PathVariable("breadName") String breadName);

    @PostMapping(value = "/breads", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)

    BreadResponseDTO addBread(@RequestHeader("Authorization") String token,
                              @RequestPart(value = "bread") String breadRequestDTO,
                              @RequestPart(value = "file", required = false) MultipartFile file);

    @PutMapping(value = "/breads/{breadName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)

    BreadResponseDTO updateBread(@RequestHeader("Authorization") String token,
                                 @PathVariable("breadName") String breadName,
                                 @RequestPart("bread") String breadRequestDTO,
                                 @RequestPart(value = "file", required = false) MultipartFile file);

    @DeleteMapping("/breads/{breadName}")
    void deleteBread(@RequestHeader("Authorization") String token, @PathVariable String breadName);

    // --- Cheese ---
    @GetMapping("/cheeses")
    List<CheeseResponseDTO> getCheeses(@RequestHeader("Authorization") String token);

    @GetMapping("/cheeses/{cheeseName}")
    CheeseResponseDTO getCheese(@RequestHeader("Authorization") String token, @PathVariable("cheeseName") String cheeseName);

    @PostMapping(value = "/cheeses", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    CheeseResponseDTO addCheese(@RequestHeader("Authorization") String token,
                                @RequestPart("cheese") String cheeseRequestDTO,
                                @RequestPart(value = "file", required = false) MultipartFile file);

    @PutMapping(value = "/cheeses/{cheeseName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    CheeseResponseDTO updateCheese(@RequestHeader("Authorization") String token,
                                   @PathVariable("cheeseName") String cheeseName,
                                   @RequestPart("cheese") String cheeseRequestDTO,
                                   @RequestPart(value = "file", required = false) MultipartFile file);

    @DeleteMapping("/cheeses/{cheeseName}")
    void deleteCheese(@RequestHeader("Authorization") String token, @PathVariable String cheeseName);

    // --- Material ---
    @GetMapping("/materials")
    List<MaterialResponseDTO> getMaterials(@RequestHeader("Authorization") String token);

    @GetMapping("/materials/{materialName}")
    MaterialResponseDTO getMaterial(@RequestHeader("Authorization") String token, @PathVariable("materialName") String materialName);

    @PostMapping(value = "/materials", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    MaterialResponseDTO addMaterial(@RequestHeader("Authorization") String token,
                                    @RequestPart("material") String materialRequestDTO,
                                    @RequestPart(value = "file", required = false) MultipartFile file);

    @PutMapping(value = "/materials/{materialName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    MaterialResponseDTO updateMaterial(@RequestHeader("Authorization") String token,
                                       @PathVariable("materialName") String materialName,
                                       @RequestPart("material") String materialRequestDTO,
                                       @RequestPart(value = "file", required = false) MultipartFile file);

    @DeleteMapping("/materials/{materialName}")
    void deleteMaterial(@RequestHeader("Authorization") String token, @PathVariable String materialName);

    // --- Sauce ---
    @GetMapping("/sauces")
    List<SauceResponseDTO> getSauces(@RequestHeader("Authorization") String token);

    @GetMapping("/sauces/{sauceName}")
    SauceResponseDTO getSauce(@RequestHeader("Authorization") String token, @PathVariable("sauceName") String sauceName);

    @PostMapping(value = "/sauces", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    SauceResponseDTO addSauce(@RequestHeader("Authorization") String token,
                              @RequestPart("sauce") String sauceRequestDTO,
                              @RequestPart(value = "file", required = false) MultipartFile file);

    @PutMapping(value = "/sauces/{sauceName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    SauceResponseDTO updateSauce(@RequestHeader("Authorization") String token,
                                 @PathVariable("sauceName") String sauceName,
                                 @RequestPart("sauce") String sauceRequestDTO,
                                 @RequestPart(value = "file", required = false) MultipartFile file);

    @DeleteMapping("/sauces/{sauceName}")
    void deleteSauce(@RequestHeader("Authorization") String token, @PathVariable String sauceName);

    // --- Vegetable ---
    @GetMapping("/vegetables")
    List<VegetableResponseDTO> getVegetables(@RequestHeader("Authorization") String token);

    @GetMapping("/vegetables/{vegetableName}")
    VegetableResponseDTO getVegetable(@RequestHeader("Authorization") String token, @PathVariable("vegetableName") String vegetableName);

    @PostMapping(value = "/vegetables", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    VegetableResponseDTO addVegetable(@RequestHeader("Authorization") String token,
                                      @RequestPart("vegetable") String vegetableRequestDTO,
                                      @RequestPart(value = "file", required = false) MultipartFile file);

    @PutMapping(value = "/vegetables/{vegetableName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    VegetableResponseDTO updateVegetable(@RequestHeader("Authorization") String token,
                                         @PathVariable("vegetableName") String vegetableName,
                                         @RequestPart("vegetable") String vegetableRequestDTO,
                                         @RequestPart(value = "file", required = false) MultipartFile file);

    @DeleteMapping("/vegetables/{vegetableName}")
    void deleteVegetable(@RequestHeader("Authorization") String token, @PathVariable String vegetableName);

    // --- Side ---
    @GetMapping("/sides")
    List<SideResponseDTO> getSides(@RequestHeader("Authorization") String token);

    @GetMapping("/sides/{sideName}")
    SideResponseDTO getSide(@RequestHeader("Authorization") String token, @PathVariable("sideName") String sideName);

    @PostMapping(value = "/sides", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    SideResponseDTO addSide(@RequestHeader("Authorization") String token,
                            @RequestPart("side") String sideRequestDTO,
                            @RequestPart(value = "file", required = false) MultipartFile file);

    @PutMapping(value = "/sides/{sideName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    SideResponseDTO updateSide(@RequestHeader("Authorization") String token,
                               @PathVariable("sideName") String sideName,
                               @RequestPart("side") String sideRequestDTO,
                               @RequestPart(value = "file", required = false) MultipartFile file);

    @DeleteMapping("/sides/{sideName}")
    void deleteSide(@RequestHeader("Authorization") String token, @PathVariable String sideName);

    // --- Cart ---
    @GetMapping("/cart")
    CartResponseDTO getCartItems(@RequestHeader("Authorization") String token);

    @PostMapping("/cart/update/{id}")
    CartResponseDTO updateCartItem(@RequestHeader("Authorization") String token,
                                   @PathVariable("id") Long id,
                                   @RequestParam("amount") int amount);

    @PostMapping("/cart/delete/{id}")
    CartResponseDTO deleteCartItem(@RequestHeader("Authorization") String token, @PathVariable("id") Long id);

    @PostMapping("/cart/delete-selected")
    CartResponseDTO deleteSelectedItems(@RequestHeader("Authorization") String token, @RequestParam("selectedIds") List<Long> selectedIds);

    @PostMapping("/cart/order/checkout")
    CartResponseDTO checkout(@RequestHeader("Authorization") String token);

    @PostMapping("/cart/add")
    CartResponseDTO addToCart(@RequestHeader("Authorization") String token,
                              @RequestParam("menuId") Long menuId,
                              @RequestParam("amount") int amount);

    @PostMapping("/cart/add/side")
    List<CartResponseDTO> addSideToCart(@RequestHeader("Authorization") String token,
                                  @RequestBody SideCartRequestDTO dto);

    @GetMapping("/cart/quantity")
    Integer getCartQuantity(@RequestHeader("Authorization") String token);



    // --- Ingredient List ---
    @GetMapping("/ingredients/breads")
    List<BreadResponseDTO> getBreadList(@RequestHeader("Authorization") String token);

    @GetMapping("/ingredients/materials")
    List<MaterialResponseDTO> getMaterialList(@RequestHeader("Authorization") String token);

    @GetMapping("/ingredients/cheeses")
    List<CheeseResponseDTO> getCheeseList(@RequestHeader("Authorization") String token);

    @GetMapping("/ingredients/vegetables")
    List<VegetableResponseDTO> getVegetableList(@RequestHeader("Authorization") String token);

    @GetMapping("/ingredients/sauces")
    List<SauceResponseDTO> getSauceList(@RequestHeader("Authorization") String token);






    // --- Custom Cart ---
    @GetMapping("/custom-carts")
    List<CustomCartResponseDTO> getAllCustomCarts(@RequestHeader("Authorization") String token);

    @GetMapping("/custom-carts/{uid}")
    CustomCartResponseDTO getCustomCart(@RequestHeader("Authorization") String token, @PathVariable("uid") Long uid);

    @PostMapping(value = "/custom-carts", consumes = MediaType.APPLICATION_JSON_VALUE)
    CustomCartResponseDTO createCustomCart(@RequestHeader("Authorization") String token, @RequestBody String customCartRequestDTO);

    @DeleteMapping("/custom-carts/{uid}")
    void deleteCustomCart(@RequestHeader("Authorization") String token, @PathVariable("uid") Long uid);

    // --- Menu ---
    @GetMapping
    Iterable<MenuResponseDTO> getMenus(@RequestHeader("Authorization") String token);

    @GetMapping("/{menuName}")
    MenuResponseDTO getMenu(@RequestHeader("Authorization") String token, @PathVariable("menuName") String menuName);

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    MenuResponseDTO addMenu(@RequestHeader("Authorization") String token,
                            @RequestPart("menu") String menuRequestDTO,
                            @RequestPart(value = "file", required = false) MultipartFile file);

    @PutMapping(value = "/{menuName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    MenuResponseDTO updateMenu(@RequestHeader("Authorization") String token,
                               @PathVariable("menuName") String menuName,
                               @RequestPart("menu") String menuRequestDTO,
                               @RequestPart(value = "file", required = false) MultipartFile file);

    @DeleteMapping("/{menuName}")
    void deleteMenu(@RequestHeader("Authorization") String token, @PathVariable("menuName") String menuName);
}
