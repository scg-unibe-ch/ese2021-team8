import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Category} from "../models/category.model";
import {Product} from "../models/product.model";
import {Post} from "../models/post.model";

@Component({
  selector: 'app-admin-tab',
  templateUrl: './admin-tab.component.html',
  styleUrls: ['./admin-tab.component.css']
})
export class AdminTabComponent implements OnInit {

  newCategory: string = "";

  oldCategory: Category = new Category(0, "");

  categories: Category[] = [];

  deleteFeedback: string ="";

  createFeedback: string ="";

  product: Product = new Product(0, "", 0, "", 0, false);

  products: Product[] = [];

  productPicture: null;

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.readCategories();
  }


  createCategory(){
    this.httpClient.post(environment.endpointURL + "category", {
      categoryName: this.newCategory
    }).subscribe( (res: any) => {
      this.createFeedback = "Created new category \"" + this.newCategory + "\"";
      this.newCategory = "";
      this.readCategories();

      },((res: any)=> {
        this.createFeedback = "Could not create category";
      })
    );
  }

  readCategories(): void{
    this.categories = [];
    this.httpClient.get(environment.endpointURL + "category").subscribe((categories:any) => {
      categories.forEach((category: any) => {
        this.categories.push(category);
      });
    });
  }

  deleteCategory(): void{

    this.httpClient.delete(environment.endpointURL + "category/" + this.oldCategory.categoryId).subscribe((res:any)=>{
      this.deleteFeedback = "Deleted category \" " + this.oldCategory.categoryName + "\"";
      this.readCategories();
  }, ((res:any)=>{
      this.deleteFeedback = "could not delete category";
      })
    );
  }

  createProduct() {
    this.httpClient.post(environment.endpointURL + "product/", {
      title: this.product.title,
      storeCategoryId: 1,
      description: this.product.description,
      price: this.product.price,
      productImage: true

    }).subscribe((product: any) => {
      this.products.unshift(
        new Product(product.productId, product.title, product.storeCategoryId, product.description, product.price, product.productImage));

      const formData = new FormData();
      // @ts-ignore
      formData.append("image", this.productPicture);

      this.httpClient.post(environment.endpointURL + "product/" + product.productId + "/image", formData)
        .subscribe((post: any) => {
          console.log(this.products);
          this.product.title = this.product.description = "";
          this.product.price = 0;
        });
    });
  }

  onFileChanged(event: any) {
    this.productPicture = event.target.files[0];
  }


}
