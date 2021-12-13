import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs";
import {PostCategory} from "../models/postCategory.model";
import {Post} from "../models/post.model";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private pages: number = 0;
  private currentPage: number;
  private categories: PostCategory[] = [];

  private pagesSource = new Subject<Number>();
  private currentPageSource = new Subject<Number>();
  private categoriesSource = new Subject<PostCategory[]>();

  pages$ = this.pagesSource.asObservable();
  currentPage$ = this.currentPageSource.asObservable();
  categories$ = this.categoriesSource.asObservable();

  getCurrentPage(){
    return this.currentPage;
  }

  getPages(){
    return this.pages;
  }

  increasePage(){
    this.currentPage++;
  }

  getCategories(): PostCategory[]{
    return this.categories;
  }

  updatePost(post: Post): void {
    this.httpClient.put(environment.endpointURL + "post/" + post.postId, {
      votes: post.votes,
      title: post.title,
      content: post.content,
      categoryId: post.categoryId,
      itemImage: post.itemImage
    }).subscribe();
  }

  constructor(private httpClient: HttpClient) {
    this.currentPage = 1;
    this.httpClient.get(environment.endpointURL + "post/amount").subscribe(res => this.pages = Math.ceil(Number(res)/10));
    this.httpClient.get(environment.endpointURL + "post/category").subscribe((categories:any) => {
      categories.forEach((category: any) => {
        this.categories.push(category);
      });
    });
  }
}
