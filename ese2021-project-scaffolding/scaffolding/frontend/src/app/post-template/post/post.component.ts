import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Post} from "../../models/post.model";
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  edit: boolean = false;
  upvoted: boolean | undefined;
  downvoted: boolean = false;
  upvotes: number[] = [];
  downvotes: number[] = [];
  currentUser: string = "";
  canEdit: boolean = false;
  test: number[] = [];

  @Output()
  updateVotes = new EventEmitter<Post>();

  @Output()
  updatePosts = new EventEmitter<Post>();

  @Input()
  post: Post = new Post(0,'',0,'',0,new Date(),0, '');

  categoryName: string = ""

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) { }
  ngOnInit(): void {
    this.getCategoryName();
    this.canEdit = this.userService.getUser().userId == this.post.creatorId
    this.getUpvotes();
    this.getDownvotes();
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
     this.updateVotes.emit(this.post);
  }

  downvote() {
    this.post.votes--;
    this.httpClient.post(environment.endpointURL + "like", {
      postId: this.post.postId,
      userId: this.userService.getUser().userId,
      downvoted: true,
    }).subscribe();
    this.getDownvotes();
    this.updateVotes.emit(this.post)
  }

  editPost():void{
    this.edit = true;
  }

  getCategoryName(): void{
    this.httpClient.get(environment.endpointURL + "category/" + this.post.categoryId).subscribe(
      (res:any) =>{
        this.categoryName = res.categoryName;
      }, () => {
        this.categoryName = "undefined category";
      })
  }

  deletePost(): void{
    this.httpClient.delete(environment.endpointURL + "post/" + this.post.postId ).subscribe(((res:any)=>{}),
      (error => "nope" ));
    this.updatePosts.emit();
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
    this.updateVotes.emit(this.post)
  }

  revertDownvote() {
    this.httpClient.delete(environment.endpointURL + "like/downvotes/" + this.userService.getUser().userId + "/" + this.post.postId )
      .subscribe(()=>{
        this.downvoted = false;
      });
    this.post.votes++;
    this.updateVotes.emit(this.post)
  }
}
