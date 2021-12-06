import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  pages: number = 0;
  currentPage: number;

  private pagesSource = new Subject<Number>();
  private currentPageSource = new Subject<Number>();

  pages$ = this.pagesSource.asObservable();
  currentPage$ = this.currentPageSource.asObservable();

  getCurrentPage(){
    return this.currentPage;
  }

  getPages(){
    return this.pages;
  }

  increasePage(){
    this.currentPage++;
  }

  constructor(private httpClient: HttpClient) {
    this.currentPage = 1;
    this.httpClient.get(environment.endpointURL + "post/amount").subscribe(res => this.pages = Math.ceil(Number(res)/10));

  }
}
