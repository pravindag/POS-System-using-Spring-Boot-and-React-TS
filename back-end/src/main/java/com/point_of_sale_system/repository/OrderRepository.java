package com.point_of_sale_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.point_of_sale_system.entity.Order;

@Repository
@Transactional
public interface OrderRepository extends JpaRepository<Order, Long> {

}
