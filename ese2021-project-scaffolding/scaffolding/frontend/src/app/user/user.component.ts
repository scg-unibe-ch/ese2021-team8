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
  // Initialize the variables
  loggedIn: boolean | undefined;
  user: User | undefined;

  userToRegister: User = new User(0, '', '');

  userToLogin: User = new User(0, '', '');

  passwordHasLength: boolean = false;
  passwordHasUpper: boolean = false;
  passwordHasLower: boolean = false;
  passwordHasNumber: boolean = false;
  passwordHasSpecial: boolean = false;
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
  /**
   * This Methode is responiable for the register from a user. It handle the Name and
   * the password to the bakend.
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
  //Autor @Ramona
  checkPasswordLength(password: string): boolean{
    let hasLength = password.length >= 8;
    return hasLength;
  }
  //Autor @Ramona
  checkPasswordUpper(password: string): boolean{
    let hasUpper = false;
    for(let i=0; i<password.length; i++){
      if(password.charAt(i) == password.charAt(i).toUpperCase() && password.charAt(i)!= password.charAt(i).toLowerCase()){
        hasUpper = true;
        break;
      }
    }
    return hasUpper;
  }
  //Autor @Ramona
  checkPasswordLower(password: string): boolean{
    let hasLower = false;
    for(let i=0; i<password.length; i++) {
      if (password.charAt(i) == password.charAt(i).toLowerCase() && password.charAt(i) != password.charAt(i).toUpperCase()) {
        hasLower = true;
        break;
      }
    }
    return hasLower;
  }
 // Autor @A
  checkPasswordSpecial(password: string): boolean{
    let hasSpezial = false;
    for(let i=0; i<password.length; i++) {
      // Test this special Chars /+"*ç%&/()=£!?@;  @A
      let passwordCharOne = password.charAt(i);
      if (passwordCharOne == '+' || '*' || 'ç' || '%' || '&' || '/' || '(' || ')' || '=' || '£' || '!' || '?'||'@') {
        return true;

        break;
      }

    }
    return hasSpezial;
  }

  // Autor @A
  checkPasswordNumber(password: string): boolean{
    let hasNumber = false;

    for(let i=0; i<password.length; i++) {
      let passwordCharOne = password.charAt(i);
      if (passwordCharOne == '1' || '2' || '3' || '4' || '5' || '6' || '7' || '8' || '9' ) {
        return true;
        break;
      }

    }
    return hasNumber;
  }


}
