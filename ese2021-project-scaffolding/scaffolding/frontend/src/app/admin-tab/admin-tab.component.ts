import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {PostCategory} from "../models/postCategory.model";
import {Product} from "../models/product.model";
import {ShopCategory} from "../models/shopCategory.model";
import {Order} from "../models/order.model";

@Component({
  selector: 'app-admin-tab',
  templateUrl: './admin-tab.component.html',
  styleUrls: ['./admin-tab.component.css']
})
export class AdminTabComponent implements OnInit {

  newPostCategory: string = "";
  oldPostCategory: PostCategory = new PostCategory(0, "");
  postCategories: PostCategory[] = [];

  newShopCategory: string = "";
  oldShopCategory: ShopCategory = new ShopCategory(0," ");
  shopCategories: ShopCategory[] = [];

  emptyShopCategory = new ShopCategory(0,'');
  shopCategory: ShopCategory = this.emptyShopCategory;


  itemDeleteMsg: string ="";
  shopCategoryDeleteMsg: string ="";
  postCategoryDeleteMsg: string ="";

  shopCategoryCreateMsg: string ="";
  postCategoryCreateMsg: string ="";

  newProduct: Product = new Product(0, "", 0, "", 0, false);
  toDelete: Product =  new Product(0, "", 0, "", 0, false);

  products: Product[] = [];

  productPicture: null;
  preview: null;

  toDoOrders: Order[] = [];
  doneOrders: Order[] = [];

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.readCategories();
    this.getProducts();
    this.getToDoOrders();
    this.getDoneOrders();
  }


  createPostCategory(){
    this.httpClient.post(environment.endpointURL + "post/category", {
      postCategoryName: this.newPostCategory
    }).subscribe( (res: any) => {
      this.postCategoryCreateMsg = "Created new category \"" + this.newPostCategory + "\"";
      this.newPostCategory = "";
      this.readCategories();

      },(()=> {
        this.postCategoryCreateMsg = "Could not create category";
      })
    );
  }

  createShopCategory(){
    this.httpClient.post(environment.endpointURL + "shop/category", {
      shopCategoryName: this.newShopCategory
    }).subscribe( (res: any) => {
        this.shopCategoryCreateMsg = "Created new category \"" + this.newShopCategory + "\"";
        this.newShopCategory = "";
        this.readCategories();

      },(()=> {
        this.shopCategoryCreateMsg = "Could not create category";
      })
    );
  }


  readCategories(): void{
    this.postCategories = [];
    this.httpClient.get(environment.endpointURL + "post/category").subscribe((categories:any) => {
      categories.forEach((category: any) => {
        this.postCategories.push(category);
      });
    });
    this.shopCategories = [];
    this.httpClient.get(environment.endpointURL + "shop/category").subscribe((categories:any) => {
      categories.forEach((category:any) => {
        this.shopCategories.push(category);
      });
    });
  }

  deletePostCategory(): void{

    this.httpClient.delete(environment.endpointURL + "post/category/" + this.oldPostCategory.postCategoryId).subscribe((res:any)=>{
      this.postCategoryDeleteMsg = "Deleted category \" " + this.oldPostCategory.postCategoryName + "\"";
      this.readCategories();
      }, ((res:any)=>{
      this.postCategoryDeleteMsg = "could not delete category";
      })
    );
  }

  deleteShopCategory(): void{

    this.httpClient.delete(environment.endpointURL + "shop/category/" + this.oldShopCategory.shopCategoryId).subscribe((res:any)=>{
        this.shopCategoryDeleteMsg = "Deleted category \" " + this.oldShopCategory.shopCategoryName + "\"";
        this.readCategories();
      }, ((res:any)=>{
        this.shopCategoryDeleteMsg = "could not delete category";
      })
    );
  }

  createProduct() {
    this.httpClient.post(environment.endpointURL + "product/", {
      title: this.newProduct.title,
      shopCategoryId: this.shopCategory.shopCategoryId,
      description: this.newProduct.description,
      price: this.newProduct.price,
      productImage: true

    }).subscribe((product: any) => {
      this.products.unshift(
        new Product(product.productId, product.title, product.shopCategoryId, product.description, product.price, product.productImage));

      const formData = new FormData();
      // @ts-ignore
      formData.append("image", this.productPicture);

      this.httpClient.post(environment.endpointURL + "product/" + product.productId + "/image", formData)
        .subscribe((post: any) => {
          console.log(this.products);
          this.newProduct.title = this.newProduct.description = "";
          this.newProduct.price = 0;
        });
    });
  }

  onFileChanged(event: any) {
    this.productPicture = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.preview = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  getProducts(){
    this.httpClient.get(environment.endpointURL + "product").subscribe((products: any) =>{
      products.forEach((product: any) =>{
        this.products.push(product);
      });
    })
  }

  deleteItem() {
    this.httpClient.delete( environment.endpointURL + "product/" + this.toDelete.productId).subscribe((res:any)=>{
        this.itemDeleteMsg = "Deleted item \" " + this.toDelete.title + "\"";
        this.getProducts();
      }, ((res:any)=>{
        this.itemDeleteMsg = "could not delete item";
      })
    );
  }
  getToDoOrders(): void{
    this.httpClient.get(environment.endpointURL + "order/status/" + 0).subscribe((orders:any) => {
      orders.forEach((order:Order) => {
        this.toDoOrders.push(new Order(order.orderId, order.userId, order.firstName, order.lastName, order.address, order.paymentMethod, order.deliveryStatus, order.productId));
      })
    });
  }

  getDoneOrders(): void{
    this.httpClient.get(environment.endpointURL + "order/status/" + 1).subscribe((orders:any) => {
      orders.forEach((order:Order) => {
        this.doneOrders.push(new Order(order.orderId, order.userId, order.firstName, order.lastName, order.address, order.paymentMethod, order.deliveryStatus, order.productId));
      })
    });
  }

  shipOrder(id: number) {
    this.httpClient.put( environment.endpointURL + "order/" + id, {
      deliveryStatus: 1
    }).subscribe((res: any) => {
      this.doneOrders.unshift(res);
      let index = -1;
      this.toDoOrders.forEach((order)=>{
        if(order.orderId == res.orderId){
          index = this.toDoOrders.indexOf(order);
        }
      });
      console.log(index);
      console.log(this.toDoOrders);
      if(index > -1){
        this.toDoOrders.splice(index, 1);
      }
      });
  }
}
