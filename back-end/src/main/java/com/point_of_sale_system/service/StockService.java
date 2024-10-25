package com.point_of_sale_system.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.point_of_sale_system.entity.Stock;

@Service
public interface StockService {

    boolean createStock(Stock stock);
    boolean updateStock(Stock stock);
    Page<Stock> getAllStocksByCategoryId(Long categoryId, Pageable pageable);
    Stock getStockById(Long stockId);
    boolean deleteStockById(Long stockId);
    Stock getStockByItemId(Long itemId);
}
