import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../models/post.model";
import {Category} from "../models/category.model";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../services/user.service";
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-post-template',
  templateUrl: './post-template.component.html',
  styleUrls: ['./post-template.component.css']
})
export class PostTemplateComponent implements OnInit {

  displayPostTemplate: boolean = false;


  categories: Category[] =[];

  emptyCategory = new Category(0,'');

  posts: Post[] = [];
  postTitle : string = '';
  postCategory: Category = this.emptyCategory;
  postContent: string = '';
  postPicture: string = '';
  selectedFile = null;
  hasPicture = false;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.readCategories();
    this.getPosts();
  }

  clickCreatePost(): void {
    this.displayPostTemplate = true;
    console.log(this.posts);
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

  /**
   * in Progress, to reroll use if (this.isThePostWithPictures)
   */
  createPost(): void {
    if (this.hasPicture) {

      this.httpClient.post(environment.endpointURL + "post", {
        title: this.postTitle,
        content: this.postContent,
        image: this.hasPicture,
        creatorId: this.userService.getUser().userId,
        categoryId: this.postCategory.categoryId,
        date: new Date(),
        votes: 0,
        hasPicture: true
      }).subscribe((post: any) => {
        this.posts.unshift(
          new Post(post.postId, post.title, post.categoryId, post.content, post.creatorId, post.date, post.votes, post.hasPicture));
        const formData = new FormData();
        // @ts-ignore
        formData.append("image", this.selectedFile);

        this.httpClient.post(environment.endpointURL + "post/" + post.postId + "/image", formData)
          .subscribe((post: any) => {
            console.log(post);
            this.postTitle = this.postContent = "";
            this.postCategory = this.emptyCategory;
            this.displayPostTemplate = false;
          });
      });
    }

    if(!this.hasPicture){
      this.httpClient.post(environment.endpointURL + "post", {
        title: this.postTitle,
        content: this.postContent,
        image: this.hasPicture,
        creatorId: this.userService.getUser().userId,
        categoryId: this.postCategory.categoryId,
        date: new Date(),
        votes: 0,
        hasPicture: false
      }).subscribe((post: any) => {
        this.posts.unshift(
          new Post(post.postId, post.title, post.categoryId, post.content, post.creatorId, post.date, post.votes, post.hasPicture));
        this.postTitle = this.postContent = "";
        this.postCategory = this.emptyCategory;
        this.displayPostTemplate = false;
      });
    }
}

  getPosts(): void{
    this.posts = [];
    this.httpClient.get(environment.endpointURL + "post").subscribe((posts: any)=>{
      posts.forEach((post:any)=>{
        if(post.hasPicture){

        }
      this.posts.unshift(new Post(post.postId, post.title, post.categoryId, post.content, post.creatorId, post.date, post.votes, post.isThePostWithPictures));})
      this.postTitle = this.postContent = '';
      this.displayPostTemplate = false;

    });
  }

  updatePost(post: Post): void {
    this.httpClient.put(environment.endpointURL + "post/" + post.postId, {
      votes: post.votes,
      title: post.title,
      content: post.content
    }).subscribe();
  }

  onFileChanged(event: any) {
    this.hasPicture = true;
    this.selectedFile = event.target.files[0];

  }




  /**
   *Versuch das Bild aufzunehmen und am Backend zu senden. Jedoch ist Der Daten Typ im Model noch String
   * und möchte dies nicht einfach ändern


  selectFile({event}: { event: any }) {


    this.selectedFile() = event.target.files[0];

  }
  fileUpload() {
    const fileDate= new FormData();
    fileDate.append('image', this.selectedFile, this.selectFile.name);

  }
*/


}
