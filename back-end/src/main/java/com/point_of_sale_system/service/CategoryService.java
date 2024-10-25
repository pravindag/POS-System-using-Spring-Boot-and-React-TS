package com.point_of_sale_system.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.point_of_sale_system.entity.Category;

@Service
public interface CategoryService {

    Category createCategory(Category category);

    List<Category> getAllCategories();

    Category getCategoryById(Long id);

    Category updateCategory(Long id, Category category);

    String deleteCategory(Long id);
}
