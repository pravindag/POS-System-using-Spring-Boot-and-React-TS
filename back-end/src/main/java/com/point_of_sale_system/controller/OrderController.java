package com.point_of_sale_system.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.point_of_sale_system.dto.OrderDetailsDto;
import com.point_of_sale_system.dto.OrderDto;
import com.point_of_sale_system.entity.Item;
import com.point_of_sale_system.entity.Order;
import com.point_of_sale_system.entity.OrderDetails;
import com.point_of_sale_system.entity.Stock;
import com.point_of_sale_system.service.ItemService;
import com.point_of_sale_system.service.OrderService;
import com.point_of_sale_system.service.StockService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private StockService stockService;

    @PostMapping("/order")
    public ResponseEntity<?> createOrder(@RequestBody OrderDto orderDto) {
        
        if (orderDto.getOrderDetails() == null || orderDto.getOrderDetails().isEmpty()) {
            return ResponseEntity.status(404).body("Please select valide Item!");
        }

        try {

            Order order = new Order();
            order.setTotalPrice(0.0);
            order.setTotalTax(0.0);

            List<OrderDetails> orderDetails = new ArrayList<>();

            for(OrderDetailsDto dto : orderDto.getOrderDetails()){

                Item item = itemService.getItemById(dto.getItemId());

                if(item != null){
                    OrderDetails orderDetail = new OrderDetails();

                    orderDetail.setItem(item);
                    orderDetail.setOrder(order);
                    orderDetail.setQuantity(dto.getQuantity());

                    orderDetails.add(orderDetail);

                    order.setTotalPrice(order.getTotalPrice() + item.getPrice() * dto.getQuantity());
                    order.setTotalTax(order.getTotalTax() + ((item.getPrice() * dto.getQuantity()) * 10) / 100);

                    Stock stock = stockService.getStockByItemId(item.getId());
                    if(stock != null){
                        stock.setQuantity(stock.getQuantity() - dto.getQuantity());
                        stockService.updateStock(stock);
                    }
                }
            }
            order.setUserId(orderDto.getUserId());
            order.setOrderDetails(orderDetails);

            boolean isCreatedOrder = orderService.createOrder(order);

            if(isCreatedOrder){
                return ResponseEntity.status(201).body("You have successfully created Order");
            }else{
                return ResponseEntity.status(404).body("There is an error in creating Order!");
            }

        } catch (Exception e) { 
            return ResponseEntity.status(404).body("There is an error in creating Order!");
        }
    }


    
}
