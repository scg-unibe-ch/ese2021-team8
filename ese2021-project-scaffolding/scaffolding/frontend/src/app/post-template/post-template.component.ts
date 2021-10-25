import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../models/post.model";
import {Category} from "../models/category.model";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-post-template',
  templateUrl: './post-template.component.html',
  styleUrls: ['./post-template.component.css']
})
export class PostTemplateComponent implements OnInit {

  displayPostTemplate: boolean = false;

  categories: Category[] =[];

  emptyCategory = new Category(0,'');

  //@Input()
  postTitle : string = '';
  postCategory: Category = this.emptyCategory;
  postContent: string = '';

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.readCategories();
  }

  clickCreatePost(): void {
    this.displayPostTemplate = true;
  }

  closePostTemplate() {
    this.displayPostTemplate = false;
  }

  readCategories(): void{
    this.httpClient.get(environment.endpointURL + "category").subscribe((categories:any) => {
      categories.forEach((category: any) => {
        this.categories.push(category);
      });
    });
  }

  createPost(): void{
    //console.log(new Post(0, this.postTitle, this.postCategory.categoryId, this.postContent, this.userService.getUser()?.userId , new Date()));
    this.httpClient.post(environment.endpointURL + "post/", {
      title: this.postTitle,
      content: this.postContent,
      creator: this.userService.getUser()?.userId,
      category: this.postCategory.categoryId,
      date: new Date()
    }).subscribe();
  }

  /*
  createCategory(){
    this.httpClient.post(environment.endpointURL + "category", {
      categoryName: this.emptyCategory.categoryName
    }).subscribe( (res: any) => {
      this.emptyCategory.categoryName = ''; }
    );
  }*/

}
