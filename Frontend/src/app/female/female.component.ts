import { Component } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { ImageProcessingService } from '../image-processing.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { Product } from '../_model/Product.model';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-female',
  templateUrl: './female.component.html',
  styleUrls: ['./female.component.css']
})
export class FemaleComponent {


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







  public getAllProducts(searchKey:string=""){
    this.productService.getAllProducts1(this.pageNumber,searchKey)
    .pipe(
      map((x:Product[],i: any)=>x.map((product : Product)=>this.imageProcessingService.createImages(product)))
    )
    .subscribe(
      (resp: Product[])=>{
        console.log(resp);
        if(resp.length==30){
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
