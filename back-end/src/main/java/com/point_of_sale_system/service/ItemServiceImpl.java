package com.point_of_sale_system.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.point_of_sale_system.entity.Item;
import com.point_of_sale_system.repository.ItemRepository;

@Service
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Override
    public boolean createItem(Item item) {
        try {
            itemRepository.save(item);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public Page<Item> getAllItems(Pageable pageable) {
        return itemRepository.findAll(pageable);
    }

    @Override
    public Page<Item> getItemsByCategoryId(Long categoryId, Pageable pageable) {
        return itemRepository.findByCategoryId(categoryId, pageable);
    }

    @Override
    public Long getItemCountByCategoryId(Long categoryId) {
        if(categoryId == 0){
            return itemRepository.count();
        }else{
            return Long.valueOf(itemRepository.findByCategoryId(categoryId).size());
        }
    }

    @Override
    public Item getItemById(Long itemId) {
        return itemRepository.findById(itemId).orElse(null);
    }

    @Override
    public boolean deleteItem(Long itemId) {
        try {
            itemRepository.deleteById(itemId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean updateItem(Item item) {
        try {
            Item existingItem = getItemById(item.getId());

            if(existingItem != null){

                existingItem.setName(item.getName());
                existingItem.setDescription(item.getDescription());
                existingItem.setPrice(item.getPrice());
                existingItem.setCategory(item.getCategory());
                existingItem.setImageName(item.getImageName());
                existingItem.setImagePath(item.getImagePath());

                itemRepository.save(existingItem);

                return true;
            }

            return false;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public List<Item> getItemsByCategoryId(Long categoryId) {
        return itemRepository.findByCategoryId(categoryId);
    }
    
}
