import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CurrentDayComponent } from './current-day/current-day.component';
import { FoodComponent } from './current-day/meal/food/food.component';
import { MealComponent } from './current-day/meal/meal.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CurrentDayComponent,
    FoodComponent,
    MealComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
