import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ShoppingCart} from "../../models/shopping-cart.model";
import {Product} from "../../models/product.model";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  user: User = new User(0, "","","","","","","",0);
  products: Product[] = [];
  street: string = "";
  city: string ="";

  constructor( public userService: UserService,
               public dialogRef: MatDialogRef<CheckoutComponent>,
               private httpClient: HttpClient,
               @Inject (MAT_DIALOG_DATA) public data: {product: Product}) {
    userService.user$.subscribe(res => this.user = res);
    this.user = userService.getUser();
    this.products.push(data.product);
  }

  ngOnInit(): void {
    let address : string[] = this.user.address.split(";");
    if(address.length==2) {
      this.street = address[0];
      this.city = address[1];
    } else{
      this.street = this.user.address;
    }
  }

  makeOrder() {

  }
}
