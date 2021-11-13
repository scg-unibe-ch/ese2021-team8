import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  user: User = new User(0, "","","","","","","",0);

  constructor( public userService: UserService,
               public dialogRef: MatDialogRef<CheckoutComponent>) {
    userService.user$.subscribe(res => this.user = res);
    this.user = userService.getUser();
  }

  ngOnInit(): void {
  }

}
