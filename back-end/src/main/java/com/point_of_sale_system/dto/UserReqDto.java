package com.point_of_sale_system.dto;

import lombok.Data;

@Data
public class UserReqDto {

    private String username;
    private String password;
    private Long roleId;
    
}
