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

  @Input()
  newPost = new Post('',undefined,'',undefined,new Date());
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
    this.newPost.date = new Date();
    this.newPost.creator = this.userService.getUser();
    console.log(this.newPost);
    this.newPost.title = this.newPost.content = '';
    this.displayPostTemplate = false;
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
