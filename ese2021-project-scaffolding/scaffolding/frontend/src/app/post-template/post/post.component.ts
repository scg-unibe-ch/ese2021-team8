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
  voted: boolean = false;
  whoLiked: number[] = [];
  currentUser: string = "";
  canEdit: boolean = false;

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
  ) {}
  ngOnInit(): void {
    this.getCategoryName();
    this.canEdit = this.userService.getUser().userId == this.post.creatorId
    this.httpClient.get(environment.endpointURL + "like/" + this.post.postId +"/" + this.userService.getUser().userId).subscribe((posts: any)=>
    {   posts.forEach((id:any)=> {
        this.whoLiked.push(id.userId);
      });
      this.voted = this.whoLiked.includes(this.userService.getUser().userId)
    });
  }

   upvote() {
     console.log(this.whoLiked.includes(2));
    this.post.votes++;
    this.httpClient.post(environment.endpointURL + "like", {
      postId: this.post.postId,
      userId: this.userService.getUser().userId
    }).subscribe()
     this.voted = true;
    this.updateVotes.emit(this.post);
  }

  downvote() {
    this.post.votes--;
    this.httpClient.post(environment.endpointURL + "like", {
      postId: this.post.postId,
      creatorId: this.userService.getUser().userId
    }).subscribe()
    this.voted = true;
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
    this.httpClient.delete(environment.endpointURL + "post/" + this.post.postId + "/" + this.userService.getUser().userId).subscribe(((res:any)=>{}),
      (error => "nope" ));
    this.updatePosts.emit();
  }
}
