package com.eccom.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eccom.configuration.JwtRequestFilter;
import com.eccom.dao.CartDao;
import com.eccom.dao.ProductDao;
import com.eccom.dao.UserDao;
import com.eccom.entity.Cart;
import com.eccom.entity.Product;
import com.eccom.entity.User;

@Service
public class CartService {

	@Autowired
	private CartDao cartDao;
	
	@Autowired
	private ProductDao productDao;
	
	@Autowired
	private UserDao userDao;
	
	
	
	public void deleteCartItem(Integer cartId) {
		cartDao.deleteById(cartId);
	}
	
	
	
	public Cart addToCart(Integer productId) {
	 Product product=	productDao.findById(productId).get();
	 
	String username =JwtRequestFilter.CURRENT_USER;
	
	User user=null;
	if(username !=null) {
		user= userDao.findById(username).get();
	}
	
	List<Cart> cartList= cartDao.findByUser(user);
	List<Cart> filteredList= cartList.stream().filter(x->x.getProduct().getProductId()==productId).collect(Collectors.toList());
	if (filteredList.size()>0) {
		return null;
	}

	 
	 if(product != null&& user !=null) {
		 Cart cart = new Cart(product,user);
		return  cartDao.save(cart);
	 }
	return null;
	}
	
	public List<Cart> getCartDetails(){
		String username=JwtRequestFilter.CURRENT_USER;
		User user = userDao.findById(username).get();
		return cartDao.findByUser(user);
	}
}
