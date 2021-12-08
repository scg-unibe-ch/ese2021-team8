import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Post} from "../../models/post.model";
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {PostCategory} from "../../models/postCategory.model";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {PostService} from "../../services/post.service";
import {ConfirmationComponent} from "../../confirmation/confirmation.component";


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post!: Post;
  @Input() profileView!: boolean;

  @Output() getNewPosts = new EventEmitter<Post>();
  @Output() selectCategory = new EventEmitter<number>();

  loggedIn: boolean | undefined;
  categories: PostCategory[];

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

  //indicate if the image of a post has been edited
  removeImage: boolean = false;
  newPicture: boolean = false;
  addPicture: boolean = false;
  selectedFile = null;

  imgPreview: string = "";
  errorMsg: string = "";

  //create a collapsed post if a post has more than 305 characters
  collapse: boolean = false;
  uncollapse: boolean = false;
  preview: string = "";

  categoryName: string = "";
  img: any;
  creator: string = "";


  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    public router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public postService: PostService
  ) {
    userService.loggedIn$.subscribe((res) => {this.loggedIn = res; this.whoCanVote(); this.whoCanEdit();});
    this.loggedIn = userService.getLoggedIn();

    postService.categories$.subscribe(res => this.categories = res);
    this.categories = postService.getCategories();
  }

  ngOnInit(): void {
    this.getCategoryName();
    this.whoCanVote();
    this.getCreator();
    if(this.post.itemImage){
      this.getImage();
    }
    if(this.post.content.length > 305){
      this.createCollapsable();
    }
    if(this.loggedIn){
      this.getUpvotes();
      this.getDownvotes();
      this.whoCanEdit();
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
        this.imgPreview = this.img;
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
     this.postService.updatePost(this.post);
  }

  downvote() {
    this.post.votes--;
    this.httpClient.post(environment.endpointURL + "like", {
      postId: this.post.postId,
      userId: this.userService.getUser().userId,
      downvoted: true,
    }).subscribe();
    this.getDownvotes();
    this.postService.updatePost(this.post)
  }

  revertUpvote() {
    this.httpClient.delete(environment.endpointURL + "like/upvotes/" + this.userService.getUser().userId + "/" + this.post.postId )
      .subscribe(()=>{
        this.upvoted = false;
      });
    this.post.votes--;
    this.postService.updatePost(this.post)
  }

  revertDownvote() {
    this.httpClient.delete(environment.endpointURL + "like/downvotes/" + this.userService.getUser().userId + "/" + this.post.postId )
      .subscribe(()=>{
        this.downvoted = false;
      });
    this.post.votes++;
    this.postService.updatePost(this.post);
  }

  discardEdits() {
    this.getNewPosts.emit();
    this.removeImage = false;
    this.newPicture = false;
    this.addPicture = false;
    this.editMode = false;
  }

  updatePost() {
    if(!this.validate()){
      this.post.title == '' ? this.errorMsg = "please fill all required fields" : this.errorMsg = "post needs text content or image"
      return;
    }
    if(this.removeImage) {
      this.httpClient.delete(environment.endpointURL + "post/image/" + this.post.postId).subscribe(()=> this.postService.updatePost(this.post));
    }
    if(this.newPicture && this.selectedFile != null){
      this.httpClient.delete(environment.endpointURL + "post/image/" + this.post.postId).subscribe(() => {
        const formData = new FormData();
        // @ts-ignore
        formData.append("image", this.selectedFile);
        //add the File to the Post
        this.httpClient.post(environment.endpointURL + "post/" + this.post.postId + "/image", formData)
          .subscribe((res: any) =>  {
            this.img = environment.endpointURL + "uploads/" + res.fileName;
            this.postService.updatePost(this.post);
          });
      });
    }
    if(this.addPicture && this.selectedFile!=null) {
      this.post.itemImage = true;
      const formData = new FormData();
      // @ts-ignore
      formData.append("image", this.selectedFile);
      //add the File to the Post
      this.httpClient.post(environment.endpointURL + "post/" + this.post.postId + "/image", formData)
        .subscribe((res: any) => {
          this.img = environment.endpointURL + "uploads/" + res.fileName;
          this.postService.updatePost(this.post);
        });
    }
    else{
      this.postService.updatePost(this.post);
    }
    this.editMode = false;
    this.toastr.show("Post was updated");
  }

  deletePost(): void{
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: {question: 'delete this post'}
    });
    dialogRef.afterClosed().subscribe((doit) => {
      if(doit){
        if (this.userService.isAdmin()) {
          this.httpClient.delete(environment.endpointURL + "post/admin/" + this.post.postId  + "/" +this.post.creatorId)
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
        this.toastr.show("Post was deleted");
      }
    });
  }

  getCreator(){
    this.httpClient.get(environment.endpointURL + "user/" + this.post.creatorId).subscribe((creator: any) => {
      this.creator = creator.userName;
    })
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imgPreview = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  validate(): boolean{
    return (this.post.title != '' &&( this.post.content!='' || (this.post.itemImage || this.selectedFile != null)));
  }

  selectSortCategory() {
    this.selectCategory.emit(this.post.categoryId);
  }
}
