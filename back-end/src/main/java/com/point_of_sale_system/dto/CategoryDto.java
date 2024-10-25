package com.point_of_sale_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CategoryDto {
    
    private Long id;
    private String name;
    private String description;
    private Long itemsCount;
}
