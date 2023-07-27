package com.eccom.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.eccom.entity.OrderDetail;
import com.eccom.entity.User;

public interface OrderDetailDao extends CrudRepository<OrderDetail, Integer>{

	public List<OrderDetail> findByUser(User user);
	
	public List<OrderDetail> findByOrderStatus(String status);
}
