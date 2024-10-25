package com.point_of_sale_system.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.point_of_sale_system.dto.ImageDto;
import com.point_of_sale_system.dto.ItemDto;
import com.point_of_sale_system.entity.Category;
import com.point_of_sale_system.entity.Item;
import com.point_of_sale_system.entity.Stock;
import com.point_of_sale_system.service.CategoryService;
import com.point_of_sale_system.service.ImageService;
import com.point_of_sale_system.service.ItemService;
import com.point_of_sale_system.service.StockService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private ImageService imageService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private StockService stockService;
    
    @PostMapping("/item")
    public ResponseEntity<?> createItem(@RequestParam("image") MultipartFile file, ItemDto itemDto) {
        if (itemDto.getName() == null || itemDto.getName() == "") {
            return ResponseEntity.status(404).body("Please enter valide Item Name!");
        }

        if (itemDto.getCategoryId() == 0 || itemDto.getCategoryId() < 0) {
            return ResponseEntity.status(404).body("Please select a Category!");
        }

        if (file.isEmpty()) {
            return ResponseEntity.status(404).body("Please upload a image!");
        }

        try {

            Category category = categoryService.getCategoryById(itemDto.getCategoryId());

            Map<String, Object> imageResponse = uploadImage(file, category);

            if("success".equals(imageResponse.get("status"))){

                ImageDto imageDto = (ImageDto) imageResponse.get("imageDto");

                Item newItem = setItemData(itemDto, imageDto, category);

                boolean isCreatedItem = itemService.createItem(newItem);
                if(isCreatedItem){
                    return ResponseEntity.status(201).body("You have successfully created Item");
                }else{
                    return ResponseEntity.status(404).body("There is an error in creating Item!");
                }
            }

            return ResponseEntity.status(404).body(imageResponse.get("message"));
        } catch (Exception e) {
            return ResponseEntity.status(404).body("There is an error in creating Item!");
        }
    }

    @PutMapping("/item/{itemId}")
    public ResponseEntity<?> updateItem(@PathVariable Long itemId, @RequestParam("image") MultipartFile file, ItemDto itemDto) {
        if (itemDto.getName() == null || itemDto.getName() == "") {
            return ResponseEntity.status(404).body("Please enter valide Item Name!");
        }

        if (itemDto.getCategoryId() == 0 || itemDto.getCategoryId() < 0) {
            return ResponseEntity.status(404).body("Please select a Category!");
        }

        if (file.isEmpty()) {
            return ResponseEntity.status(404).body("Please upload a image!");
        }

        try {

            ImageDto oldImageDto = new ImageDto(
                                    itemDto.getImageName(), 
                                    itemDto.getImagePath()
                                );

            boolean isDeleteImage = imageService.deleteImage(oldImageDto);

            if(!isDeleteImage){
                return ResponseEntity.status(404).body("There is an error in updating Item!");
            }

            Category category = categoryService.getCategoryById(itemDto.getCategoryId());

            Map<String, Object> imageResponse = uploadImage(file, category); 

            if("success".equals(imageResponse.get("status"))){

                ImageDto imageDto = (ImageDto) imageResponse.get("imageDto");

                Item item = setItemData(itemDto, imageDto, category);

                boolean isUpdatedItem = itemService.updateItem(item);
                if(isUpdatedItem){
                    return ResponseEntity.status(201).body("You have successfully updated Item");
                }else{
                    return ResponseEntity.status(404).body("There is an error in updating Item!");
                }
            }

            return ResponseEntity.status(404).body(imageResponse.get("message"));
        } catch (Exception e) {
            return ResponseEntity.status(404).body("There is an error in updating Item!");
        }
    }

    @GetMapping("/items-with-images")
    public ResponseEntity<Map<String, Object>> getAllItemsWithImages(
            @RequestParam(defaultValue = "0") Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
              
        Map<String, Object> response = new HashMap<>();

        try {
            Pageable pageable = PageRequest.of(page, size);

            Page<Item> items;
            if(categoryId == 0){
                items = itemService.getAllItems(pageable);
            }else{
                items = itemService.getItemsByCategoryId(categoryId,pageable);
            }

            List<ItemDto> itemDtos = items.getContent().stream().map(item -> {

                ItemDto itemDto = new ItemDto();
                itemDto.setId(item.getId());
                itemDto.setName(item.getName());
                itemDto.setDescription(item.getDescription());
                itemDto.setPrice(item.getPrice());
                itemDto.setImageName(item.getImageName());
                itemDto.setImagePath(item.getImagePath());                
                itemDto.setCategory(item.getCategory());

                Stock stock = stockService.getStockByItemId(item.getId());
                itemDto.setStockQuantity(stock == null ? 0 : stock.getQuantity());

                return itemDto;

            }).collect(Collectors.toList());

            response.put("items", itemDtos);
            response.put("currentPage", items.getNumber());
            response.put("totalItems", items.getTotalElements());
            response.put("totalPages", items.getTotalPages());

            return ResponseEntity.status(201).body(response);
        } catch (Exception e) {
            response.put("error", "There is an error in getting Items!");
            return ResponseEntity.status(404).body(response);
        }
    }

    @GetMapping("/item-by-id-with-image/{itemId}")
    public ResponseEntity<?> getItemByIdWithImage(@PathVariable Long itemId) {
        Item item = itemService.getItemById(itemId);

        if(item == null){
            return ResponseEntity.status(404).body("There is an error in getting Item!");
        }else{
            return ResponseEntity.status(200).body(item);
        }
    }

    @GetMapping("/items/{categoryId}")
    public ResponseEntity<?> getItemsByCcategoryId(@PathVariable Long categoryId) {
        List<Item> items = itemService.getItemsByCategoryId(categoryId);

        if(items == null){
            return ResponseEntity.status(404).body("There is an error in getting Items!");
        }else{
            return ResponseEntity.status(200).body(items);
        }
    }
    

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<?> deleteItem(@PathVariable Long itemId) {
        
        Item item = itemService.getItemById(itemId);

        ImageDto imageDto = new ImageDto(
                                    item.getImageName(), 
                                    item.getImagePath()
                                );

        boolean isDeleteImage = imageService.deleteImage(imageDto);

        if(isDeleteImage){
            boolean isDeleteItem = itemService.deleteItem(itemId);

            if(isDeleteItem){
                return ResponseEntity.status(200).body("You have successfully deleted");
            }
            return ResponseEntity.status(404).body("There is an error in deleting Item!");
        }
        return ResponseEntity.status(404).body("There is an error in deleting Item!");
    }

    private Map<String, Object> uploadImage(MultipartFile imageFile, Category category) {

        String folderNameForPath = category.getName().toLowerCase();

        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        String imageName = "img_" + dateTimeFormatter.format(LocalDateTime.now());

        ImageDto image = new ImageDto(imageName, folderNameForPath);

        return imageService.uploadNewImage(imageFile, image);

    }
    
    private Item setItemData(ItemDto itemDto, ImageDto imageDto, Category category) {

        Item item = new Item();

        item.setId((itemDto.getId() == null || itemDto.getId() == 0) ? 0 : itemDto.getId());
        item.setName(itemDto.getName());
        item.setDescription(itemDto.getDescription());
        item.setPrice(itemDto.getPrice());
        item.setCategory(category);
        item.setImageName(imageDto.getImageName());
        item.setImagePath(imageDto.getImagePath());

        return item;
    }
    
}
