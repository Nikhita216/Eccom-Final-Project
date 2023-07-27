import { MyOrderDetails } from './../_model/order.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../_model/Product.model';
import { OrderDetails } from '../_model/order-details.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpclient: HttpClient) { }



  public createTransaction(amount:number){
    return this.httpclient.get("http://localhost:9090/createTransaction/"+amount);
  }


  public markAsDelivered(orderId :number){
    return this.httpclient.get("http://localhost:9090/markOrderAsDelivered/"+orderId);
  }

 public getMyOrders(): Observable<MyOrderDetails[]>{
  return this.httpclient.get<MyOrderDetails[]>("http://localhost:9090/getOrderDetails");
 }

 public getAllOrderDetailsForAdmin(status:string): Observable<MyOrderDetails[]>{
  return this.httpclient.get<MyOrderDetails[]>("http://localhost:9090/getAllOrderDetails/"+status);
 }

  public addProduct(product:FormData){
     return this.httpclient.post<Product>("http://localhost:9090/addNewProduct",product);
  }
  public getAllProducts(pageNumber: number,searchKeyword: string=""){
    return this.httpclient.get<Product[]>("http://localhost:9090/getAllProducts?pageNumber="+pageNumber+"&searchKey="+searchKeyword);

  }

  public getAllProducts1(pageNumber: number,searchKeyword: string=""){
    return this.httpclient.get<Product[]>("http://localhost:9090/female?pageNumber="+pageNumber+"&searchKey="+searchKeyword);
  }

  public getAllProductsByCategory(productCategory:string){
    return this.httpclient.get<Product[]>("http://localhost:9090/getAllProducts/"+productCategory);
  }


  public getProductDetailsById(productId: any){
    return this.httpclient.get<Product>("http://localhost:9090/getProductDetailsById/"+productId);
  }

  public deleteProduct(productId:number){
   return this.httpclient.delete("http://localhost:9090/deleteProductDetails/"+productId);
  }

  public getProductDetails(isSingleProductCheckout: any,productId: any){

    return this.httpclient.get<Product[]>("http://localhost:9090/getProductDetails/"+isSingleProductCheckout+"/"+productId);
  }

  public placeOrder(orderDetails:OrderDetails,isSingleProductCheckout:any){
    return this.httpclient.post("http://localhost:9090/placeOrder/"+isSingleProductCheckout,orderDetails);
  }

  public addToCart(productId:number){
 return this.httpclient.get("http://localhost:9090/addToCart/"+productId);
  }

  public getCartDetails(){
    return this.httpclient.get("http://localhost:9090/getCartDetails");
  }

  public deleteCartItem(cartId: any){
   return this.httpclient.delete("http://localhost:9090/deleteCartItem/"+cartId);
  }
  public deleteMyOrderItem(orderId: any){
    return this.httpclient.delete("http://localhost:9090/deleteMyOrderItem/"+orderId);
   }

}
