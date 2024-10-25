package com.point_of_sale_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.point_of_sale_system.entity.Stock;
import com.point_of_sale_system.repository.StockRepository;

@Service
public class StockServiceImpl implements StockService{

    @Autowired
    private StockRepository stockRepository;

    @Override
    public boolean createStock(Stock stock) {
        try {
            stockRepository.save(stock);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public Page<Stock> getAllStocksByCategoryId(Long categoryId, Pageable pageable) {
        return stockRepository.findByCategoryId(categoryId, pageable);
    }

    @Override
    public Stock getStockById(Long stockId) {
        return stockRepository.findById(stockId).orElse(null);
    }

    @Override
    public boolean updateStock(Stock stock) {
        try {
            Stock existingStock = getStockById(stock.getId());

            if(existingStock != null){

                existingStock.setQuantity(stock.getQuantity());
                stockRepository.save(existingStock);

                return true;
            }
            
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean deleteStockById(Long stockId) {
        try {
            stockRepository.deleteById(stockId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public Stock getStockByItemId(Long itemId) {
        try {
            return stockRepository.findByItemId(itemId);
        } catch (Exception e) {
            return null;
        }
    }
    
}
