import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {PostCategory} from "../../models/postCategory.model";
import {Product} from "../../models/product.model";
import {ShopCategory} from "../../models/shopCategory.model";
import {Order} from "../../models/order.model";
import {Sort} from "@angular/material/sort";
import {UserService} from "../../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationComponent} from "../../confirmation/confirmation.component";
import {ToastrService} from "ngx-toastr";

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


  itemRemoveMsg: string ="";
  showProductCreateError: boolean = false;
  productCreateMsg: string="";
  shopCategoryDeleteMsg: string ="";
  postCategoryDeleteMsg: string ="";

  shopCategoryCreateMsg: string ="";
  postCategoryCreateMsg: string ="";

  newProduct: Product = new Product(0, "", 0, "", 0, false);
  toRemove: Product | undefined //=  new Product(0, "", 0, "", 0, false);

  products: Product[] = [];

  productPicture: null;
  preview: null;

  toDoOrders: Order[] = [];
  doneOrders: Order[] = [];
  orders: Order[] = [];



  constructor(private httpClient: HttpClient,
              public userService: UserService,
              public dialog: MatDialog,
              public toastr: ToastrService)
  { }

  ngOnInit(): void {
    this.getOrders();
    this.readCategories();
    this.getProducts();

  }

  createPostCategory(){
    if(this.newPostCategory==""){
      this.postCategoryCreateMsg = "Please enter category name";
      return;
    }
    this.httpClient.post(environment.endpointURL + "post/category", {
      postCategoryName: this.newPostCategory
    }).subscribe( () => {
      this.postCategoryCreateMsg = "Created new category \"" + this.newPostCategory + "\"";
      this.newPostCategory = "";
      this.readCategories();

      },(()=> {
        this.postCategoryCreateMsg = "Could not create category";
      })
    );
  }

  createShopCategory(){
    if(this.newShopCategory==""){
      this.shopCategoryCreateMsg = "Please enter category name";
      return;
    }
    this.httpClient.post(environment.endpointURL + "shop/category", {
      shopCategoryName: this.newShopCategory
    }).subscribe( () => {
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
    this.httpClient.delete(environment.endpointURL + "post/category/" + this.oldPostCategory.postCategoryId).subscribe(()=>{
      this.postCategoryDeleteMsg = "Deleted category \" " + this.oldPostCategory.postCategoryName + "\"";
      this.oldPostCategory = new PostCategory(0,"");
      this.readCategories();
      }, (()=>{
      this.postCategoryDeleteMsg = "could not delete category because there are existing posts under that category";
      })
    );
  }

  deleteShopCategory(): void {
    this.httpClient.delete(environment.endpointURL + "shop/category/" + this.oldShopCategory.shopCategoryId).subscribe(() => {
        this.shopCategoryDeleteMsg = "Deleted category \" " + this.oldShopCategory.shopCategoryName + "\"";
        this.oldShopCategory = new ShopCategory(0,"");
        this.readCategories();
      }, (() => {
        this.shopCategoryDeleteMsg = "could not delete category because there are exiting items/orders that use this category";
      })
    );
  }

  createProduct() {
    if (this.newProduct.title == '' || this.newProduct.price == null || this.shopCategory == this.emptyShopCategory) {
      this.showProductCreateError = true;
      this.productCreateMsg = "Please fill all the required fields"
      return;
    } else if (this.productPicture == null) {
      this.productCreateMsg = "Add an image to publish product"
      return;
    } else {
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
          .subscribe(() => {
            this.toastr.show("new product (" + this.newProduct.title + ") was created");
            this.newProduct.title = this.newProduct.description = this.productCreateMsg ="";
            this.newProduct.price = 0;
            this.preview = null;
            this.shopCategory = this.emptyShopCategory;
          });
      });
    }
  }
  discard() {
    this.newProduct.title = this.newProduct.description = "";
    this.newProduct.price = 0;
    this.shopCategory = this.emptyShopCategory;
    this.preview = null;
    this.productPicture = null;
  }

  onFileChanged(event: any) {
    this.productPicture = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.preview = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  getProducts() {
    this.products = [];
    this.httpClient.get(environment.endpointURL + "product/inUse").subscribe((products: any) => {
      products.forEach((product: any) => {
        this.products.push(product);
      });
    })
  }

  removeItem() {
    if(this.toRemove == undefined){
      this.itemRemoveMsg = "please select item you want to remove";
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, {data: {question: 'remove this item (' + this.toRemove?.title + ') from the shop'}});
    dialogRef.afterClosed().subscribe((result) =>{
      if(result){
        this.httpClient.put(environment.endpointURL + "product/remove/" + this.toRemove?.productId, {}).subscribe(() => {
            this.itemRemoveMsg = "Removed item \" " + this.toRemove?.title + "\"";
            this.getProducts();
          }, (() => {
            this.itemRemoveMsg = "could not remove item";
          })
        );
      }
      else{
        this.toRemove = undefined;
      }
    });
  }

  getOrders(): void {
    this.orders =[];
    this.toDoOrders = [];
    this.doneOrders = [];
    let newOrder: Order;
    this.httpClient.get(environment.endpointURL + "order").subscribe((orders: any) => {
      orders.forEach((order: any) => {
        this.httpClient.get(environment.endpointURL + "product/" + order.productId).subscribe((product: any) => {
          let orderProduct = new Product(product.productId, product.title, product.shopCategoryId, product.description, product.price, product.productImage);
          newOrder = new Order(order.orderId, order.userId, order.firstName, order.lastName, order.address, order.paymentMethod, order.deliveryStatus, orderProduct);
          this.orders.unshift(newOrder);
          if (order.deliveryStatus == 'pending') {
            this.toDoOrders.push(newOrder);
          } else {
            this.doneOrders.push(newOrder);
          }
        });
      });
      this.orders.sort((a, b) =>{
        return compare(a.orderId, b.orderId, false);
      });
    });
  }

  shipOrder(id: number) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {data: {question: 'mark this order as shipped'}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.httpClient.put(environment.endpointURL + "order/" + id, {
          deliveryStatus: 'shipped/delivered'
        }).subscribe((res: any) => {
          this.httpClient.get(environment.endpointURL + "product/" + res.productId).subscribe((product: any) => {
            let orderProduct = new Product(product.productId, product.title, product.shopCategoryId, product.description, product.price, product.productImage);
            this.doneOrders.unshift(new Order(res.orderId, res.userId, res.firstName, res.lastName, res.address, res.paymentMethod, res.deliveryStatus, orderProduct));
            let index = -1;
            this.toDoOrders.forEach((order) => {
              if (order.orderId == res.orderId) {
                index = this.toDoOrders.indexOf(order);
                return;
              }
            });
            if (index > -1) {
              this.toDoOrders.splice(index, 1);
            }
          });
          this.getOrders();
        });
      } else {
        return;
      }
    });
  }

  sortData(sort: Sort, orders: Order[], kind: string) {
    const data = orders.slice();
    let sortedData;
    if (!sort.active || sort.direction == '') {
      return;
    }

    sortedData = data.sort((a, b) => {
      let isAsc = sort.direction == 'asc';
      switch (sort.active) {
        case 'orderId':
          return compare(a.orderId, b.orderId, isAsc);
        case 'lastName':
          return compare(+a.lastName, +b.lastName, isAsc);
        case 'address':
          return compare(+a.address, +b.address, isAsc);
        case 'productId':
          return compare(+a.product.productId, +b.product.productId, isAsc);
        case 'deliveryStatus':
          return compare(+a.deliveryStatus, +b.deliveryStatus, isAsc);
        default:
          return 0;
      }
    });

    switch (kind) {
      case 'all':
        this.orders = sortedData;
        break;
      case 'toDo':
        this.toDoOrders = sortedData;
        break;
      case 'done':
        this.doneOrders = sortedData;
        break;
    }
  }
}

function compare(a : any, b: any, isAsc: any) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

