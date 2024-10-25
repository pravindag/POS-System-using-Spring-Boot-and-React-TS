package com.point_of_sale_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.point_of_sale_system.entity.Order;
import com.point_of_sale_system.repository.OrderRepository;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public boolean createOrder(Order order) {
        try {
            orderRepository.save(order);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
}
