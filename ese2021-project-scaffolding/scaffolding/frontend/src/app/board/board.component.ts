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
  //To show the Template
  displayPostTemplate: boolean = false;


  categories: PostCategory[] =[];
  emptyCategory = new PostCategory(0,'');

  // this Vars are used in the posts
  posts: Post[] = [];
  postTitle : string = '';
  postCategory: PostCategory = this.emptyCategory;
  postContent: string = '';
  postPicture: string = '';
  selectedFile = null;
  //show the scr pfad
  preview = null;

  // is true if the User not fill all required fields and show a missing "Error"
  showError: boolean = false;

  //Say if a Post have a picture or not
  hasPicture = false;


  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.readCategories();
    this.getPosts();
  }

  clickCreatePost(): void {
    this.displayPostTemplate = true;
  }

  /**
   * This Methode close the Templates and empty the vars
   */
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

  /**
   *
   */
  readCategories(): void{
    this.httpClient.get(environment.endpointURL + "post/category").subscribe((categories:any) => {
      categories.forEach((category: any) => {
        this.categories.push(category);
      });
    });
  }

  /**
   *This Methode checke if every Field that is required is filled. If not it change the showError to true. It
   * is splittet in with Picture and without picture. The reason is, that it will be smaller with out a Picture and
   * the Picture isn't a required field. The redundancy is because we need first to create the Post and then we can attache
   * the File. The parameter itemImage need to be false if there is no Image, and True if there is.
   */
  createPost(): void {
    if(this.postTitle == '' || this.postCategory == this.emptyCategory || (this.postContent == '' && !this.hasPicture)){
      this.showError = true;
      return;
    }
    //check if there is a Picture
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
        //add the File to the Post
        this.httpClient.post(environment.endpointURL + "post/" + post.postId + "/image", formData)
          .subscribe(() => {
            this.posts.unshift(newPost);
            this.closePostTemplate();
          });
      });
    }
    //check if there is no Picture
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

  /**
   * Ask the Backend for the Posts and show it.
   */
  getPosts(): void{
    this.posts = [];
    this.httpClient.get(environment.endpointURL + "post").subscribe((posts: any)=>{
      posts.forEach((post:any)=>{
      this.posts.unshift(new Post(post.postId, post.title, post.categoryId, post.content, post.creatorId, post.date, post.votes, post.itemImage));})
      this.postTitle = this.postContent = '';
      this.displayPostTemplate = false;
    });
  }

  /**
   * With this Methode the Admin can update/change a Post.
   *
   * @param post.votes: number
   *        post.title: Sting
   *        post.content: String
   *        post.categoryId: number
   */
  updatePost(post: Post): void {
    this.httpClient.put(environment.endpointURL + "post/" + post.postId, {
      votes: post.votes,
      title: post.title,
      content: post.content,
      categoryId: post.categoryId
    }).subscribe(() => {
      //this.getPosts();
    });
  }

  /**
   *  Read the File and add it to the Post
   * @param event:is the File that is attached
   */
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
