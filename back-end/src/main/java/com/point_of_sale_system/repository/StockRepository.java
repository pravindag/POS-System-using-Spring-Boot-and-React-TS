package com.point_of_sale_system.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.point_of_sale_system.entity.Stock;

@Repository
@Transactional
public interface StockRepository extends JpaRepository<Stock, Long> {

    Page<Stock> findByCategoryId(Long categoryId, Pageable pageable);
    Stock findByItemId(Long itemId);
}
