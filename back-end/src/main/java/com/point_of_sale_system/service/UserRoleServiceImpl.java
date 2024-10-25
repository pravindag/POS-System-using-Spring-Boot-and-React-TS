package com.point_of_sale_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.point_of_sale_system.entity.UserRole;
import com.point_of_sale_system.repository.UserRoleRepository;

@Service
public class UserRoleServiceImpl implements UserRoleService{

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Override
    public UserRole getUserRoleById(Long id) {
        return userRoleRepository.findById(id).orElse(null);
    }
    
}
