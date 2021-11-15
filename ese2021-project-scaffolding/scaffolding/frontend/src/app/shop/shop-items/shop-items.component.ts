import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from "../../models/product.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {CheckoutComponent} from "../checkout/checkout.component";
import {Post} from "../../models/post.model";

@Component({
  selector: 'app-shop-items',
  templateUrl: './shop-items.component.html',
  styleUrls: ['./shop-items.component.css']
})
export class ShopItemsComponent implements OnInit {

  @Input() product: Product = new Product(0,"",0, "", 0, true);
  @Output() getNewProducts = new EventEmitter<Product>();
  @Output() sendUpdate = new EventEmitter<Product>();


  imagePath: string = "";
  editMode: boolean = false;

  constructor(private httpClient: HttpClient,
              public userService: UserService,
              public router: Router,
              public dialog: MatDialog
  )
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

  openDialog() {
    const dialogRef = this.dialog.open(CheckoutComponent, {
      data: {product: this.product},
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  editProduct() {
    this.editMode = true;
  }
  deleteProduct(){
    this.httpClient.delete( environment.endpointURL + "product/" + this.product.productId).subscribe((res:any)=> {
      this.getNewProducts.emit();
    }
    );
  }

  discardEdits() {
    this.editMode = false;
  }

  updateProduct() {
    this.sendUpdate.emit(this.product);
    this.editMode = false;
  }
}
