import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {Router, RouterModule, Routes} from '@angular/router'

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
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserComponent } from './user/user.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import {PostTemplateComponent} from "./post-template/post-template.component";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import { PostComponent } from './post-template/post/post.component';
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatExpansionModule} from "@angular/material/expansion";

const routes: Routes = [
  {path: 'home', component: PostTemplateComponent },
  {path: 'user', component: UserComponent},
  {path: '', redirectTo: '/home', pathMatch:'full'},
]

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    UserComponent,
    PostTemplateComponent,
    PostComponent
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
    MatExpansionModule
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
