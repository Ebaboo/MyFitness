import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DayComponent } from './day/day.component';
import { IngredientComponent } from './day/meal/ingredient/ingredient.component';
import { MealComponent } from './day/meal/meal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditIngredientComponent } from './day/meal/ingredient/edit-ingredient/edit-ingredient.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { IngredientListComponent } from './day/meal/ingredient/ingredient-list/ingredient-list.component';

@NgModule({
  declarations: [
    AppComponent,
    DayComponent,
    IngredientComponent,
    MealComponent,
    EditIngredientComponent,
    HeaderComponent,
    IngredientListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
