package com.point_of_sale_system.dto;

import java.util.List;

import com.point_of_sale_system.entity.Order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderDto {
    
    private Long id;
    private Long userId;
    private List<OrderDetailsDto> orderDetails;

    public OrderDto (Order order, List<OrderDetailsDto> orderDetails) {

    }

}
