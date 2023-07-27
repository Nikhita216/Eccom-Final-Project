import { FileHandle } from "./file-handle.model";

export interface Product{

  productId:number,
  productName: String,
  productDesciption: String,
  productDiscountedPrice: number,
  productActualPrice: number,

  productImages:FileHandle[],
  productCategory:String
}
