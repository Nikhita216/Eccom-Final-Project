package com.eccom.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.eccom.configuration.JwtRequestFilter;
import com.eccom.dao.CartDao;
import com.eccom.dao.ProductDao;
import com.eccom.dao.UserDao;
import com.eccom.entity.Cart;
import com.eccom.entity.OrderDetail;
import com.eccom.entity.Product;
import com.eccom.entity.User;

@Service
public class ProductService {
	
	@Autowired
	private ProductDao productDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private CartDao cartDao;
	
	
	public ArrayList<String> getCurrentUserDetails() {
		String currentUser=JwtRequestFilter.CURRENT_USER;
		User user= userDao.findById(currentUser).get();
		String un=user.getUserName();
		String u1= user.getUserFullName();
		
		ArrayList<String> userData=new ArrayList<>();
		userData.add(un);
		userData.add(u1);
		
		return userData;
		
	}

	public Product addNewProduct(Product product) {
		Product p = productDao.save(product);
		return p;
	}
	public List<Product> getAllProducts(int pageNumber,String searchKey){
		Pageable pageble =PageRequest.of(pageNumber, 8);
		
		if(searchKey.equals("")) {
			return	(List<Product>) productDao.findAll(pageble);
		}
		else {
		return (List<Product>)	productDao.findByProductNameContainingIgnoreCaseOrProductDesciptionContainingIgnoreCase
				(searchKey, searchKey, pageble);
			
		}
	
		
	}
	
	public List<Product> getAllProducts1(int pageNumber,String searchKey){
		Pageable pageble =PageRequest.of(pageNumber, 30);
		
		if(searchKey.equals("")) {
			return	(List<Product>) productDao.findAll(pageble);
		}
		else {
		return (List<Product>)	productDao.findByProductNameContainingIgnoreCaseOrProductDesciptionContainingIgnoreCase
				(searchKey, searchKey, pageble);
			
		}
	
		
	}
	
	
	public Product getProductDetailsById(Integer productId) {
		return productDao.findById(productId).get();
	}
	
	public void deleteProductDetails(Integer productId) {
		productDao.deleteById(productId);
	}
	
	public List<Product> getProductDetails(boolean isSingleProductCheckout,Integer productId) {
		if(isSingleProductCheckout && productId!=0) {
			
			List<Product> list = new ArrayList<>();
			Product product= productDao.findById(productId).get();
			list.add(product);
			return list;
		}
		else {
			String username= JwtRequestFilter.CURRENT_USER;
			
			User user=userDao.findById(username).get();
			
			List<Cart> carts= cartDao.findByUser(user);
			
		return	carts.stream().map(x->x.getProduct()).collect(Collectors.toList());
			
		}
		
	}
	
	public List<Product> getProductsByCategory(String productCategory) {
		List<Product> productDetails=new ArrayList<>();
		if(productCategory.equals("All")) {
			productDao.findAll().forEach(
					x->productDetails.add(x));
		}
		else {
			productDao.findByProductCategory(productCategory).forEach(x->productDetails.add(x));
		}
		return productDetails;
	}
	
	
}
