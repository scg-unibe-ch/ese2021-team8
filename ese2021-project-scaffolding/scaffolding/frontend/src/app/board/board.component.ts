import {Component, OnInit} from '@angular/core';
import {Post} from "../models/post.model";
import {PostCategory} from "../models/postCategory.model";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../services/user.service";
import {PostService} from "../services/post.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationComponent} from "../confirmation/confirmation.component";

@Component({
  selector: 'app-post-template',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  //display the template to create a new post
  displayPostTemplate: boolean = false;

  //post categories to select for new post or sort by
  categoryId: number=0;
  selectedCategories: PostCategory[] = [];
  categories: PostCategory[];
  emptyCategory = new PostCategory(0,'');

  // this Vars are used in the posts
  posts: Post[] = [];
  postTitle : string = '';
  postCategory: PostCategory = this.emptyCategory;
  postContent: string = '';
  postPicture: string = '';
  selectedFile = null;

  //scr to show a preview of image to be uploaded with a post
  preview = null;

  // is true if the User not fill all required fields and show a missing "Error"
  showError: string = "";

  //indicate if a Post have a picture or not
  hasPicture = false;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    public postServices: PostService,
    public dialog: MatDialog
  ) {
    postServices.categories$.subscribe(res => this.categories = res);
    this.categories = postServices.getCategories();
  }

  ngOnInit(): void {
    this.getPosts();
  }

  /**
   * Ask the Backend for the Posts and show it.
   */
  getPosts(): void{
    this.posts = [];
    if(this.selectedCategories.length==0) {
      this.httpClient.get(environment.endpointURL + "post/page/" + 1).subscribe((posts: any) => {
        posts.forEach((post: any) => {
          this.posts.push(new Post(post.postId, post.title, post.categoryId, post.content, post.creatorId, post.date, post.votes, post.itemImage));
        })
        this.postTitle = this.postContent = '';
        this.displayPostTemplate = false;
      });
    } else{
      this.selectedCategories.forEach((category)=>{
        this.httpClient.get(environment.endpointURL + "post/" + category.postCategoryId).subscribe((posts: any) => {
          posts.forEach((post: any) =>{
            this.posts.unshift(new Post(post.postId, post.title, post.categoryId, post.content, post.creatorId, post.date, post.votes, post.itemImage));
          });
        });
      });
    }
  }

  /**
   * This Method closes the Template and resets the vars
   */
  closePostTemplate() {
    this.displayPostTemplate = false;
    this.postTitle = '';
    this.postContent = '';
    this.postCategory = this.emptyCategory;
    this.preview = null;
    this.selectedFile = null;
    this.showError = "";
    this.hasPicture = false;
  }

  /**
   *Checks if every Field that is required is filled. If not it changes the showError message. It then creates
   * a new post. If the post includes a picture it adds the picture to that post.
   */
  createPost(): void {
    if (this.postTitle == '' || this.postCategory == this.emptyCategory ){
      this.showError = 'please fill all required fields';
      return;
    }
    else if(this.postContent == '' && !this.hasPicture ){
        this.showError = 'post needs text content or image';
        return;
      }
    this.httpClient.post(environment.endpointURL + "post", {
      title: this.postTitle,
      content: this.postContent,
      creatorId: this.userService.getUser().userId,
      categoryId: this.postCategory.postCategoryId,
      date: new Date(),
      votes: 0,
      itemImage: this.hasPicture
    }).subscribe((post: any) => {
      const newPost = new Post(post.postId, post.title, post.categoryId, post.content, post.creatorId, post.date, post.votes, post.itemImage);
      if (post.itemImage) {
        const formData = new FormData();
        // @ts-ignore
        formData.append("image", this.selectedFile);
        //add the File to the Post
        this.httpClient.post(environment.endpointURL + "post/" + post.postId + "/image", formData)
          .subscribe(() => {
          });
      }
      this.posts.unshift(newPost);
      this.closePostTemplate();
    });
  }

  /**
   *  Read the File and add it to the Post
   * @param event: the File that is attached
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

  /**
   * get selected Category to sort posts by category
   * */
  selected(postCategoryId: number) {
    let selected = false;
    this.selectedCategories.forEach((category)=>{
      if(category.postCategoryId == postCategoryId){
        selected = true;
      }
    });
    if(!selected) {
      this.httpClient.get(environment.endpointURL + "post/category/" + postCategoryId).subscribe((category: any) => {
        this.selectedCategories.push(category);
        this.getPosts();
      });
    }
  }

  /**
   * remove category from selected
   * */
  remove(category: PostCategory) {
    const index = this.selectedCategories.indexOf(category);
    if(index >=0){
      this.selectedCategories.splice(index, 1);
      this.getPosts();
    }
  }
  /**
   * load more posts
   * */
  loadMore(){
    this.httpClient.get(environment.endpointURL + "post/page/" + (this.postServices.getCurrentPage()+1)).subscribe((posts:any)=>{
      posts.forEach((post:any)=>{
        this.posts.push(new Post(post.postId, post.title, post.categoryId, post.content, post.creatorId, post.date, post.votes, post.itemImage));
      });
    });
    this.postServices.increasePage();
  }

  /**
   * remove Image from post upload
   * */
  removeImage() {
    const dialogRef = this.dialog.open(ConfirmationComponent,{ data: { question: 'remove the image from this post'} });
    dialogRef.afterClosed().subscribe((result) =>{
      if(result){
        this.hasPicture= false;
        this.selectedFile = null;
      }
    });
  }
}
