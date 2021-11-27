import { Component, OnInit } from '@angular/core';
import {Order} from "../models/order.model";
import {environment} from "../../environments/environment";
import {Product} from "../models/product.model";
import {User} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../services/user.service";
import {UserComponent} from "../user/user.component";
import {Router} from "@angular/router";
import {Post} from "../models/post.model";
import {async} from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;
  orders: Order[] = [];

  street: string = "";
  city: string = "";

  updateErrorMsg: string = '';
  editInfo: boolean = false;

  userComponent: UserComponent;

  hideOnSm: boolean = true;

  userPosts: Post[] = [];

  constructor(private httpClient: HttpClient,
              public userService: UserService,
              public router: Router) {
    userService.user$.subscribe(res => {this.user = res;
      let address: string[] = this.user.address.split(";");
      if (address.length == 2) {
        this.street = address[0];
        this.city = address[1];
      } else {
        this.street = this.user.address;
      }
    });
    this.user= userService.getUser();
    this.userComponent= new UserComponent(httpClient,userService,router);
  }

  ngOnInit(): void {
    let userId = Number(localStorage.getItem('userId'));
    if(userId != null){
      this.getUserPosts(userId);
    }
    console.log(this.router.url);

  }

  updateInfo() {
    if(this.validate(this.user)){
      this.httpClient.put(environment.endpointURL + "user/" + this.userService.getUser(),{
        firstName: this.user?.firstName,
        lastName: this.user?.username,
        address: this.street + ';' + this.city,
        birthday: this.user.birthday,
        phoneNumber: this.user.phoneNumber,
        email: this.user.email
      }).subscribe(()=>{
        this.updateErrorMsg = '';
        this.editInfo = false;
      },(res:any)=>{
        this.updateErrorMsg= res.error.message;
      });
    } else{
      this.updateErrorMsg = 'Please fill all required fields!';
    }

  }

  validate(user: User) :boolean{
    return user.firstName !='' && user.lastName !='' && user.email!='' && user.username !='' && user.password!='';
  }

  private getUserPosts(id: number) {
    this.userPosts = [];
    this.httpClient.get(environment.endpointURL + "post/user/" + id).subscribe((posts:any) =>{
      posts.forEach((post:any)=>{
        this.userPosts.push(new Post(post.postId,post.title, post.categoryId, post.content, post.creatorId, post.date, post.votes,post.itemImage));
      });
    });
  }
}
