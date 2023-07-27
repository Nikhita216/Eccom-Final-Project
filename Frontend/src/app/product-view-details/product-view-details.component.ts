import { ActivatedRoute, Router } from '@angular/router';
import { Product } from './../_model/Product.model';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-product-view-details',
  templateUrl: './product-view-details.component.html',
  styleUrls: ['./product-view-details.component.css']
})
export class ProductViewDetailsComponent implements OnInit {


  selectedProductIndex:number=0;

  product!: Product;

  constructor(private activatedRoute:ActivatedRoute,
    private router:Router ,
    private productService:ProductService){}
  ngOnInit(){
    this.product= this.activatedRoute.snapshot.data['product'];
    console.log(this.product);
  }

  addToCart(productId:number){
   this.productService.addToCart(productId).subscribe(
    (response)=>{
      console.log(response);
    },
    (error)=>{
      console.log(error);
    }
   );
  }

  changeIndex(index: any){
 this.selectedProductIndex=index;
  }

  buyProduct(productId: any){
   this.router.navigate(['/buyProduct',{
    isSingleProductCheckout:true,id:productId
   }]);
  }
}
