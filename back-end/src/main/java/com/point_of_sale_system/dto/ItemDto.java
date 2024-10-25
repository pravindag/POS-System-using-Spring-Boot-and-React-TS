package com.point_of_sale_system.dto;

import com.point_of_sale_system.entity.Category;
import com.point_of_sale_system.entity.Item;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ItemDto {
    
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String imageName;
    private String imagePath;
    private Long categoryId;
    private Category category;
    private Integer stockQuantity;

    public ItemDto(Item item, Category category) {
        this.id = item.getId();
        this.name = item.getName();
        this.description = item.getDescription();
        this.price = item.getPrice();
        this.imageName = item.getImageName();
        this.imagePath = item.getImagePath();
        this.category = item.getCategory();
    }
}
