import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../models/product.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-shop-items',
  templateUrl: './shop-items.component.html',
  styleUrls: ['./shop-items.component.css']
})
export class ShopItemsComponent implements OnInit {

  @Input() product: Product = new Product(0,"",0, "", 0, true);

  imagePath: string = "";

  constructor(private httpClient: HttpClient,
              public userService: UserService,
              public router: Router)
  { }

  ngOnInit(): void {
    if(this.product != null)
      this.getImage()
  }

  getImage(): void {
    this.httpClient.get(environment.endpointURL + "product/" + this.product.productId + "/imageByProduct").subscribe(
      (res:any) =>{
        this.imagePath = environment.endpointURL + "uploads/" + res.fileName;
      });
  }

  buyNow() {
    if(!this.userService.getLoggedIn()){

    }
  }
}
