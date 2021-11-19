import {Component, OnInit} from '@angular/core';
import {Post} from "../models/post.model";
import {PostCategory} from "../models/postCategory.model";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-post-template',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  displayPostTemplate: boolean = false;


  categories: PostCategory[] =[];

  emptyCategory = new PostCategory(0,'');

  posts: Post[] = [];
  postTitle : string = '';
  postCategory: PostCategory = this.emptyCategory;
  postContent: string = '';
  postPicture: string = '';
  selectedFile = null;
  hasPicture = false;
  preview = null;
  showError: boolean = false;

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
    this.postTitle = '';
    this.postContent = '';
    this.postCategory = this.emptyCategory;
    this.preview = null;
    this.selectedFile = null;
    this.showError = false;
    this.hasPicture = false;
  }

  readCategories(): void{
    this.httpClient.get(environment.endpointURL + "post/category").subscribe((categories:any) => {
      categories.forEach((category: any) => {
        this.categories.push(category);
      });
    });
  }

  createPost(): void {
    if(this.postTitle == '' || this.postCategory == this.emptyCategory || (this.postContent == '' && !this.hasPicture)){
      this.showError = true;
      return;
    }
    if (this.hasPicture) {
      this.httpClient.post(environment.endpointURL + "post", {
        title: this.postTitle,
        content: this.postContent,
        creatorId: this.userService.getUser().userId,
        categoryId: this.postCategory.postCategoryId,
        date: new Date(),
        votes: 0,
        itemImage: true
      }).subscribe((post: any) => {
        const newPost = new Post(post.postId, post.title, post.categoryId, post.content, post.creatorId, post.date, post.votes, post.itemImage);

        const formData = new FormData();
        // @ts-ignore
        formData.append("image", this.selectedFile);

        this.httpClient.post(environment.endpointURL + "post/" + post.postId + "/image", formData)
          .subscribe(() => {
            this.posts.unshift(newPost);
            this.closePostTemplate();
          });
      });
    }

    if(!this.hasPicture){
      this.httpClient.post(environment.endpointURL + "post", {
        title: this.postTitle,
        content: this.postContent,
        creatorId: this.userService.getUser().userId,
        categoryId: this.postCategory.postCategoryId,
        date: new Date(),
        votes: 0,
        itemImage: false
      }).subscribe((post: any) => {
        this.posts.unshift(
          new Post(post.postId, post.title, post.categoryId, post.content, post.creatorId, post.date, post.votes, post.itemImage));
          this.closePostTemplate();
      });
    }

}

  getPosts(): void{
    this.posts = [];
    this.httpClient.get(environment.endpointURL + "post").subscribe((posts: any)=>{
      posts.forEach((post:any)=>{
      this.posts.unshift(new Post(post.postId, post.title, post.categoryId, post.content, post.creatorId, post.date, post.votes, post.itemImage));})
      this.postTitle = this.postContent = '';
      this.displayPostTemplate = false;
    });
  }

  updatePost(post: Post): void {
    this.httpClient.put(environment.endpointURL + "post/" + post.postId, {
      votes: post.votes,
      title: post.title,
      content: post.content,
      categoryId: post.categoryId
    }).subscribe(() => {
      this.getPosts();
    });
  }

  onFileChanged(event: any) {
    this.hasPicture = true;
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.preview = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }
}
