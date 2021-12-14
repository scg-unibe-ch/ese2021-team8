import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmationComponent>,
              @Inject (MAT_DIALOG_DATA) public data: { question: string }) { }

  ngOnInit(): void {
  }

  yes(){
    this.dialogRef.close(true);
  }

  no(){
    this.dialogRef.close(false);
  }
}
