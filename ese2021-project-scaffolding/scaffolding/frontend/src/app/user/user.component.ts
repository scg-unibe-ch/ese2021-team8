import {Component, OnInit} from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  // Initialize the variables
  loggedIn: boolean | undefined;
  user: User | undefined;

  userToRegister: User = new User(0, '', '','','','','','',0);

  userToLogin: User = new User(0, '', '','','','','','',0);

  passwordHasLength: boolean = false;
  passwordHasUpper: boolean = false;
  passwordHasLower: boolean = false;
  passwordHasNumber: boolean = false;
  passwordHasSpecial: boolean = false;
  endpointMsgUser: string = '';
  endpointMsgAdmin: string = '';
  loginErrorMsg: string = '';
  registerErrorMsg: string = '';


  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    userService.user$.subscribe(res => this.user = res);

    // Current value
    this.loggedIn = userService.getLoggedIn();
    this.user = userService.getUser();
    let id = localStorage.getItem('userId');
    /*if(id){
      this.httpClient.get(environment.endpointURL + "user/" + id).subscribe( (res: any) => {
      this.userService.setUser(res);
      });
    }*/
    console.log(this.user);
  }

  /**
   * This Methode is responsible for the register from a user. It handle the Name and
   * the password to the backend.
   * This Methode check the following constraints: has a Upper/ Lower7 Number and a Special char
   * parameter passwordOkey
   * @author Assistenz, Ramona, A
   *
   */
  // Edit A + R
  registerUser(): void {

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

    if(passwordOkay) {
    this.httpClient.post(environment.endpointURL + "user/register", {
      userName: this.userToRegister.username,
      password: this.userToRegister.password,
      firstName: this.userToRegister.firstName,
      lastName: this.userToRegister.lastName,
      email: this.userToRegister.email,
      address: this.userToRegister.address,
      birthday: this.userToRegister.birthday,
      phoneNumber: this.userToRegister.phoneNumber
    }).subscribe((res: any) => {
      this.userToRegister.username = this.userToRegister.password = this.userToRegister.firstName
        = this.userToRegister.lastName = this.userToRegister.email = this.userToRegister.address = this.userToRegister.birthday = '',
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
      }, (res: any) => {
      this.loginErrorMsg = res.error.message;
    })
  }

  logoutUser(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userToken');

    this.userService.setLoggedIn(false);
    this.userService.setUser(undefined);
  }

  accessUserEndpoint(): void {
    this.httpClient.get(environment.endpointURL + "secured").subscribe(() => {
      this.endpointMsgUser = "Access granted";
    }, () => {
      this.endpointMsgUser = "Unauthorized";
    });
  }

  accessAdminEndpoint(): void {
    this.httpClient.get(environment.endpointURL + "admin").subscribe(() => {
      this.endpointMsgAdmin = "Access granted";
    }, () => {
      this.endpointMsgAdmin = "Unauthorized";
    });
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
    let specialChars = ['+' ,'*', 'ç' , '%' , '&' , '/' , '(' , ')' , '=' , '£' , '!' , '?','@']
    for(let i=0; i<password.length; i++) {
      // Test this special Chars /+"*ç%&/()=£!?@;  @A
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


}
