package com.point_of_sale_system.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.point_of_sale_system.dto.ImageDto;

@Service
public interface ImageService {

    Map<String, Object> uploadNewImage(MultipartFile file, ImageDto imageDto);
    boolean deleteImage(ImageDto imageDto);
}
