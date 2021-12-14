import {Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { Router } from "@angular/router";
import { UserComponent } from "./user/user.component";
import { ToastrService } from "ngx-toastr";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';


  loggedIn: boolean | undefined;

  isAdmin: boolean = false;
  user: User | undefined;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    public router: Router,
    private toastr: ToastrService
  ) {

    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    userService.user$.subscribe(res => this.user = res);
    userService.admin$.subscribe(res => this.isAdmin = res);

    // Current value
    this.loggedIn = userService.getLoggedIn();
    this.user = userService.getUser();
    this.isAdmin = this.userService.isAdmin();
  }

  ngOnInit() {
    this.checkUserStatus();
  }

  checkUserStatus(): void {
    // Get user data from local storage
    const userToken = localStorage.getItem('userToken');

    // Set boolean whether a user is logged in or not
    this.userService.setLoggedIn(!!userToken);
  }

  logout(){
    let userComp = new UserComponent(this.httpClient, this.userService, this.router, this.toastr);
    userComp.logoutUser();
    this.ngOnInit();
  }

  EasterEgg() {
    window.open('https://www.bscyb.ch/kids-club');
  }

}
