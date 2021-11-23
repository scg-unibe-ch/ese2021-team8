import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes} from '@angular/router'

import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoItemComponent } from './todo-list/todo-item/todo-item.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserComponent } from './user/user.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import {BoardComponent } from './board/board.component';
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import { PostComponent } from './board/post/post.component';
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatExpansionModule} from "@angular/material/expansion";
import { AdminTabComponent } from './admin-tab/admin-tab.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { ShopComponent } from './shop/shop.component';
import { ShopItemsComponent } from './shop/shop-items/shop-items.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {ExtendedModule, FlexModule} from "@angular/flex-layout";
import { CheckoutComponent } from './shop/checkout/checkout.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSortModule} from "@angular/material/sort";

const routes: Routes = [
  {path: 'home', component: BoardComponent },
  {path: 'user', component: UserComponent},
  {path: '', redirectTo: '/home', pathMatch:'full'},
  {path: 'admin', component: AdminTabComponent},
  {path: 'shop', component: ShopComponent},
  {path: 'checkout', component: CheckoutComponent}
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
    CheckoutComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatToolbarModule,
        MatTabsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatListModule,
        FormsModule,
        MatCheckboxModule,
        MatSelectModule,
        MatOptionModule,
        MatChipsModule,
        MatIconModule,
        MatMenuModule,
        RouterModule.forRoot(routes),
        MatExpansionModule,
        MatTooltipModule,
        MatGridListModule,
        MatDialogModule,
        MatSidenavModule,
        FlexModule,
        ReactiveFormsModule,
        ExtendedModule,
        MatAutocompleteModule,
        MatSortModule
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
