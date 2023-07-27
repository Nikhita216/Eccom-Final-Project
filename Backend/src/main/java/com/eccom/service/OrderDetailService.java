package com.eccom.service;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transaction;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eccom.configuration.JwtRequestFilter;
import com.eccom.dao.CartDao;
import com.eccom.dao.OrderDetailDao;
import com.eccom.dao.ProductDao;
import com.eccom.dao.UserDao;
import com.eccom.entity.Cart;
import com.eccom.entity.OrderDetail;
import com.eccom.entity.OrderInput;
import com.eccom.entity.OrderProductQuantity;
import com.eccom.entity.Product;
import com.eccom.entity.TransactionDetails;
import com.eccom.entity.User;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@Service
public class OrderDetailService {
	
	private static final String ORDER_PLACED="Placed";
	
	private static final String KEY="rzp_test_ZqCwcBkn3bVGfD";
	private static final String KEY_SECRET="GqHUcksTvBVxtAZxh9OhnOyx";
	private static final String CURRENCY="INR";
	
	@Autowired
	private OrderDetailDao orderDetailDao;
	
	@Autowired
	private ProductDao productDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private CartDao cartDao;
	
	public List<OrderDetail> getOrderDetails() {
		String currentUser=JwtRequestFilter.CURRENT_USER;
		User user= userDao.findById(currentUser).get();
		
		return orderDetailDao.findByUser(user);
		
	}
	
	public List<OrderDetail> getAllOrderDetails(String status) {
		List<OrderDetail> orderDetails=new ArrayList<>();
		
		if(status.equals("All")) {
		 orderDetailDao.findAll().forEach(
				 x->orderDetails.add(x));
		}
		else {
			orderDetailDao.findByOrderStatus(status).forEach(
					x->orderDetails.add(x));
		}
		return orderDetails;
	}
	

	public void placeOrder(OrderInput orderInput, boolean isSingleProductCheckout) {
		
	List<OrderProductQuantity> productQuantityList=	orderInput.getOrderProductQuantityList();
	for(OrderProductQuantity o: productQuantityList) {
	Product product=	productDao.findById(o.getProductId()).get();
	
	String currentUser= JwtRequestFilter.CURRENT_USER;
	User user = userDao.findById(currentUser).get();
	
		OrderDetail orderDetail = new OrderDetail(
				orderInput.getFullName(),
				orderInput.getFullAddress(),
				orderInput.getContactNumber(),
				orderInput.getAlternateContactNumber(),
				ORDER_PLACED,
				product.getProductDiscountedPrice()*o.getQuantity(),
				product,
				user,
				orderInput.getTransactionId());
		if(!isSingleProductCheckout) {
			List<Cart> carts = cartDao.findByUser(user);
			carts.stream().forEach(x->cartDao.deleteById(x.getCartId()));
		}
		
		 orderDetailDao.save(orderDetail);
	}
	}
	
	public void markOrderAsDelivered(Integer orderId) {
		OrderDetail orderDetail= orderDetailDao.findById(orderId).get();
		if(orderDetail!=null) {
			orderDetail.setOrderStatus("Delivered");
			orderDetailDao.save(orderDetail);
		}
	}
	
	
	public TransactionDetails createTransaction(Double amount) {
		
		try {
			JSONObject jsonObject=new JSONObject();
			jsonObject.put("amount", (amount*100));
			jsonObject.put("currency", CURRENCY);
			
			
			RazorpayClient razorpayClient=new RazorpayClient(KEY, KEY_SECRET);
			Order order= razorpayClient.orders.create(jsonObject);
			
			
			TransactionDetails transactionDetails =prepareTransactionDetails(order);
			return transactionDetails;
			
			
		} 
		catch (Exception e) {
			// TODO Auto-generated catch block
		System.out.println(e.getMessage());
		}
		return null;
		
	}
	
	private TransactionDetails prepareTransactionDetails(Order order) {
		String orderId=order.get("id");
		String currency = order.get("currency");
		Integer amount=order.get("amount");
		
		TransactionDetails transactionDetails=new TransactionDetails(orderId,currency,amount,KEY);
		return transactionDetails;
	}
	
	public void deleteMyOrderItem(Integer orderId) {
		orderDetailDao.deleteById(orderId);
	}
}
