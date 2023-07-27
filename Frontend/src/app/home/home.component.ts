import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { map } from 'rxjs';
import { Product } from '../_model/Product.model';
import { ImageProcessingService } from '../image-processing.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  selected = 'All';
  pageNumber:number=0;
  productDetails:any=[];


  showLoadButton=false;
  constructor(private productService:ProductService,
    private imageProcessingService:ImageProcessingService,
    private router:Router,
    private userService:UserService){}

  ngOnInit():void{

    this.getAllProducts();

  }

  

  getAllProductsByCategory(productCategory:string){
    this.productService.getAllProductsByCategory(productCategory).pipe(
      map((x:Product[],i: any)=>x.map((product : Product)=>this.imageProcessingService.createImages(product)))
    ).subscribe(
      (resp)=>{
        this.productDetails=resp;
        console.log(resp);
      },
      (err)=>{
        console.log(err);
      }
    );
  }

  searchByKeyword(searchKeyword: any){
   console.log(searchKeyword);
   this.pageNumber=0;
   this.productDetails=[];
   this.getAllProducts(searchKeyword);
  }

  public getAllProducts(searchKey:string=""){
    this.productService.getAllProducts(this.pageNumber,searchKey)
    .pipe(
      map((x:Product[],i: any)=>x.map((product : Product)=>this.imageProcessingService.createImages(product)))
    )
    .subscribe(
      (resp: Product[])=>{
        console.log(resp);
        if(resp.length==8){
        this.showLoadButton=true;
        }
        else{
          this.showLoadButton=false;
        }
        resp.forEach(
          p=>this.productDetails.push(p)
        );

      },
      (error:HttpErrorResponse)=>{
        console.log(error);
      }
    );
  }

  public loadMoreProduct(){
    this.pageNumber=this.pageNumber+1;
    this.getAllProducts();
  }

  showProductDetails(productId: any){
 this.router.navigate(['/productViewDetails',{productId:productId}]);
  }

}
