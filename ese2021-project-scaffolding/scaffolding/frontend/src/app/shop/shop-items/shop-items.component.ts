import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from "../../models/product.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {CheckoutComponent} from "../checkout/checkout.component";
import {ShopCategory} from "../../models/shopCategory.model";
import {ConfirmationComponent} from "../../confirmation/confirmation.component";

@Component({
  selector: 'app-shop-items',
  templateUrl: './shop-items.component.html',
  styleUrls: ['./shop-items.component.css']
})
export class ShopItemsComponent implements OnInit {

  @Input() product!: Product;
  @Output() getNewProducts = new EventEmitter<Product>();

  @Output() selectCategory = new EventEmitter<number>();
  @Input() categories: ShopCategory[] =[];


  imagePath: string = "";
  editMode: boolean = false;
  categoryName: string = ""

  constructor(private httpClient: HttpClient,
              public userService: UserService,
              public router: Router,
              public dialog: MatDialog
  )
  { }

  ngOnInit(): void {
    if(this.product != null) {
      this.getImage();
      this.getCategoryName()
    }
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
    this.dialog.open(CheckoutComponent, {
      data: {product: this.product},
    });
  }

  editProduct() {
    this.editMode = true;
  }

  removeProduct(){
    const dialogRef = this.dialog.open(ConfirmationComponent, {data: {question: 'remove this product ('+ this.product.title + ') from the shop'}});

    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.httpClient.put( environment.endpointURL + "product/remove/" + this.product.productId, {}).subscribe(()=> {
          this.getNewProducts.emit();
      });
     }
    });
  }

  discardEdits() {
    this.editMode = false;
  }

  updateProduct() {
      this.httpClient.put(environment.endpointURL + "product/" + this.product.productId, {
        title: this.product.title,
        description: this.product.description,
        shopCategoryId: this.product.shopCategoryId,
        price: this.product.price
      }).subscribe(()=> {
        this.getCategoryName();
        this.getImage();
        this.editMode=false;
      });


  }

  getCategoryName(): void{
    this.httpClient.get(environment.endpointURL + "shop/category/" + this.product.shopCategoryId).subscribe(
      (res:any) =>{
        this.categoryName = res.shopCategoryName;
      }, () => {
        this.categoryName = "undefined category";
      })
  }

  selectSortCategory(){
    this.selectCategory.emit(this.product.shopCategoryId);
  }
}
