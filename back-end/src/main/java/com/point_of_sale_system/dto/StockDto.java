package com.point_of_sale_system.dto;

import com.point_of_sale_system.entity.Category;
import com.point_of_sale_system.entity.Item;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StockDto {
    
    private Long id;
    private Long categoryId;
    private Category category;
    private Long itemId;
    private Item item;
    private Integer quantity;

    public StockDto(Long id, Long categoryId, Long itemId, Integer quantity) {
        this.id = id;
        this.categoryId = categoryId;
        this.itemId = itemId;
        this.quantity = quantity;
    }
}
