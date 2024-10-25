package com.point_of_sale_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.point_of_sale_system.dto.UserReqDto;
import com.point_of_sale_system.entity.User;
import com.point_of_sale_system.entity.UserRole;
import com.point_of_sale_system.service.UserRoleService;
import com.point_of_sale_system.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRoleService userRoleService;
    
    @PostMapping("/user")
    public ResponseEntity<?> createUser(@RequestBody UserReqDto userReqDto) {
        try {
            User newUser = new User();
            newUser.setUsername(userReqDto.getUsername());
            newUser.setPassword(userReqDto.getPassword());

            UserRole userRole = userRoleService.getUserRoleById(userReqDto.getRoleId());
            newUser.setUserRole(userRole);

            userService.createUser(newUser);

            return ResponseEntity.status(201).body("You have created user successfully !");
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
