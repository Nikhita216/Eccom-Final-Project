
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

import { ImageProcessingService } from '../image-processing.service';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {


  cartDetails: any[] = [];

  constructor(private productService: ProductService, private router: Router,
    private imageProcessingService:ImageProcessingService) {}

  ngOnInit(): void {
    this.getCartDetails();
  }



  getCartDetails() {
    this.productService.getCartDetails().subscribe(
      (response: any) => {
        console.log(response);
        this.cartDetails = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkout() {
    this.router.navigate([
      '/buyProduct',
      {
        isSingleProductCheckout: false,
        id: 0,
      },
    ]);
    /* this.productService.getProductDetails(false,0).subscribe(
    (response)=>{
     console.log(response);
    },
    (error)=>{
     console.log(error);
    }
   ); */
  }

  deleteItem(cartId: any) {
    console.log(cartId);
    this.productService.deleteCartItem(cartId).subscribe(
      (response) => {
        console.log(response);
        this.getCartDetails();
      },
      (error) => {
        console.log(error);
      }
    );
  }




}
