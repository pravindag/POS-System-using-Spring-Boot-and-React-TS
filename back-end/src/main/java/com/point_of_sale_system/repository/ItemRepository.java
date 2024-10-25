package com.point_of_sale_system.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.point_of_sale_system.entity.Item;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long>{

    Page<Item> findByCategoryId(Long categoryId, Pageable pageable);
    List<Item> findByCategoryId(Long categoryId);
}
