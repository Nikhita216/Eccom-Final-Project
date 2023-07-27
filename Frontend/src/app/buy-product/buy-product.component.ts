import { OrderDetails } from './../_model/order-details.model';
import { Component, Injector, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../_model/Product.model';
import { ProductService } from '../_services/product.service';

declare var Razorpay: any;
@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.css'],
})
export class BuyProductComponent {
  [x: string]: any;
  isSingleProductCheckout: any = '';
  productDetails: Product[] = [];

  orderDetails: OrderDetails = {
    fullName: '',
    fullAddress: '',
    contactNumber: '',
    alternateContactNumber: '',
    transactionId: '',
    orderProductQuantityList: [],
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private injector: Injector

  ) {

  }

  ngOnInit(): void {
    this.productDetails = this.activatedRoute.snapshot.data['productDetails'];
    this.isSingleProductCheckout = this.activatedRoute.snapshot.paramMap.get(
      'isSingleProductCheckout'
    );

    this.productDetails.forEach((x) =>
      this.orderDetails.orderProductQuantityList.push({
        productId: x.productId,
        quantity: 1,
      })
    );
    console.log(this.productDetails);
    console.log(this.orderDetails);
  }

  public placeOrder(orderForm: NgForm) {
    this.productService
      .placeOrder(this.orderDetails, this.isSingleProductCheckout)
      .subscribe(
        (resp) => {
          console.log(resp);
          orderForm.reset();

          const ngZone = this.injector.get(NgZone);
          ngZone.run(() => {
            this.router.navigate(['/orderConfirm']);
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getQuantityForProduct(productId: number) {
    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    );
    return filteredProduct[0].quantity;
  }

  getCalculatedTotal(productId: any, productDiscountedPrice: any) {
    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    );
    return filteredProduct[0].quantity * productDiscountedPrice;
  }

  onQuantityChanged(quantity: any, productId: any) {
    this.orderDetails.orderProductQuantityList.filter(
      (orderProduct) => orderProduct.productId === productId
    )[0].quantity = quantity;
  }

  getCalculatedGrandTotal() {
    let grandTotal = 0;
    this.orderDetails.orderProductQuantityList.forEach((productQuantity) => {
      const price = this.productDetails.filter(
        (product) => product.productId === productQuantity.productId
      )[0].productDiscountedPrice;
      grandTotal = grandTotal + price * productQuantity.quantity;
    });
    return grandTotal;
  }

  createTransactionAndPlaceOrder(orderForm: NgForm) {
    let amount = this.getCalculatedGrandTotal();
    this.productService.createTransaction(amount).subscribe(
      (response) => {
        console.log(response);
        this.openTransactionModal(response, orderForm);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openTransactionModal(response: any, orderForm: NgForm) {
    var options = {
      order_id: response.orderId,
      key: response.key,
      amount: response.amount,
      currency: response.currency,
      name: 'Payment',
      description: 'Payment of Online Shopping',
      image:
        'https://cdn.pixabay.com/photo/2016/07/15/21/07/credit-card-1520400_640.jpg',
      handler: (response: any) => {
        if (response != null && response.razorpay_payment_id != null) {
          this.processResponse(response, orderForm);
        } else {
          alert('Payment failed');
        }
      },
      prefil: {
        name: 'Nik',
        email: 'nikhita@gmail.com',
        contact: '00000000',
      },
      notes: {
        address: 'Online shopping',
      },
      theme: {
        color: 'blue',
      },
    };
    var razorPayObject = new Razorpay(options);
    razorPayObject.open();
  }

  processResponse(resp: any, orderForm: NgForm) {
    this.orderDetails.transactionId = resp.razorpay_payment_id;
    this.placeOrder(orderForm);
  }


 /* favoriteSeason!: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  Address!: String;
  options1:string[]=["12","21"]

  number = 123*/



}
