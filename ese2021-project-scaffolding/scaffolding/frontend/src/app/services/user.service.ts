import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Subject } from 'rxjs';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  private loggedIn: boolean | undefined;

  private user: User = new User(0,'','','','','','','',0);

  private admin: boolean = false;


  /*******************************************************************************************************************
   * OBSERVABLE SOURCES & STREAMS
   ******************************************************************************************************************/

  // Observable Sources
  private loggedInSource = new Subject<boolean>();
  private userSource = new Subject<User>();
  private adminSource = new Subject<boolean>()

  // Observable Streams
  loggedIn$ = this.loggedInSource.asObservable();
  user$ = this.userSource.asObservable();
  admin$ = this.adminSource.asObservable();


  /*******************************************************************************************************************
   * GETTERS
   ******************************************************************************************************************/

  getLoggedIn(): boolean | undefined {
    return this.loggedIn;
  }

  getUser(): User {
    return this.user;
  }

  isAdmin(): boolean{
    return this.admin;
  }


  /*******************************************************************************************************************
   * SETTERS
   ******************************************************************************************************************/

  setLoggedIn(loggedIn: boolean | undefined): void {
    this.loggedInSource.next(loggedIn);
  }

  setUser(user: User | undefined): void {
    this.userSource.next(user);
  }

  setAdmin(admin: boolean): void {
    this.adminSource.next(admin);
  }


  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(public httpClient: HttpClient) {
    // Observer
    this.loggedIn$.subscribe(res => this.loggedIn = res);
    this.user$.subscribe(res => this.user = res);
    this.admin$.subscribe(res => this.admin = res)

    // Default values
    let id = localStorage.getItem('userId');
    if(id) {
      httpClient.get(environment.endpointURL + "user/" + id).subscribe((res: any) => {
        this.setUser(new User(res.userId, res.userName, res.password, res.firstName,res.lastName, res.email, res.address, res.birthday, res.phoneNumber));
        this.setAdmin(res.admin);
      });
    }
    this.setLoggedIn(false);
  }
}
