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
    public CartResponseDTO getCartItems(String token) {
        return menuClient.getCartItems(token);
    }

    public CartResponseDTO updateCartItem(String token, Long id, int amount) {
        return menuClient.updateCartItem(token, id, amount);
    }

    public CartResponseDTO deleteCartItem(String token, Long id) {
        return menuClient.deleteCartItem(token, id);
    }

    public CartResponseDTO deleteSelectedItems(String token, List<Long> selectedIds) {
        return menuClient.deleteSelectedItems(token, selectedIds);
    }

    public CartResponseDTO checkout(String token) {
        return menuClient.checkout(token);
    }

    public CartResponseDTO addToCart(String token, Long menuId, int amount) {
        return menuClient.addToCart(token, menuId, amount);
    }
    public CartResponseDTO addSideToCart(String token, SideCartRequestDTO dto) {
        List<CartResponseDTO> responseList = menuClient.addSideToCart(token, dto);
        if (responseList != null && !responseList.isEmpty()) {
            return responseList.get(0); // 첫 번째 요소 반환 (필요에 따라 다른 로직 적용 가능)
        } else {
            // 리스트가 비어있거나 null일 경우 처리 (예: 빈 CartResponseDTO 반환)
            return new CartResponseDTO();
        }
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