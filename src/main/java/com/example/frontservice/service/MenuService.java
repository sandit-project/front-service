package com.example.frontservice.service;

import com.example.frontservice.client.edge.MenuClient;
import com.example.frontservice.dto.menu.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuClient menuClient;

    // Breads
    public List<BreadResponseDTO> getBreads(String token) {
        return  menuClient.getBreads(token);
    }

    public BreadResponseDTO getBread(String token, String breadName) {
        return menuClient.getBread(token, breadName);
    }

    public BreadResponseDTO addBread(String token, String breadRequestDTO, MultipartFile file) {

        return menuClient.addBread(token, breadRequestDTO, file);
    }

    public BreadResponseDTO updateBread(String token, String breadName, String breadRequestDTO, MultipartFile file) {
        return menuClient.updateBread(token, breadName, breadRequestDTO, file);
    }

    public void deleteBread(String token, String breadName) {
        menuClient.deleteBread(token, breadName);
    }

    // Cheeses
    public List<CheeseResponseDTO> getCheeses(String token) {
        return  menuClient.getCheeses(token);
    }

    public CheeseResponseDTO getCheese(String token, String cheeseName) {
        return menuClient.getCheese(token, cheeseName);
    }

    public CheeseResponseDTO addCheese(String token, String cheeseRequestDTO, MultipartFile file) {
        return menuClient.addCheese(token, cheeseRequestDTO, file);
    }

    public CheeseResponseDTO updateCheese(String token, String cheeseName, String cheeseRequestDTO, MultipartFile file) {
        return menuClient.updateCheese(token, cheeseName, cheeseRequestDTO, file);
    }

    public void deleteCheese(String token, String cheeseName) {
        menuClient.deleteCheese(token, cheeseName);
    }

    // Materials
    public List<MaterialResponseDTO> getMaterials(String token) {
        return  menuClient.getMaterials(token);
    }

    public MaterialResponseDTO getMaterial(String token, String materialName) {
        return menuClient.getMaterial(token, materialName);
    }

    public MaterialResponseDTO addMaterial(String token, String materialRequestDTO, MultipartFile file) {
        return menuClient.addMaterial(token, materialRequestDTO, file);
    }

    public MaterialResponseDTO updateMaterial(String token, String materialName, String materialRequestDTO, MultipartFile file) {
        return menuClient.updateMaterial(token, materialName, materialRequestDTO, file);
    }

    public void deleteMaterial(String token, String materialName) {
        menuClient.deleteMaterial(token, materialName);
    }

    // Sauces
    public List<SauceResponseDTO> getSauces(String token) {
        return  menuClient.getSauces(token);
    }

    public SauceResponseDTO getSauce(String token, String sauceName) {
        return menuClient.getSauce(token, sauceName);
    }

    public SauceResponseDTO addSauce(String token, String sauceRequestDTO, MultipartFile file) {
        return menuClient.addSauce(token, sauceRequestDTO, file);
    }

    public SauceResponseDTO updateSauce(String token, String sauceName, String sauceRequestDTO, MultipartFile file) {
        return menuClient.updateSauce(token, sauceName, sauceRequestDTO, file);
    }

    public void deleteSauce(String token, String sauceName) {
        menuClient.deleteSauce(token, sauceName);
    }

    // Vegetables
    public List<VegetableResponseDTO> getVegetables(String token) {
        return  menuClient.getVegetables(token);
    }

    public VegetableResponseDTO getVegetable(String token, String vegetableName) {
        return menuClient.getVegetable(token, vegetableName);
    }

    public VegetableResponseDTO addVegetable(String token, String vegetableRequestDTO, MultipartFile file) {
        return menuClient.addVegetable(token, vegetableRequestDTO, file);
    }

    public VegetableResponseDTO updateVegetable(String token, String vegetableName, String vegetableRequestDTO, MultipartFile file) {
        return menuClient.updateVegetable(token, vegetableName, vegetableRequestDTO, file);
    }

    public void deleteVegetable(String token, String vegetableName) {
        menuClient.deleteVegetable(token, vegetableName);
    }

    // Sides
    public List<SideResponseDTO> getSides(String token) {
        return  menuClient.getSides(token);
    }

    public SideResponseDTO getSide(String token, String sideName) {
        return menuClient.getSide(token, sideName);
    }

    public SideResponseDTO addSide(String token, String sideRequestDTO, MultipartFile file) {
        return menuClient.addSide(token, sideRequestDTO, file);
    }

    public SideResponseDTO updateSide(String token, String sideName, String sideRequestDTO, MultipartFile file) {
        return menuClient.updateSide(token, sideName, sideRequestDTO, file);
    }

    public void deleteSide(String token, String sideName) {
        menuClient.deleteSide(token, sideName);
    }




    // Cart
    public CartResponseDTO getCartItems(String token, Long userUid, Long socialUid) {
        // userUid 또는 socialUid가 제공되면 이를 기준으로 장바구니 항목을 필터링
        return menuClient.getCartItems(token, userUid, socialUid);
    }

    public CartResponseDTO updateCartItem(String token, Long id, int amount, Long userUid, Long socialUid) {
        // userUid 또는 socialUid를 사용해 장바구니 항목 수량 업데이트
        return menuClient.updateCartItem(token, id, amount, userUid, socialUid);
    }

    public CartResponseDTO deleteCartItem(String token, Long id, Long userUid, Long socialUid) {
        // 특정 장바구니 항목 삭제
        return menuClient.deleteCartItem(token, id, userUid, socialUid);
    }

    public CartResponseDTO deleteSelectedItems(String token, List<Long> selectedIds, Long userUid, Long socialUid) {
        // 선택된 장바구니 항목들 삭제
        return menuClient.deleteSelectedItems(token, selectedIds, userUid, socialUid);
    }

    public CartResponseDTO checkout(String token, Long userUid, Long socialUid) {
        // 결제 처리 후 장바구니 비우기
        return menuClient.checkout(token, userUid, socialUid);
    }

    public CartResponseDTO addToCart(String token, Long menuId, int amount, Long userUid, Long socialUid) {
        // userUid와 socialUid를 받아서 장바구니에 메뉴 추가
        return menuClient.addToCart(token, menuId, amount, userUid, socialUid);
    }

    public CartResponseDTO addSideToCart(String token, Long sideId, int amount, Long userUid, Long socialUid) {
        // 사이드 메뉴 추가
        return menuClient.addSideToCart(token, sideId,amount, userUid, socialUid);
//        if (responseList != null && !responseList.isEmpty()) {
//            return responseList.get(0); // 첫 번째 요소 반환
//        } else {
//            return new CartResponseDTO(); // 비어 있으면 기본 응답 객체 반환
//        }
    }






    // Ingredients
    public List<BreadResponseDTO> getIngredientBreads(String token) {
        return menuClient.getBreadList(token);
    }

    public List<MaterialResponseDTO> getIngredientMaterials(String token) {
        return menuClient.getMaterialList(token);
    }

    public List<CheeseResponseDTO> getIngredientCheeses(String token) {
        return menuClient.getCheeseList(token);
    }

    public List<VegetableResponseDTO> getIngredientVegetables(String token) {
        return menuClient.getVegetableList(token);
    }

    public List<SauceResponseDTO> getIngredientSauces(String token) {
        return menuClient.getSauceList(token);
    }





    // Custom Carts
    public List<CustomCartResponseDTO> getAllCustomCarts(String token) {
        return menuClient.getAllCustomCarts(token);
    }

    public CustomCartResponseDTO getCustomCart(String token, Long uid) {
        return menuClient.getCustomCart(token, uid);
    }

    public CustomCartResponseDTO createCustomCart(String token, String customCartRequestDTO) {
        return menuClient.createCustomCart(token, customCartRequestDTO);
    }

    public void deleteCustomCart(String token, Long uid) {
        menuClient.deleteCustomCart(token, uid);
    }


//menu
    public Iterable<MenuResponseDTO> getMenus(String token) {
        return menuClient.getMenus(token);
    }

    public MenuResponseDTO getMenu(String token, String menuName) {
        return menuClient.getMenu(token, menuName);
    }

    public MenuResponseDTO addMenu(String token, String menuRequestDTO, MultipartFile file) {
        return menuClient.addMenu(token, menuRequestDTO, file);
    }

    public MenuResponseDTO updateMenu(String token, String menuName, String menuRequestDTO, MultipartFile file) {
        return menuClient.updateMenu(token, menuName, menuRequestDTO, file);
    }

    public void deleteMenu(String token, String menuName) {
        menuClient.deleteMenu(token, menuName);
    }
}