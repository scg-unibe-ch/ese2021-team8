import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Post} from "../../models/post.model";
import {TodoList} from "../../models/todo-list.model";
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  voted: boolean = false;
  whoLiked: string[] = [];
  currentUser: string = "";
  @Output()
  update = new EventEmitter<Post>();

  @Input()
  post: Post = new Post(0,'',0,'',0,new Date(),0, '');
  categoryName: string = this.getCategoryName();

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {
    this.currentUser = userService.getUser().username;
    this.voted = this.whoLiked.includes(this.currentUser);
  }
  ngOnInit(): void {
    this.categoryName=this.getCategoryName();
  }

  //TODO: add constraints so user can only upvote once
   upvote() {
    this.post.votes++;
    this.whoLiked.push(this.userService.getUser().username);
     this.voted = this.whoLiked.includes(this.currentUser);
     this.update.emit(this.post);
  }

  downvote() {
    console.log(this.currentUser);
    console.log(this.whoLiked);
    this.post.votes--;
    this.whoLiked.push(this.userService.getUser().username);
    this.voted = this.whoLiked.includes(this.currentUser);
    this.update.emit(this.post)
  }

  getCategoryName(): string{
     this.httpClient.get(environment.endpointURL + "category/get/" + this.post.categoryId).subscribe(
      ((category:any) =>{
        category.catgoryName;
      })
    );
    return "unknown category";
  }
}
