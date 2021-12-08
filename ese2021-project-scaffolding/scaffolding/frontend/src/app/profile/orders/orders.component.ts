import { Component, OnInit } from '@angular/core';
import {environment} from "../../../environments/environment";
import {Product} from "../../models/product.model";
import {Order} from "../../models/order.model";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {ConfirmationComponent} from "../../confirmation/confirmation.component";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: Order[] = [];
  userId: number | undefined;
  orderImages: string[] = [];

  constructor(private httpClient: HttpClient,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private toastr: ToastrService) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe( params =>
      this.userId = Number(params.get('userId'))
    );
    this.getOrders();
  }

  getOrders(): void{
    this.orders = [];
    let i = 0;
    this.httpClient.get(environment.endpointURL + "order/user/" + this.userId).subscribe((orders:any) => {
      orders.forEach((order:any) => {
        this.httpClient.get(environment.endpointURL + "product/" + order.productId).subscribe((product: any) =>{
          let orderProduct = new Product(product.productId, product.title, product.shopCategoryId, product.description, product.price, product.productImage);
          this.orders.unshift(new Order(order.orderId, order.userId, order.firstName, order.lastName, order.address, order.paymentMethod, order.deliveryStatus, orderProduct));
          this.httpClient.get(environment.endpointURL + "product/" + product.productId + "/imageByProduct").subscribe(
            (res: any) => {
              this.orderImages[product.productId] = environment.endpointURL + "uploads/" + res.fileName;
              i++;
            });
        });
      });
    }, () => {});
  }

  cancelOrder(id: number): void{
    const dialogRef = this.dialog.open(ConfirmationComponent, {data: {question: 'cancel this order'}});
    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.httpClient.put(environment.endpointURL + "order/" + id, {
          deliveryStatus: 'cancelled'
        }).subscribe(()=> {
          this.getOrders()
          this.toastr.show('Your order was cancelled');
        });
      }else{
        return;
      }
    });
  }
}
