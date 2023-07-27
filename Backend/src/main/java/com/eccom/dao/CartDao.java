package com.eccom.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.eccom.entity.Cart;
import com.eccom.entity.User;

@Repository
public interface CartDao extends CrudRepository<Cart, Integer> {

	public List<Cart> findByUser(User user);
}
