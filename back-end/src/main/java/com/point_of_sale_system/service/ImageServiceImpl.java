package com.point_of_sale_system.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.point_of_sale_system.dto.ImageDto;

@Service
public class ImageServiceImpl implements ImageService {

    @Value("${spring.web.resources.static-locations}")
    private String uploadDir;

    @Override
    public Map<String, Object> uploadNewImage(MultipartFile file, ImageDto imageDto) {

        Map<String, Object> response = new HashMap<>();

        try {

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || !originalFilename.matches(".*\\.(jpg|jpeg|png|gif)$")) {
                response.put("status", "error");
                response.put("message", "Invalid image file format");
                return response;
            }

            String imageName = imageDto.getImageName();
            if (!imageName.matches(".*\\.(jpg|jpeg|png|gif)$")) {
                imageName += originalFilename.substring(originalFilename.lastIndexOf('.'));
            }

            Path imagePath = Paths.get(uploadDir.replace("file:", "")).resolve(imageDto.getImagePath()).resolve(imageName);

            Files.createDirectories(imagePath.getParent());

            Files.copy(file.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

            imageDto.setImageName(imageName);
            imageDto.setImagePath(imagePath.toString());

            response.put("status", "success");
            response.put("imageDto", imageDto);
            return response;

        } catch (IOException e) {
            response.put("status", "error");
            response.put("message", "Failed to upload image: " + e.getMessage());
            return response;
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", "Invalid input: " + e.getMessage());
            return response;
        }
    }

    @Override
    public boolean deleteImage(ImageDto imageDto) {
        
        if (imageDto != null) {
            File imageFile = new File(imageDto.getImagePath());

            if (imageFile.exists()) {
                imageFile.delete();
                return true;
            }else {
                return false;
            }
        }
        return false;
    }
}
