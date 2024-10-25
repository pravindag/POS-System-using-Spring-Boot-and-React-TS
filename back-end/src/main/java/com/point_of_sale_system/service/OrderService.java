package com.point_of_sale_system.service;

import org.springframework.stereotype.Service;

import com.point_of_sale_system.entity.Order;

@Service
public interface OrderService {

    boolean createOrder(Order order);
}
