import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {PostCategory} from "../models/postCategory.model";
import {Product} from "../models/product.model";
import {Post} from "../models/post.model";
import {ShopCategory} from "../models/shopCategory.model";

@Component({
  selector: 'app-admin-tab',
  templateUrl: './admin-tab.component.html',
  styleUrls: ['./admin-tab.component.css']
})
export class AdminTabComponent implements OnInit {

  newCategory: string = "";

  oldCategory: PostCategory = new PostCategory(0, "");

  categories: PostCategory[] = [];

  newShopCategory: string = "";
  oldShopCategory: ShopCategory = new ShopCategory(0," ");
  shopCategories: ShopCategory[] = [];
  emptyCategory = new ShopCategory(0,'');
  shopCategory: ShopCategory = this.emptyCategory;


  deleteFeedback: string ="";

  createFeedback: string ="";

  newProduct: Product = new Product(0, "", 0, "", 0, false);
  toDelete: Product =  new Product(0, "", 0, "", 0, false);

  products: Product[] = [];

  productPicture: null;
  preview: null;

  orders: string[] = [];

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.readCategories();
    this.getProducts();
  }


  createCategory(){
    this.httpClient.post(environment.endpointURL + "post/category", {
      postCategoryName: this.newCategory
    }).subscribe( (res: any) => {
      this.createFeedback = "Created new category \"" + this.newCategory + "\"";
      this.newCategory = "";
      this.readCategories();

      },(()=> {
        this.createFeedback = "Could not create category";
      })
    );
  }

  readCategories(): void{
    this.categories = [];
    this.httpClient.get(environment.endpointURL + "post/category").subscribe((categories:any) => {
      categories.forEach((category: any) => {
        this.categories.push(category);
      });
    });
    this.shopCategories = [];
    this.httpClient.get(environment.endpointURL + "shop/category").subscribe((categories:any) => {
      categories.forEach((category:any) => {
        this.shopCategories.push(category);
      });
    });
  }

  deleteCategory(): void{

    this.httpClient.delete(environment.endpointURL + "post/category/" + this.oldCategory.postCategoryId).subscribe((res:any)=>{
      this.deleteFeedback = "Deleted category \" " + this.oldCategory.postCategoryName + "\"";
      this.readCategories();
  }, ((res:any)=>{
      this.deleteFeedback = "could not delete category";
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
        this.deleteFeedback = "Deleted item \" " + this.toDelete.title + "\"";
        this.getProducts();
      }, ((res:any)=>{
        this.deleteFeedback = "could not delete category";
      })
    );
  }
}
