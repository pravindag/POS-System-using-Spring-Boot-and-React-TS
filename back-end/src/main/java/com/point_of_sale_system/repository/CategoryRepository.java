package com.point_of_sale_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.point_of_sale_system.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long>{

}
