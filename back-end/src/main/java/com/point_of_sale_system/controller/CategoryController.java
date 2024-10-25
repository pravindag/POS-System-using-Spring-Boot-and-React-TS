package com.point_of_sale_system.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.point_of_sale_system.dto.CategoryDto;
import com.point_of_sale_system.entity.Category;
import com.point_of_sale_system.service.CategoryService;
import com.point_of_sale_system.service.ItemService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ItemService itemService;

    @GetMapping("/categories")
    public ResponseEntity<List<?>> getAllCategories() {

        List<Category> categories = categoryService.getAllCategories();

        if(categories == null){
            return ResponseEntity.status(404).body(null);
        }else{
            return ResponseEntity.status(200).body(categories);
        }
    }

    @GetMapping("/categories-with-items-count")
    public ResponseEntity<List<?>> getAllCategoriesWithItemsCount() {

        List<Category> categories = categoryService.getAllCategories();

        Category setAllCategory = new Category();
        setAllCategory.setId((long) 0);
        setAllCategory.setName("All");
        setAllCategory.setDescription("All Items");
        categories.add(0, setAllCategory);

        List<CategoryDto> categoryDtos = categories.stream().map(category -> {
            Long itemsCount = itemService.getItemCountByCategoryId(category.getId());
            return new CategoryDto(category.getId(), category.getName(), category.getDescription(), itemsCount);
        }).collect(Collectors.toList());

        if(categoryDtos == null){
            return ResponseEntity.status(404).body(null);
        }else{
            return ResponseEntity.status(200).body(categoryDtos);
        }
    }
    
}
