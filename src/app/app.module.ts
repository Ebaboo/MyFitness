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
  MatSelectModule,
  MatExpansionModule,
  MatToolbarModule,
  MatChipsModule,
  MatNativeDateModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { DayComponent } from './day/day.component';
import { IngredientComponent } from './day/meal/ingredient/ingredient.component';
import { MealComponent } from './day/meal/meal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditIngredientComponent } from './day/meal/ingredient/edit-ingredient/edit-ingredient.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { IngredientListComponent } from './day/meal/ingredient/ingredient-list/ingredient-list.component';
import { SearchIngredientsPipe } from './pipes/search-ingredients.pipe';
import { EditMealComponent } from './day/meal/edit-meal/edit-meal.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { StatisticPageComponent } from './statistic-page/statistic-page.component';
import {MatDatepickerModule} from '@angular/material/datepicker';

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
    EditMealComponent,
    LoginComponent,
    SignupComponent,
    StatisticPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatToolbarModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
