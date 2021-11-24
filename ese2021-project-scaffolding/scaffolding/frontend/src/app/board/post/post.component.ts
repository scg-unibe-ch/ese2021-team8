import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Post} from "../../models/post.model";
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {PostCategory} from "../../models/postCategory.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() categories!: PostCategory[];
  @Input() post!: Post;

  @Output() sendUpdate = new EventEmitter<Post>();
  @Output() getNewPosts = new EventEmitter<Post>();


  loggedIn: boolean | undefined;

  upvotes: number[] = [];
  downvotes: number[] = [];

  //indicates if this post has been up/downvoted
  upvoted: boolean | undefined;
  downvoted: boolean = false;

  //to display edit option if a user is logged in and created this post
  canEdit: undefined | boolean;

  //to display up/downvote buttons if user is logged in and not an admin
  canVote: boolean | undefined;

  //to open edit window if a user clicks on 'edit post'
  editMode: boolean = false;


  preview: string = "";

  //create a collapsed post if a post has more than 305 characters
  collapse: boolean = false;
  uncollapse: boolean = false;


  categoryName: string = "";
  img: any;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    public router: Router
  ) {
    userService.loggedIn$.subscribe((res) => {this.loggedIn = res; this.whoCanVote(); this.whoCanEdit();});
    this.loggedIn = userService.getLoggedIn();
  }

  ngOnInit(): void {
    this.getCategoryName();
    this.getUpvotes();
    this.getDownvotes();
    this.whoCanEdit();
    this.whoCanVote();
    if(this.post.itemImage){
      this.getImage();
    }
    if(this.post.content.length > 305){
      this.createCollapsable();
    }
  }

  getCategoryName(): void{
    this.httpClient.get(environment.endpointURL + "post/category/" + this.post.categoryId).subscribe(
      (res:any) =>{
        this.categoryName = res.postCategoryName;
      }, () => {
        this.categoryName = "undefined category";
      })
  }

  private createCollapsable() {
    this.collapse = true;
    this.preview = this.post.content.substr(0,300 ) + "...";
  }

  private whoCanVote() {
    this.canVote = this.loggedIn && !this.userService.isAdmin();
  }

  private whoCanEdit(){
    this.canEdit = this.loggedIn && (this.userService.getUser().userId == this.post.creatorId ||
      this.userService.isAdmin());
  }

  getImage(): void{
    this.httpClient.get(environment.endpointURL + "post/" + this.post.postId + "/imageByPost").subscribe(
      (res:any) =>{
        this.img = environment.endpointURL + "uploads/" + res.fileName;
      }, () => {
        this.img = "";
      })
  }
  getUpvotes(): void{
    this.httpClient.get(environment.endpointURL + "like/upvotes/" + this.post.postId ).subscribe((posts: any)=>{
      posts.forEach((id:any)=> {
        this.upvotes.push(parseInt(id.userId));
      });
      this.upvoted = this.upvotes.includes(this.userService.getUser().userId);
    },() => {this.upvotes = []});
  }

  getDownvotes(): void{
    this.httpClient.get(environment.endpointURL + "like/downvotes/" + this.post.postId ).subscribe((posts: any)=> {
      posts.forEach((id: any) => {
        this.downvotes.push(parseInt(id.userId));
      });
      this.downvoted = this.downvotes.includes(this.userService.getUser().userId);
    },() => {this.downvotes = []});

  }

  upvote() {
    this.post.votes++;
    this.httpClient.post(environment.endpointURL + "like", {
      postId: this.post.postId,
      userId: this.userService.getUser().userId,
      upvoted: true,
    }).subscribe();
     this.getUpvotes();
     this.upvoted = this.upvotes.includes(this.userService.getUser().userId);
     this.sendUpdate.emit(this.post);
  }

  downvote() {
    this.post.votes--;
    this.httpClient.post(environment.endpointURL + "like", {
      postId: this.post.postId,
      userId: this.userService.getUser().userId,
      downvoted: true,
    }).subscribe();
    this.getDownvotes();
    this.sendUpdate.emit(this.post)
  }

  revertUpvote() {
    this.httpClient.delete(environment.endpointURL + "like/upvotes/" + this.userService.getUser().userId + "/" + this.post.postId )
      .subscribe(()=>{
        this.upvoted = false;
      });
    this.post.votes--;
    this.sendUpdate.emit(this.post)
  }

  revertDownvote() {
    this.httpClient.delete(environment.endpointURL + "like/downvotes/" + this.userService.getUser().userId + "/" + this.post.postId )
      .subscribe(()=>{
        this.downvoted = false;
      });
    this.post.votes++;
    this.sendUpdate.emit(this.post);
  }

  editPost():void{
    this.editMode = true;
  }

  discardEdits() {
    this.editMode = false;
  }

  updatePost() {
    this.sendUpdate.emit(this.post);
    this.editMode = false;
  }

  deletePost(): void{
    if (this.userService.isAdmin()) {
      this.httpClient.delete(environment.endpointURL + "post/admin/" + this.post.postId  + "/" +this.userService.getUser().userId)
        .subscribe((()=>{
          this.getNewPosts.emit();
        }));
    }
    else {
    this.httpClient.delete(environment.endpointURL + "post/user/" + this.post.postId  + "/" +this.userService.getUser().userId)
      .subscribe((()=>{
        this.getNewPosts.emit();
      }));
    }
  }

  redirect() {
    if(!this.loggedIn){
      this.router.navigate(['user']);
    }
  }
}
