import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Post} from "../../models/post.model";
import {TodoList} from "../../models/todo-list.model";
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Category} from "../../models/category.model";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  edit: boolean = false;
  voted: boolean = false;
  whoLiked: string[] = [];
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
  ) {
    this.currentUser = userService.getUser().username;
    this.voted = this.whoLiked.includes(this.currentUser);
  }
  ngOnInit(): void {
    this.getCategoryName();
    this.canEdit = this.userService.getUser().userId == this.post.creatorId
  }

  //TODO: add constraints so user can only upvote once
   upvote() {
    this.post.votes++;
    this.whoLiked.push(this.userService.getUser().username);
    this.voted = this.whoLiked.includes(this.currentUser);
    this.updateVotes.emit(this.post);
  }

  downvote() {
    console.log(this.currentUser);
    console.log(this.whoLiked);
    this.post.votes--;
    this.whoLiked.push(this.userService.getUser().username);
    this.voted = this.whoLiked.includes(this.currentUser);
    this.updateVotes.emit(this.post)
  }

  editPost():void{
    this.edit = true;
  }

  getCategoryName(): void{
    this.httpClient.get(environment.endpointURL + "category/" + this.post.categoryId).subscribe(
      (res:any) =>{
        this.categoryName = res.categoryName;
      }, (error) => {
        this.categoryName = "undefined category";
      })
  }

  deletePost(): void{
    this.httpClient.delete(environment.endpointURL + "post/" + this.post.postId + "/" + this.userService.getUser().userId).subscribe((res:any)=>{},
      (error => "nope" ));
    this.updatePosts.emit();
  }
}
