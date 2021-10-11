import { Component } from '@angular/core';
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

  loggedIn: boolean | undefined;

  /*passwordTooShort: boolean | undefined;*/

  user: User | undefined;

  userToRegister: User = new User(0, '', '');

  userToLogin: User = new User(0, '', '');
  passwordTooShort: boolean = false;
  passwordHasUpper: boolean = false;
  passwordHasLower: boolean = false;
  passwordHasNumber: boolean = false;
  passwordHasSpezial: boolean = false;
  endpointMsgUser: string = '';
  endpointMsgAdmin: string = '';

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
  }

  registerUser(): void {
    this.passwordTooShort = this.checkPasswordLength(this.userToRegister.password);
    this.passwordHasLower = this.checkPasswordLower(this.userToRegister.password);
    this.passwordHasUpper = this.checkPasswordUpper(this.userToRegister.password);
    this.passwordHasNumber = this.checkPasswordNumber(this.userToRegister.password);
    this.passwordHasSpezial = this.checkPasswordSpezial(this.userToRegister.password);

    let passwordOkey = this.passwordTooShort
                          && this.passwordHasLower
                          && this.passwordHasUpper
                          && this.passwordHasNumber
                          && this.passwordHasSpezial ;

    if(!passwordOkey
    {
    this.httpClient.post(environment.endpointURL + "user/register", {
      userName: this.userToRegister.username,
      password: this.userToRegister.password
    }).subscribe(() => {
      this.userToRegister.username = this.userToRegister.password = '';
    });
    }
  }

  loginUser(): void {
    this.httpClient.post(environment.endpointURL + "user/login", {
      userName: this.userToLogin.username,
      password: this.userToLogin.password
    }).subscribe((res: any) => {
      this.userToLogin.username = this.userToLogin.password = '';

      localStorage.setItem('userName', res.user.userName);
      localStorage.setItem('userToken', res.token);

      this.userService.setLoggedIn(true);
      this.userService.setUser(new User(res.user.userId, res.user.userName, res.user.password));
    });
  }

  logoutUser(): void {
    localStorage.removeItem('userName');
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

  checkPasswordLength(password: string): boolean{
    let tooShort = password.length < 8;
    return tooShort;
  }
  checkPasswordUpper(password: string): boolean{
    let hasUpper = false;
    return hasUpper;
  }
  checkPasswordLower(password: string): boolean{
    let hasLower = false;
    return hasLower;
  }
  checkPasswordSpezial(password: string): boolean{
    let hasSpezial = false;
    return hasSpezial;
  }
  checkPasswordNumber(password: string): boolean{
    let hasNumber = false;
    return hasNumber;
  }


}
