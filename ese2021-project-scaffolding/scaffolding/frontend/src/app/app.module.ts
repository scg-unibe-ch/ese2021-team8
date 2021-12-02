import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes} from '@angular/router'

import { AppComponent } from './app.component';
import {ExtendedModule, FlexModule} from "@angular/flex-layout";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TodoListComponent } from '../deprecated/todo-list/todo-list.component';
import { TodoItemComponent } from '../deprecated/todo-list/todo-item/todo-item.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserComponent } from './user/user.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { BoardComponent } from './board/board.component';
import {ConfirmDelete, PostComponent} from './board/post/post.component';
import { AdminTabComponent } from './profile/admin-tab/admin-tab.component';
import { ShopComponent } from './shop/shop.component';
import { ShopItemsComponent } from './shop/shop-items/shop-items.component';
import { CheckoutComponent } from './shop/checkout/checkout.component';
import { MaterialModule } from "../material/material.module";
import { ProfileComponent } from "./profile/profile.component";
import { OrdersComponent } from './profile/orders/orders.component';
import { ToastrModule } from 'ngx-toastr';
import {ConfirmCancel} from './profile/orders/orders.component';

const routes: Routes = [
  {path: 'home', component: BoardComponent },
  {path: 'user', component: UserComponent},
  {path: '', redirectTo: '/home', pathMatch:'full'},
  {path: 'shop', component: ShopComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'profile', component: ProfileComponent, children: [
      {path: 'admin', component: AdminTabComponent},
      {path: 'orders/:userId', component: OrdersComponent}
    ]},

]

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    UserComponent,
    BoardComponent,
    PostComponent,
    AdminTabComponent,
    ShopComponent,
    ShopItemsComponent,
    CheckoutComponent,
    ProfileComponent,
    OrdersComponent,
    ConfirmCancel,
    ConfirmDelete
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot(routes),
        FlexModule,
        ReactiveFormsModule,
        ExtendedModule,
        MaterialModule,
        ToastrModule.forRoot()
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
