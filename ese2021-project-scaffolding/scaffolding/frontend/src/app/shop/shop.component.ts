import { Component, OnInit } from '@angular/core';
import {Product} from "../models/product.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ShopCategory} from "../models/shopCategory.model";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  products: Product[] = [];
  shopCategories: ShopCategory[] = [];

  selectable = true;
  removable = true;
  selectedCategories: ShopCategory[] = [];
  categoryId: number = 0;

  constructor(private httpClient: HttpClient) {
  this.getProducts();
  }

  ngOnInit(): void {
    this.getShopCategories();
  }

  getProducts(): void{
    this.products =[];
    if(this.selectedCategories.length==0){
    this.httpClient.get(environment.endpointURL + "product/inUse").subscribe((products: any) => {
      products.forEach((product: any) => {
        this.products.unshift(new Product(product.productId, product.title, product.shopCategoryId, product.description, product.price, product.productImage));
      });
    });
    }else{
      this.selectedCategories.forEach((category)=>{
        this.httpClient.get(environment.endpointURL + "product/inUse/" + category.shopCategoryId + "/byCategory" ).subscribe((products: any) => {
          products.forEach((product: any) =>{
            this.products.unshift(new Product(product.productId, product.title, product.shopCategoryId, product.description, product.price, product.productImage));
          });
        });
      });
    }
}
  getShopCategories(): void{
    this.httpClient.get( environment.endpointURL + "shop/category").subscribe((categories: any) => {
      categories.forEach((category: any) => {
        this.shopCategories.push(new ShopCategory(category.shopCategoryId, category.shopCategoryName));
      });
    });
  }
  counter(i: number) {
    return new Array(i);
  }

  selected(shopCategoryId: number) {
    let selected = false;
    this.selectedCategories.forEach((category)=>{
      if(category.shopCategoryId == shopCategoryId){
        selected = true;
      }
    });
    if(!selected) {
      this.httpClient.get(environment.endpointURL + "shop/category/" + shopCategoryId).subscribe((category: any) => {
        this.selectedCategories.push(category);
        this.getProducts();
      });
    }
  }

  remove(category: ShopCategory) {
    const index = this.selectedCategories.indexOf(category);

    if(index >=0){
      this.selectedCategories.splice(index, 1);
      this.getProducts();
    }

  }
}
