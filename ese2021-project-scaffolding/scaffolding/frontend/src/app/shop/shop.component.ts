import { Component, OnInit } from '@angular/core';
import {Product} from "../models/product.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {


  products: Product[] = [];

  constructor(private httpClient: HttpClient) {
  this.getProducts();
  }

  ngOnInit(): void {
  }

  getProducts(): void{
    this.httpClient.get(environment.endpointURL + "product").subscribe((products: any) => {
      products.forEach((product: any) => {
        this.products.unshift(new Product(product.productId, product.title, product.shopCategoryId, product.description, product.price, product.productImage));
      });
    });
}
  counter(i: number) {
    return new Array(i);
  }

  updateProduct(product: Product) {
    this.httpClient.put(environment.endpointURL + "product/" + product.productId, {
      title: product.title,
      description: product.description,
      //TODO add category
    }).subscribe();
  }
}
