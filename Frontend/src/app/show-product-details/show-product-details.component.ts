

import { ProductService } from '../_services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from '../_model/Product.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ShowProductImagesDialogComponent } from '../show-product-images-dialog/show-product-images-dialog.component';
import { ImageProcessingService } from '../image-processing.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.css']
})
export class ShowProductDetailsComponent implements OnInit {


  pageNumber:number=0;

  showTable=false;

  showLoadMoreProductButton=false;

  productDetails: Product[]=[];
  displayedColumns: string[] = ['Id', 'Product Name', 'description', 'Product Discounted Price','Product Actual Price','Actions'];

  constructor(private productService:ProductService,
    public imagesDialog: MatDialog,
    private imageProcessingService:ImageProcessingService,
    private router:Router)
    {}

  ngOnInit():void{
    this.getAllProducts();
  }

  searchByKeyword(searchKeyword: any){
    console.log(searchKeyword);
    this.pageNumber=0;
    this.productDetails=[];
    this.getAllProducts(searchKeyword);
   }

  public getAllProducts(searchKey:string=""){
    this.showTable=false;

    this.productService.getAllProducts(this.pageNumber,searchKey)
    .pipe(
      map((x:Product[],i: any)=>x.map((product : Product)=>this.imageProcessingService.createImages(product)))
    )
    .subscribe(
      (resp: Product[])=>{
       // console.log(resp);


          resp.forEach(
            p=>this.productDetails.push(p)
          );
          console.log(this.productDetails);
          this.showTable=true;
       // this.productDetails=resp;
       if(resp.length==8){
        this.showLoadMoreProductButton=true;
       }
       else{
        this.showLoadMoreProductButton=false;
       }
      },
      (error:HttpErrorResponse)=>{
        console.log(error);
      }
    );
  }

  loadMoreProduct(){
  this.pageNumber=this.pageNumber+1;
  this.getAllProducts();
  }

  deleteProduct(productId: any){
    this.productService.deleteProduct(productId).subscribe(
      (resp)=>{
        this.getAllProducts();
      },
      (error:HttpErrorResponse)=>{
        console.log(error);
      }
    );
  }
  showImages(product:Product){
    console.log(product);
    this.imagesDialog.open(ShowProductImagesDialogComponent,{
      data:{
     images:product.productImages
      },
      height: '550px',
      width: '800px',
    });
  }

  editProductDetails(productId: any){
   this.router.navigate(['/addNewProduct',{productId:productId}]);
  }

}


