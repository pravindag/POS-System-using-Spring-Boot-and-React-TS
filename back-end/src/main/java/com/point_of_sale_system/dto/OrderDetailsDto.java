package com.point_of_sale_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderDetailsDto {
    
    private Long id;
    private Long itemId;
    private Integer quantity;

}
