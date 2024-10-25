package com.point_of_sale_system.service;

import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.point_of_sale_system.entity.Item;

@Service
public interface ItemService {

    boolean createItem(Item item);
    boolean updateItem(Item item);
    Page<Item> getAllItems(Pageable pageable);
    Page<Item> getItemsByCategoryId(Long categoryId, Pageable pageable);
    List<Item> getItemsByCategoryId(Long categoryId);
    Long getItemCountByCategoryId(Long categoryId);
    Item getItemById(Long itemId);
    boolean deleteItem(Long itemId);
}
