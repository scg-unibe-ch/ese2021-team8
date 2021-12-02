import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Post} from "../../models/post.model";
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {PostCategory} from "../../models/postCategory.model";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

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
  removeImage: boolean = false;
  newPicture: boolean = false;
  addPicture: boolean = false;
  selectedFile = null;

  preview: string = "";
  imgPreview: string = "";
  errorMsg: string = "";

  //create a collapsed post if a post has more than 305 characters
  collapse: boolean = false;
  uncollapse: boolean = false;

  categoryName: string = "";
  img: any;
  creator: string = "";

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    public router: Router,
    private toastr: ToastrService
  ) {
    userService.loggedIn$.subscribe((res) => {this.loggedIn = res; this.whoCanVote(); this.whoCanEdit();});
    this.loggedIn = userService.getLoggedIn();
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
    this.getNewPosts.emit();
    this.removeImage = false;
    this.newPicture = false;
    this.editMode = false;
  }

  updatePost() {
    if(!this.validate()){
      this.post.title == '' ? this.errorMsg = "please fill all required fields" : this.errorMsg = "post needs text content or image"
      return;
    }
    if(this.removeImage) {
      console.log("remove image");
      this.httpClient.delete(environment.endpointURL + "post/image/" + this.post.postId).subscribe(()=> this.sendUpdate.emit(this.post));
    }
    if(this.newPicture && this.selectedFile != null){
      console.log("update image");
      this.httpClient.delete(environment.endpointURL + "post/image/" + this.post.postId).subscribe(() => {
        const formData = new FormData();
        // @ts-ignore
        formData.append("image", this.selectedFile);
        //add the File to the Post
        console.log(formData);
        this.httpClient.post(environment.endpointURL + "post/" + this.post.postId + "/image", formData)
          .subscribe((res: any) =>  {
            this.img = environment.endpointURL + "uploads/" + res.fileName;
            this.sendUpdate.emit(this.post);
          });
      });
    }
    if(this.addPicture && this.selectedFile!=null) {
      console.log("add image");
      this.post.itemImage = true;
      const formData = new FormData();
      // @ts-ignore
      formData.append("image", this.selectedFile);
      //add the File to the Post
      console.log(formData);
      this.httpClient.post(environment.endpointURL + "post/" + this.post.postId + "/image", formData)
        .subscribe((res: any) => {
          this.img = environment.endpointURL + "uploads/" + res.fileName;
          this.sendUpdate.emit(this.post);
        });
    }
    else{
    this.sendUpdate.emit(this.post);}
    this.editMode = false;
  }

  deletePost(): void{
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
  }

  getCreator(){
    this.httpClient.get(environment.endpointURL + "user/" + this.post.creatorId).subscribe((creator: any) => {
      this.creator = creator.userName;
    })
  }

  redirect() {
    if(!this.loggedIn){
      this.router.navigate(['user']);
    }
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
}
