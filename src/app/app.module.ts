import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { DayComponent } from './day/day.component';
import { IngredientComponent } from './day/meal/ingredient/ingredient.component';
import { MealComponent } from './day/meal/meal.component';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { EditIngredientComponent } from './day/meal/ingredient/edit-ingredient/edit-ingredient.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { IngredientListComponent } from './day/meal/ingredient/ingredient-list/ingredient-list.component';
import { SearchIngredientsPipe } from './pipes/search-ingredients.pipe';
import { EditMealComponent } from './day/meal/edit-meal/edit-meal.component';

@NgModule({
  declarations: [
    AppComponent,
    DayComponent,
    IngredientComponent,
    MealComponent,
    EditIngredientComponent,
    HeaderComponent,
    IngredientListComponent,
    SearchIngredientsPipe,
    EditMealComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
