


import { Product } from './../_model/Product.model';
import { Component, OnInit, Pipe } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { MyOrderDetails } from '../_model/order.model';
import { ImageProcessingService } from '../image-processing.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent  implements OnInit{


  displayedColumns: string[] = ['Name', 'Address', 'Contact No.', 'Amount','Status','Action'];

  myOrderDetails:MyOrderDetails[]=[];


  constructor(private productService:ProductService,
    private imageProcessingService:ImageProcessingService){

  }

  ngOnInit(){
    this.getOrderDetails();

  }



  getOrderDetails(){
    this.productService.getMyOrders().subscribe(
      (resp:MyOrderDetails[])=>{
       console.log(resp);
       this.myOrderDetails=resp;

      },
      (err)=>{
        console.log(err);

      }
    );
  }


  deleteItem(orderId:any){
    console.log(orderId);
    this.productService.deleteMyOrderItem(orderId).subscribe(
      (response)=>{
       console.log(response);
       this.getOrderDetails();
      },(error)=>{
       console.log(error);
      }
    );
    }



}
