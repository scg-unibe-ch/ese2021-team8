import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Product} from "../../models/product.model";
import {ToastrService} from "ngx-toastr";

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
  confirmation: boolean = false;
  invalid: boolean = false;
  firstName: string = '';
  lastName: string = '';
  paymentMethod: number = 0;

  constructor( public userService: UserService,
               public dialogRef: MatDialogRef<CheckoutComponent>,
               private httpClient: HttpClient,
               private toastr: ToastrService,
               @Inject (MAT_DIALOG_DATA) public data: {product: Product}) {
    userService.user$.subscribe(res => this.user = res);
    this.user = userService.getUser();
    this.products.push(data.product);
  }

  ngOnInit(): void {
    let address : string[] = this.user.address.split(";");
    this.firstName = this.user.firstName;
    this.lastName = this.user.lastName;
    if(address.length==2) {
      this.street = address[0];
      this.city = address[1];
    } else{
      this.street = this.user.address;
    }
  }

  makeOrder() {
      if(this.isValid()){
      this.httpClient.post(environment.endpointURL + "order",{
        userId: this.user.userId,
        firstName: this.firstName,
        lastName: this.lastName,
        address: this.street + ';' + this.city,
        paymentMethod: this.paymentMethod,
        deliveryStatus: 'pending',
        productId: this.data.product.productId
      }).subscribe( ()=>{
      },(() => {
      this.confirmation = false;
      return;
      }));
    this.toastr.show('All orders are visible in your profile','Order completed!');
    this.dialogRef.close();
      }
      else{
        this.invalid = true;
      }
  }

  isValid(): boolean{
    if (!(this.firstName == '' || this.lastName == '' || this.city == '' || this.street == '')){
      return true;
    }
    else{
      this.invalid = true;
      return false;
    }
  }
}
