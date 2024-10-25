package com.point_of_sale_system.service;

import org.springframework.stereotype.Service;

import com.point_of_sale_system.entity.UserRole;

@Service
public interface UserRoleService {
    UserRole getUserRoleById(Long id);
}
