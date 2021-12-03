import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {PostCategory} from "../models/postCategory.model";
import {Post} from "../models/post.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: PostCategory[] = [];

  private categoriesSource = new Subject<PostCategory[]>();

  categories$ = this.categoriesSource.asObservable();

  getCategories(): PostCategory[]{
    return this.categories;
  }

  addCategory(category: PostCategory){
    this.categories.push(category);
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
    this.httpClient.get(environment.endpointURL + "post/category").subscribe((categories:any) => {
      categories.forEach((category: any) => {
        this.categories.push(category);
      });
    });
  }
}
