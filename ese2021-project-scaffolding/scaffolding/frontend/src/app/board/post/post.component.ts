import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Post} from "../../models/post.model";
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {PostCategory} from "../../models/postCategory.model";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input()
  categories: PostCategory[] =[];

  info: string = ""
  editMode: boolean = false;
  upvoted: boolean | undefined;
  downvoted: boolean = false;
  upvotes: number[] = [];
  downvotes: number[] = [];
  currentUser: string = "";
  canEdit: undefined | boolean;
  canVote: boolean | undefined;
  test: number[] = [];
  preview: string = "";
  collapse: boolean = false;
  uncollapse: boolean = false;

  @Output()
  sendUpdate = new EventEmitter<Post>();

  @Output()
  getNewPosts = new EventEmitter<Post>();

  @Input()
  post: Post = new Post(0,'',0,'',0,new Date(),0, false);

  categoryName: string = ""
  imagePath: string = ""
  img: any;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) { }
  ngOnInit(): void {
    this.getCategoryName();
    this.whoCanEdit();
    this.whoCanVote();
    this.getUpvotes();
    this.getDownvotes();
    if(this.post.itemImage){
      this.getImage();
    }
    if(this.post.content.length > 305){
      this.createCollapsable();
    }
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

  editPost():void{
    this.editMode = true;
  }

  getCategoryName(): void{
    this.httpClient.get(environment.endpointURL + "post/category/" + this.post.categoryId).subscribe(
      (res:any) =>{
        this.categoryName = res.postCategoryName;
      }, () => {
        this.categoryName = "undefined category";
      })
  }

  deletePost(): void{
    if (this.userService.isAdmin()) {
      this.httpClient.delete(environment.endpointURL + "post/admin/" + this.post.postId  + "/" +this.userService.getUser().userId)
        .subscribe(((res:any)=>{
          this.getNewPosts.emit();
        }));
    }
    else {
    this.httpClient.delete(environment.endpointURL + "post/user/" + this.post.postId  + "/" +this.userService.getUser().userId)
      .subscribe(((res:any)=>{
        this.getNewPosts.emit();
      }));
    }

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

  updatePost() {
    this.sendUpdate.emit(this.post);
    this.editMode = false;
  }

  discardEdits() {
    this.editMode = false;
  }

  private createCollapsable() {
    this.collapse = true;
    this.preview = this.post.content.substr(0,300 ) + "...";
  }

  private whoCanVote() {
    this.canVote = this.userService.getLoggedIn() && !this.userService.isAdmin();
  }

  private whoCanEdit(){
    this.canEdit = this.userService.getLoggedIn() && (this.userService.getUser().userId == this.post.creatorId ||
      this.userService.isAdmin());
  }

  getImage(): void{
    this.httpClient.get(environment.endpointURL + "post/" + this.post.postId + "/imageByPost").subscribe(
      (res:any) =>{
        this.imagePath = environment.endpointURL + "uploads/" + res.fileName;
        this.img = this.imagePath
      }, () => {
        this.imagePath = "";
      })
  }
}
