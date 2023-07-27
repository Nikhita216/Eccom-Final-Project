package com.eccom.dao;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

import com.eccom.entity.OrderDetail;
import com.eccom.entity.Product;

public interface ProductDao extends CrudRepository<Product, Integer> {
	public List<Product> findAll(Pageable pageable) ;
	
	
	public List<Product> findByProductNameContainingIgnoreCaseOrProductDesciptionContainingIgnoreCase
	(String key1,String key2,Pageable pageable);

	public List<Product> findByProductCategory(String productCategory);
	
	
}
