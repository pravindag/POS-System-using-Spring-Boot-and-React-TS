package com.point_of_sale_system.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.point_of_sale_system.entity.User;
import com.point_of_sale_system.repository.UserRepository;
import com.point_of_sale_system.security.JwtUtils;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login (@RequestBody User user) {

        if(user.getUsername() == null || user.getUsername() == ""){
            return ResponseEntity.status(400).body("Please enter a valid user name !");
        }

        if(user.getPassword() == null || user.getPassword() == ""){
            return ResponseEntity.status(400).body("Please enter a valid password !");
        }

        try {
            Map<String,String> response = new HashMap<String, String>();

            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwtToken = jwtUtils.generateJwtToken(authentication);
            response.put("token", jwtToken);

            User userDetails = userRepository.findByUsername(user.getUsername()).orElse(null); 
            response.put("role", userDetails.getUserRole().getRole());

            return ResponseEntity.status(201).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }

        
    }

}
