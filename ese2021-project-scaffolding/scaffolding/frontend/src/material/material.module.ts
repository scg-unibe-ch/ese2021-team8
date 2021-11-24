import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSortModule} from "@angular/material/sort";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule,
    MatTooltipModule,
    MatGridListModule,
    MatDialogModule,
    MatSidenavModule,
    MatAutocompleteModule,
    MatSortModule
  ],
  exports: [
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule,
    MatTooltipModule,
    MatGridListModule,
    MatDialogModule,
    MatSidenavModule,
    MatAutocompleteModule,
    MatSortModule
  ]
})
export class MaterialModule { }
