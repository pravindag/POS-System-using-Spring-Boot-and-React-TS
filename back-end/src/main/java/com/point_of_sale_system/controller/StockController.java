package com.point_of_sale_system.controller;

import org.springframework.web.bind.annotation.RestController;

import com.point_of_sale_system.dto.StockDto;
import com.point_of_sale_system.entity.Category;
import com.point_of_sale_system.entity.Item;
import com.point_of_sale_system.entity.Stock;
import com.point_of_sale_system.service.CategoryService;
import com.point_of_sale_system.service.ItemService;
import com.point_of_sale_system.service.StockService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class StockController {
    
    @Autowired
    private StockService stockService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ItemService itemService;

    @PostMapping("/stock")
    public ResponseEntity<?> createStock(@RequestBody StockDto stockDto) {
        
        if (stockDto.getCategoryId() == 0 || stockDto.getCategoryId() < 0) {
            return ResponseEntity.status(404).body("Please select valide Category!");
        }

        if (stockDto.getItemId() == 0 || stockDto.getItemId() < 0) {
            return ResponseEntity.status(404).body("Please select valide Item!");
        }

        if (stockDto.getQuantity() == 0 || stockDto.getQuantity() < 0) {
            return ResponseEntity.status(404).body("Please enter valide Quantity!");
        }

        try {
            Category category = categoryService.getCategoryById(stockDto.getCategoryId());
            Item item = itemService.getItemById(stockDto.getItemId());

            Stock newStock = setStockData(stockDto, category, item);

            boolean isCreatedStock = stockService.createStock(newStock);
            if(isCreatedStock){
                return ResponseEntity.status(201).body("You have successfully created Stock");
            }else{
                return ResponseEntity.status(404).body("There is an error in creating Stock!");
            }

        } catch (Exception e) {
            return ResponseEntity.status(404).body("There is an error in creating Stock!");
        }
    }

    @PutMapping("/stock/{stockId}")
    public ResponseEntity<?> updateStock(@PathVariable Long stockId, @RequestBody StockDto stockDto) {
        if (stockDto.getCategoryId() == 0 || stockDto.getCategoryId() < 0) {
            return ResponseEntity.status(404).body("Please select valide Category!");
        }

        if (stockDto.getItemId() == 0 || stockDto.getItemId() < 0) {
            return ResponseEntity.status(404).body("Please select valide Item!");
        }

        if (stockDto.getQuantity() == 0 || stockDto.getQuantity() < 0) {
            return ResponseEntity.status(404).body("Please enter valide Quantity!");
        }

        try {
            Category category = categoryService.getCategoryById(stockDto.getCategoryId());
            Item item = itemService.getItemById(stockDto.getItemId());

            Stock stock = setStockData(stockDto, category, item);

            boolean isCreatedStock = stockService.updateStock(stock);
            if(isCreatedStock){
                return ResponseEntity.status(201).body("You have successfully updated Stock");
            }else{
                return ResponseEntity.status(404).body("There is an error in updating Stock!");
            }

        } catch (Exception e) {
            return ResponseEntity.status(404).body("There is an error in updating Stock!");
        }
    }

    @GetMapping("/stocks")
    public ResponseEntity<Map<String, Object>> getAllStocksByCategoryId(
                        @RequestParam(defaultValue = "0") Long categoryId,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {

        Map<String, Object> response = new HashMap<>();

        try {
            Pageable pageable = PageRequest.of(page, size);

            Page<Stock> stocks = stockService.getAllStocksByCategoryId(categoryId, pageable);

            List<StockDto> stockDtos = stocks.getContent().stream().map(stock -> { 
                StockDto stockDto = new StockDto();
                stockDto.setId(stock.getId());
                stockDto.setQuantity(stock.getQuantity());
                stockDto.setCategory(stock.getCategory());
                stockDto.setItem(stock.getItem());
                return stockDto;
            }).collect(Collectors.toList());

            response.put("stocks", stockDtos);
            response.put("currentPage", stocks.getNumber());
            response.put("totalStocks", stocks.getTotalElements());
            response.put("totalPages", stocks.getTotalPages());

            return ResponseEntity.status(201).body(response);
        } catch (Exception e) {
            response.put("error", "There is an error in getting Stocks!");
            return ResponseEntity.status(404).body(response);
        }
    }
    
    @GetMapping("/stock/{stockId}")
    public ResponseEntity<?> getStockById(@PathVariable Long stockId) {
        Stock stock = stockService.getStockById(stockId);

        if(stock == null){
            return ResponseEntity.status(404).body("There is an error in getting Stock!");
        }else{
            return ResponseEntity.status(200).body(stock);
        }
    }

    @DeleteMapping("/stock/{stockId}")
    public ResponseEntity<?> deleteStockById(@PathVariable Long stockId) {
        boolean isDelete = stockService.deleteStockById(stockId);

        if(!isDelete){
            return ResponseEntity.status(404).body("There is an error in deleting Stock!");
        }else{
            return ResponseEntity.status(200).body("You have successfully deleted Stock");
        }
    }
    

    private Stock setStockData(StockDto stockDto, Category category, Item item) {

        Stock stock = new Stock();

        stock.setId((stockDto.getId() == null || stockDto.getId() == 0) ? 0 : stockDto.getId());
        stock.setCategory(category);
        stock.setItem(item);
        stock.setQuantity(stockDto.getQuantity());

        return stock;
    }
    
}
