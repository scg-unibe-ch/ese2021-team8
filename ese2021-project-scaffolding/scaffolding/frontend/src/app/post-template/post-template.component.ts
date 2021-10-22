import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-template',
  templateUrl: './post-template.component.html',
  styleUrls: ['./post-template.component.css']
})
export class PostTemplateComponent implements OnInit {
  displayPostTemplate: boolean | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  clickCreatePost(): void {
    this.displayPostTemplate = true;
  }

  closePostTemplate() {
    this.displayPostTemplate = false;
  }
}
