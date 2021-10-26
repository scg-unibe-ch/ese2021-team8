import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Post} from "../../models/post.model";
import {TodoList} from "../../models/todo-list.model";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {


  @Output()
  update = new EventEmitter<Post>();

  @Input()
  post: Post = new Post(0,'',0,'',0,new Date(),0);

  constructor() { }
  ngOnInit(): void {
  }

  //TODO: add constraints so user can only upvote once
   upvote() {
    this.post.votes++;
    this.update.emit(this.post)
  }

  downvote() {
    this.post.votes--;
    this.update.emit(this.post)
  }
}
