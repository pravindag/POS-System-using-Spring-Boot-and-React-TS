package com.point_of_sale_system.service;

import org.springframework.stereotype.Service;

import com.point_of_sale_system.entity.User;

@Service
public interface UserService {
    User createUser(User user);
}
