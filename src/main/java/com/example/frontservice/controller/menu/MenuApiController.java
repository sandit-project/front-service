package com.example.frontservice.controller.menu;

import com.example.frontservice.dto.menu.*;
import com.example.frontservice.service.MenuService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/menus")
@RequiredArgsConstructor
public class MenuApiController {

    private final MenuService menuService;

//    @PostMapping("/logout")
//    public LogoutResponseDTO logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
//        String token = request.getHeader("Authorization").substring(7);
//
//        LogoutResponseDTO resultDTO = authService.logout("Bearer " + token);
//
//        if(resultDTO.isSuccessed()){
//            CookieUtil.deleteCookie(request,response,"refreshToken");
//        }
//
//        return resultDTO;
//    }

    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null)
        {
            throw new RuntimeException("Authorization header is missing");
        }
        if (!authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization header must start with 'Bearer '");
        }
        return authHeader.substring(7);
    }



//    public String extractToken(HttpServletRequest request) {
//        String header = request.getHeader("Authorization");
//        if (header == null || !header.startsWith("Bearer ")) {
//            throw new RuntimeException("Authorization header is missing or invalid");
//        }
//        return header;
//    }


    // =================== 빵 ===================
    @GetMapping("/breads")
    public ResponseEntity<List<BreadResponseDTO>> getBreads(HttpServletRequest request) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getBreads("Bearer " +token));
    }

    @GetMapping("/breads/{breadName}")
    public ResponseEntity<BreadResponseDTO> getBread(HttpServletRequest request, @PathVariable String breadName) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getBread("Bearer " +token, breadName));
    }


    @PostMapping(value = "/breads", consumes = "multipart/form-data")
    public ResponseEntity<BreadResponseDTO> addBread(
            HttpServletRequest request,
            @RequestPart("bread") BreadRequestDTO bread,
            @RequestPart("file") MultipartFile file) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.addBread("Bearer " +token, bread, file));
    }

    @PutMapping(value = "/breads/{breadName}", consumes = "multipart/form-data")
    public ResponseEntity<BreadResponseDTO> updateBread(
            HttpServletRequest request,
            @PathVariable String breadName,
            @RequestPart("bread") BreadRequestDTO bread,
            @RequestPart("file") MultipartFile file) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.updateBread("Bearer " +token, breadName, bread, file));
    }


    @DeleteMapping("/breads/{breadName}")
    public ResponseEntity<Void> deleteBread(HttpServletRequest request, @PathVariable String breadName) {
        String token = extractToken(request);
        menuService.deleteBread("Bearer " +token, breadName);
        return ResponseEntity.noContent().build();
    }

    // =================== 재료/치즈/야채/소스/사이드 ===================
    // 위의 패턴과 똑같이 각각 add/update/delete 가져다 쓰면 됩니다.
    // 필요한 경우 생략된 부분도 이어서 완성해드릴 수 있습니다.

    // =================== 치즈 ===================
    @GetMapping("/cheeses")
    public ResponseEntity<List<CheeseResponseDTO>> getCheeses(HttpServletRequest request) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getCheeses("Bearer " +token));
    }

    @GetMapping("/cheeses/{cheeseName}")
    public ResponseEntity<CheeseResponseDTO> getCheese(HttpServletRequest request, @PathVariable String cheeseName) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getCheese("Bearer " +token, cheeseName));
    }

    @PostMapping(value = "/cheeses", consumes = "multipart/form-data")
    public ResponseEntity<CheeseResponseDTO> addCheese(
            HttpServletRequest request,
            @RequestPart("cheese") CheeseRequestDTO cheese,
            @RequestPart("file") MultipartFile file) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.addCheese("Bearer " +token, cheese, file));
    }

    @PutMapping(value = "/cheeses/{cheeseName}", consumes = "multipart/form-data")
    public ResponseEntity<CheeseResponseDTO> updateCheese(
            HttpServletRequest request,
            @PathVariable String cheeseName,
            @RequestPart("cheese") CheeseRequestDTO cheese,
            @RequestPart("file") MultipartFile file) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.updateCheese("Bearer " +token, cheeseName, cheese, file));
    }

    @DeleteMapping("/cheeses/{cheeseName}")
    public ResponseEntity<Void> deleteCheese(HttpServletRequest request, @PathVariable String cheeseName) {
        String token = extractToken(request);
        menuService.deleteCheese("Bearer " +token, cheeseName);
        return ResponseEntity.noContent().build();
    }
    // =================== 재료 ===================
    @GetMapping("/materials")
    public ResponseEntity<List<MaterialResponseDTO>> getMaterials(HttpServletRequest request) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getMaterials("Bearer " +token));
    }

    @GetMapping("/materials/{materialName}")
    public ResponseEntity<MaterialResponseDTO> getMaterial(HttpServletRequest request, @PathVariable String materialName) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getMaterial("Bearer " +token, materialName));
    }

    @PostMapping(value = "/materials", consumes = "multipart/form-data")
    public ResponseEntity<MaterialResponseDTO> addMaterial(
            HttpServletRequest request,
            @RequestPart("material") MaterialRequestDTO material,
            @RequestPart("file") MultipartFile file) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.addMaterial("Bearer " +token, material, file));
    }

    @PutMapping(value = "/materials/{materialName}", consumes = "multipart/form-data")
    public ResponseEntity<MaterialResponseDTO> updateMaterial(
            HttpServletRequest request,
            @PathVariable String materialName,
            @RequestPart("material") MaterialRequestDTO material,
            @RequestPart("file") MultipartFile file) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.updateMaterial("Bearer " +token, materialName, material, file));
    }

    @DeleteMapping("/materials/{materialName}")
    public ResponseEntity<Void> deleteMaterial(HttpServletRequest request, @PathVariable String materialName) {
        String token = extractToken(request);
        menuService.deleteMaterial("Bearer " +token, materialName);
        return ResponseEntity.noContent().build();
    }


    // =================== 야채 ===================
    @GetMapping("/vegetables")
    public ResponseEntity<List<VegetableResponseDTO>> getVegetables(HttpServletRequest request) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getVegetables("Bearer " +token));
    }

    @GetMapping("/vegetables/{vegetableName}")
    public ResponseEntity<VegetableResponseDTO> getVegetable(HttpServletRequest request, @PathVariable String vegetableName) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getVegetable("Bearer " +token, vegetableName));
    }

    @PostMapping(value = "/vegetables", consumes = "multipart/form-data")
    public ResponseEntity<VegetableResponseDTO> addVegetable(
            HttpServletRequest request,
            @RequestPart("vegetable") VegetableRequestDTO vegetable,
            @RequestPart("file") MultipartFile file) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.addVegetable("Bearer " +token, vegetable, file));
    }

    @PutMapping(value = "/vegetables/{vegetableName}", consumes = "multipart/form-data")
    public ResponseEntity<VegetableResponseDTO> updateVegetable(
            HttpServletRequest request,
            @PathVariable String vegetableName,
            @RequestPart("vegetable") VegetableRequestDTO vegetable,
            @RequestPart("file") MultipartFile file) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.updateVegetable("Bearer " +token, vegetableName, vegetable, file));
    }

    @DeleteMapping("/vegetables/{vegetableName}")
    public ResponseEntity<Void> deleteVegetable(HttpServletRequest request, @PathVariable String vegetableName) {
        String token = extractToken(request);
        menuService.deleteMaterial("Bearer " +token, vegetableName);
        return ResponseEntity.noContent().build();
    }

    // =================== 소스 ===================
    @GetMapping("/sauces")
    public ResponseEntity<List<SauceResponseDTO>> getSauces(HttpServletRequest request) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getSauces("Bearer " +token));
    }

    @GetMapping("/sauces/{sauceName}")
    public ResponseEntity<SauceResponseDTO> getSauce(HttpServletRequest request, @PathVariable String sauceName) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getSauce("Bearer " +token, sauceName));
    }

    @PostMapping(value = "/sauces", consumes = "multipart/form-data")
    public ResponseEntity<SauceResponseDTO> addSauce(
            HttpServletRequest request,
            @RequestPart("sauce") SauceRequestDTO sauce,
            @RequestPart("file") MultipartFile file) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.addSauce("Bearer " +token, sauce, file));
    }

    @PutMapping(value = "/sauces/{sauceName}", consumes = "multipart/form-data")
    public ResponseEntity<SauceResponseDTO> updateSauce(
            HttpServletRequest request,
            @PathVariable String sauceName,
            @RequestPart("sauce") SauceRequestDTO sauce,
            @RequestPart("file") MultipartFile file) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.updateSauce("Bearer " +token, sauceName, sauce, file));
    }

    @DeleteMapping("/sauces/{sauceName}")
    public ResponseEntity<Void> deleteSauce(HttpServletRequest request, @PathVariable String sauceName) {
        String token = extractToken(request);
        menuService.deleteSauce("Bearer " +token, sauceName);
        return ResponseEntity.noContent().build();
    }

    // =================== 사이드 ===================
    @GetMapping("/sides")
    public ResponseEntity<List<SideResponseDTO>> getSides(HttpServletRequest request) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getSides("Bearer " +token));
    }

    @GetMapping("/sides/{sideName}")
    public ResponseEntity<SideResponseDTO> getSide(HttpServletRequest request, @PathVariable String sideName) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getSide("Bearer " +token, sideName));
    }

    @PostMapping(value = "/sides", consumes = "multipart/form-data")
    public ResponseEntity<SideResponseDTO> addSide(
            HttpServletRequest request,
            @RequestPart("side") SideRequestDTO side,
            @RequestPart("file") MultipartFile file) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.addSide("Bearer " +token, side, file));
    }

    @PutMapping(value = "/sides/{sideName}", consumes = "multipart/form-data")
    public ResponseEntity<SideResponseDTO> updateSide(
            HttpServletRequest request,
            @PathVariable String sideName,
            @RequestPart("side") SideRequestDTO side,
            @RequestPart("file") MultipartFile file) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.updateSide("Bearer " +token, sideName, side, file));
    }

    @DeleteMapping("/sides/{sideName}")
    public ResponseEntity<Void> deleteSide(HttpServletRequest request, @PathVariable String sideName) {
        String token = extractToken(request);
        menuService.deleteSide("Bearer " +token, sideName);
        return ResponseEntity.noContent().build();
    }



    // Bread Ingredients
    @GetMapping("/ingredients/breads")
    public ResponseEntity<List<BreadResponseDTO>> getBreadList(HttpServletRequest request) {
        String token = extractToken(request);
        List<BreadResponseDTO> breads = menuService.getIngredientBreads("Bearer " + token);
        return ResponseEntity.ok(breads);
    }

    // Material Ingredients
    @GetMapping("/ingredients/materials")
    public ResponseEntity<List<MaterialResponseDTO>> getMaterialList(HttpServletRequest request) {
        String token = extractToken(request);
        List<MaterialResponseDTO> materials = menuService.getIngredientMaterials("Bearer " + token);
        return ResponseEntity.ok(materials);
    }

    // Cheese Ingredients
    @GetMapping("/ingredients/cheeses")
    public ResponseEntity<List<CheeseResponseDTO>> getCheeseList(HttpServletRequest request) {
        String token = extractToken(request);
        List<CheeseResponseDTO> cheeses = menuService.getIngredientCheeses("Bearer " + token);
        return ResponseEntity.ok(cheeses);
    }

    // Vegetable Ingredients
    @GetMapping("/ingredients/vegetables")
    public ResponseEntity<List<VegetableResponseDTO>> getVegetableList(HttpServletRequest request) {
        String token = extractToken(request);
        List<VegetableResponseDTO> vegetables = menuService.getIngredientVegetables("Bearer " + token);
        return ResponseEntity.ok(vegetables);
    }

    // Sauce Ingredients
    @GetMapping("/ingredients/sauces")
    public ResponseEntity<List<SauceResponseDTO>> getSauceList(HttpServletRequest request) {
        String token = extractToken(request);
        List<SauceResponseDTO> sauces = menuService.getIngredientSauces("Bearer " + token);
        return ResponseEntity.ok(sauces);
    }


    // =================== 장바구니 ===================
    @GetMapping("/cart")
    public ResponseEntity<CartResponseDTO> getCartItems(HttpServletRequest request) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getCartItems("Bearer " +token));
    }

    @PostMapping("/cart/update/{id}")
    public ResponseEntity<CartResponseDTO> updateCartItem(
            HttpServletRequest request,
            @PathVariable Long id,
            @RequestParam int amount) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.updateCartItem("Bearer " +token, id, amount));
    }

    @PostMapping("/cart/delete/{id}")
    public ResponseEntity<CartResponseDTO> deleteCartItem(
            HttpServletRequest request,
            @PathVariable Long id) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.deleteCartItem("Bearer " +token, id));
    }

    @PostMapping("/cart/delete-selected")
    public ResponseEntity<CartResponseDTO> deleteSelectedItems(
            HttpServletRequest request,
            @RequestParam List<Long> selectedIds) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.deleteSelectedItems("Bearer " +token, selectedIds));
    }

    @PostMapping("/cart/order/checkout")
    public ResponseEntity<CartResponseDTO> checkout(HttpServletRequest request) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.checkout("Bearer " +token));
    }

    @PostMapping("/cart/add")
    public ResponseEntity<CartResponseDTO> addToCart(
            HttpServletRequest request,
            @RequestParam Long menuId,
            @RequestParam int amount) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.addToCart("Bearer " +token, menuId, amount));
    }

    // =================== 커스텀 카트 ===================
    @GetMapping("/custom-carts")
    public ResponseEntity<List<CustomCartResponseDTO>> getAllCustomCarts(HttpServletRequest request) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getAllCustomCarts("Bearer " +token));
    }

    @GetMapping("/custom-carts/{uid}")
    public ResponseEntity<CustomCartResponseDTO> getCustomCart(
            HttpServletRequest request,
            @PathVariable Long uid) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getCustomCart("Bearer " +token, uid));
    }

    @PostMapping("/custom-carts")
    public ResponseEntity<CustomCartResponseDTO> createCustomCart(
            HttpServletRequest request,
            @RequestBody CustomCartRequestDTO dto) {
        String token = extractToken(request);
        System.out.println(dto.toString());
        return ResponseEntity.ok(menuService.createCustomCart("Bearer " +token, dto));
    }

    @DeleteMapping("/custom-carts/{uid}")
    public ResponseEntity<Void> deleteCustomCart(
            HttpServletRequest request,
            @PathVariable Long uid) {
        String token = extractToken(request);
        menuService.deleteCustomCart("Bearer " +token, uid);
        return ResponseEntity.noContent().build();
    }





    // =================== 메뉴 ===================


    @GetMapping
    public ResponseEntity<Iterable<MenuResponseDTO>> getMenus(HttpServletRequest request) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getMenus("Bearer " +token));
    }


    @GetMapping("/{menuName}")
    public ResponseEntity<MenuResponseDTO> getMenu(HttpServletRequest request, @PathVariable String menuName) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.getMenu("Bearer " +token, menuName));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<MenuResponseDTO> addMenu(
            HttpServletRequest request,
            @RequestPart("menu") MenuRequestDTO menu,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.addMenu("Bearer " +token, menu, file));
    }

    @PutMapping(value = "/{menuName}", consumes = "multipart/form-data")
    public ResponseEntity<MenuResponseDTO> updateMenu(
            HttpServletRequest request,
            @PathVariable String menuName,
            @RequestPart("menu") MenuRequestDTO menu,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        String token = extractToken(request);
        return ResponseEntity.ok(menuService.updateMenu("Bearer " +token, menuName, menu, file));
    }

    @DeleteMapping("/{menuName}")
    public ResponseEntity<Void> deleteMenu(HttpServletRequest request, @PathVariable String menuName) {
        String token = extractToken(request);
        menuService.deleteMenu("Bearer " +token, menuName);
        return ResponseEntity.noContent().build();
    }


}


