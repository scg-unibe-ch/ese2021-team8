import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import {Order} from "../models/order.model";
import {Product} from "../models/product.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit{

  loggedIn: boolean | undefined;
  user: User = this.userService.getUser();

  userToRegister: User = new User(0, '', '','','','','','',0);

  userToLogin: User = new User(0, '', '','','','','','',0);

  passwordHasLength: boolean = false;
  passwordHasUpper: boolean = false;
  passwordHasLower: boolean = false;
  passwordHasNumber: boolean = false;
  passwordHasSpecial: boolean = false;
  loginErrorMsg: string = '';
  registerErrorMsg: string = '';
  updateErrorMsg: string = '';
  street : string = '';
  city : string = '';

  orders: Order[] = [];
  status: string ='';

  editInfo: boolean = false;


  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    public router: Router
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    userService.user$.subscribe(res =>{ this.user = res;});

    // Current value
    this.loggedIn = userService.getLoggedIn();
    userService.user$.subscribe(() =>{
      let address : string[] = this.user.address.split(";");
      if(address.length==2) {
        this.street = address[0];
        this.city = address[1];
      } else{
        this.street = this.user.address;
      }
    });
    this.user = userService.getUser();
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    if(this.loggedIn){
      this.getOrders()
    }
  }

  /**
   * This Methode is responsible for the registration request from a user. It passes the name and
   * the password to the backend.
   * This Methode checks the following constraints: has a Upper-/Lowercase, Number and a Special char
   * @author Assistenz, Ramona, A
   *
   */
  // Edit A + R
  registerUser(): void {
    if(!this.validate(this.userToRegister)){
      this.registerErrorMsg = 'Please fill all required fields';
    }
    this.passwordHasLength = this.checkPasswordLength(this.userToRegister.password);
    this.passwordHasLower = this.checkPasswordLower(this.userToRegister.password);
    this.passwordHasUpper = this.checkPasswordUpper(this.userToRegister.password);
    this.passwordHasNumber = this.checkPasswordNumber(this.userToRegister.password);
    this.passwordHasSpecial = this.checkPasswordSpecial(this.userToRegister.password);

    let passwordOkay = this.passwordHasLength
                          && this.passwordHasLower
                          && this.passwordHasUpper
                          && this.passwordHasNumber
                          && this.passwordHasSpecial ;

    if(passwordOkay&&this.validate(this.userToRegister)) {
    this.httpClient.post(environment.endpointURL + "user/register", {
      userName: this.userToRegister.username,
      password: this.userToRegister.password,
      firstName: this.userToRegister.firstName,
      lastName: this.userToRegister.lastName,
      email: this.userToRegister.email,
      address: this.userToRegister.address + this.street + ';' + this.city ,
      birthday: this.userToRegister.birthday,
      phoneNumber: this.userToRegister.phoneNumber
    }).subscribe(() => {
      this.userToLogin.username = this.userToRegister.username;
      this.userToLogin.password = this.userToRegister.password;
      this.loginUser();
      this.userToRegister.username = this.userToRegister.password = this.userToRegister.firstName
        = this.userToRegister.lastName = this.userToRegister.email = this.userToRegister.address = this.userToRegister.birthday =
        this.street = this.city = '',
      this.userToRegister.phoneNumber = 0;
      this.registerErrorMsg = '';
    }, (res: any) => {
      this.registerErrorMsg = res.error.message;
    });
    }
  }

  loginUser(): void {
    this.httpClient.post(environment.endpointURL + "user/login", {
      userName: this.userToLogin.username,
      password: this.userToLogin.password
    }).subscribe((res: any) => {
      this.userToLogin.username = this.userToLogin.password = '';
      this.loginErrorMsg = '';

      localStorage.setItem('userId', res.user.userId);
      localStorage.setItem('userToken', res.token);

      this.userService.setLoggedIn(true);
      this.userService.setUser(new User(res.user.userId, res.user.userName, res.user.password, res.user.firstName, res.user.lastName,
                          res.user.email, res.user.address, res.user.birthday, res.user.phoneNumber));
      this.userService.setAdmin(res.user.admin);
      this.ngOnInit();
      }, (res: any) => {
      this.loginErrorMsg = res.error.message;
    });
  }

  logoutUser(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userToken');

    this.userService.setLoggedIn(false);
    this.userService.setUser(undefined);
    this.userService.setAdmin(false);
    this.router.navigate(['home']).then();
  }

  //Autor @Ramona
  checkPasswordLength(password: string): boolean{
    return password.length >= 8;
  }

  //Autor @Ramona
  checkPasswordUpper(password: string): boolean{
    for(let i=0; i<password.length; i++){
      if(password.charAt(i) == password.charAt(i).toUpperCase() && password.charAt(i)!= password.charAt(i).toLowerCase()){
        return true;
      }
    }
    return false;
  }

  //Autor @Ramona
  checkPasswordLower(password: string): boolean{
    for(let i=0; i<password.length; i++) {
      if (password.charAt(i) == password.charAt(i).toLowerCase() && password.charAt(i) != password.charAt(i).toUpperCase()) {
        return true;
      }
    }
    return false;
  }

 // Autor @A
  checkPasswordSpecial(password: string): boolean{
    let hasSpezial = false;
    let specialChars = ['+' ,'*', 'ç' , '%' , '&' , '/' , '(' , ')' , '=' , '£' , '!' ,`$`,'?','@']
    for(let i=0; i<password.length; i++) {
      // Test this special Chars /+"*ç%&/()=£!?@$;  @A
      let passwordCharOne = password.charAt(i);
      if (specialChars.includes(passwordCharOne)){
        return true;
      }

    }
    return hasSpezial;
  }

  // Autor @A
  checkPasswordNumber(password: string): boolean{
    let hasNumber = false;
    let numbers = ['1','2','3','4','5','6','7','8','9','0']
    for(let i=0; i<password.length; i++) {
      let passwordCharOne = password.charAt(i);
      if (numbers.includes(passwordCharOne)) {
        return true;
      }

    }
    return hasNumber;
  }

 getOrders(): void{
    this.orders = [];
    this.httpClient.get(environment.endpointURL + "order/user/" + this.user?.userId).subscribe((orders:any) => {
      orders.forEach((order:any) => {
        this.httpClient.get(environment.endpointURL + "product/" + order.productId).subscribe((product: any) =>{
          let orderProduct = new Product(product.productId, product.title, product.shopCategoryId, product.description, product.price, product.productImage);
          this.orders.unshift(new Order(order.orderId, order.userId, order.firstName, order.lastName, order.address, order.paymentMethod, order.deliveryStatus, orderProduct));
        });
      });
    }, () => {});
  }

  cancelOrder(id: number): void{
    this.httpClient.put(environment.endpointURL + "order/" + id, {
      deliveryStatus: 'cancelled'
    }).subscribe(()=> this.getOrders()
    );
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
}
