import { Component, OnInit } from '@angular/core';
import {Order} from "../models/order.model";
import {environment} from "../../environments/environment";
import {User} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../services/user.service";
import {UserComponent} from "../user/user.component";
import {Router} from "@angular/router";
import {Post} from "../models/post.model";
import {ToastrService} from "ngx-toastr";

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

  changePassword: boolean = false;
  oldPassword: string = '';
  newPassword: string = '';
  passwordErrorMsg: string = '';

  userComponent: UserComponent;

  hideOnSm: boolean = true;

  userPosts: Post[] = [];
  userId: number;
  constructor(private httpClient: HttpClient,
              public userService: UserService,
              public router: Router,
              private toastr: ToastrService) {
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
    this.userComponent= new UserComponent(httpClient,userService,router, toastr);
    this.userId = Number(localStorage.getItem('userId'));
    if(this.userId != null){
      this.getUserPosts();
    }

  }

  ngOnInit(): void {

  }

  updateInfo() {
    if(this.validate(this.user)){
      this.httpClient.put(environment.endpointURL + "user/" + this.userService.getUser().userId,{
        firstName: this.user?.firstName,
        lastName: this.user?.username,
        address: this.street + ';' + this.city,
        birthday: this.user.birthday,
        phoneNumber: this.user.phoneNumber,
        email: this.user.email
      }).subscribe(()=>{
        this.toastr.show('Profile info was updated');
        this.updateErrorMsg = '';
      },(res:any)=>{
        this.updateErrorMsg= res.error.message;
      });
    } else{
      this.updateErrorMsg = 'Please fill all required fields!';
    }

  }

  updatePassword() {
    if (this.oldPassword == '' || this.newPassword == '') {
      this.passwordErrorMsg = 'Please fill all the required fields!';
    } else {
      let passwordHasLength = this.userComponent.checkPasswordLength(this.newPassword);
      let passwordHasLower = this.userComponent.checkPasswordLower(this.newPassword);
      let passwordHasUpper = this.userComponent.checkPasswordUpper(this.newPassword);
      let passwordHasNumber = this.userComponent.checkPasswordNumber(this.newPassword);
      let passwordHasSpecial = this.userComponent.checkPasswordSpecial(this.newPassword);

      let passwordOkay = passwordHasLength
        && passwordHasLower
        && passwordHasUpper
        && passwordHasNumber
        && passwordHasSpecial;

      if(passwordOkay) {
        this.httpClient.put(environment.endpointURL + "user/" + this.userId + '/changePassword', {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        }).subscribe(() => {
          this.passwordErrorMsg = this.oldPassword = this.newPassword = '';
          this.changePassword = false;
          this.toastr.show('Password changed');
        }, (res: any) => {
          this.passwordErrorMsg = res.error.message;
        })
      } else {
        this.passwordErrorMsg = '';
        if(!passwordHasLength) { this.passwordErrorMsg = 'Password must have at least 8 characters!'}
        if(!passwordHasLower) { this.passwordErrorMsg += '\n Password must have at least one lowercase letter!' }
        if(!passwordHasUpper) { this.passwordErrorMsg += '\n Password must have at least one capital letter!' }
        if(!passwordHasNumber) { this.passwordErrorMsg += '\n Password must have at least one number!' }
        if(!passwordHasSpecial) { this.passwordErrorMsg += '\n Password must have at least one of the following special characters: / + * ç % & ( ) = £ ! ? @' }
        }
      }
    }

  validate(user: User) :boolean{
    return user.firstName !='' && user.lastName !='' && user.email!='' && user.username !='' && user.password!='';
  }

  getUserPosts() {
    this.userPosts = [];
    this.httpClient.get(environment.endpointURL + "post/user/" + this.userId).subscribe((posts:any) =>{
      posts.forEach((post:any)=>{
        this.userPosts.unshift(new Post(post.postId,post.title, post.categoryId, post.content, post.creatorId, post.date, post.votes,post.itemImage));
      });
    });
  }
}

