import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DayComponent } from './day/day.component';
import { EditIngredientComponent } from './day/meal/ingredient/edit-ingredient/edit-ingredient.component';
import { IngredientComponent } from './day/meal/ingredient/ingredient.component';
import { EditMealComponent } from './day/meal/edit-meal/edit-meal.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { StatisticPageComponent } from './statistic-page/statistic-page.component';

const appRoutes: Routes = [
  {path: '', component: DayComponent, canActivate: [AuthGuard]},
  {path: 'meal/edit/:id', component: EditMealComponent, canActivate: [AuthGuard]},
  {
    path: 'ingredient-list', component: IngredientComponent, canActivate: [AuthGuard],
    children: [
      {path: 'ingredient/editIngredient/:id', component: EditIngredientComponent, canActivate: [AuthGuard]},
      {path: 'ingredient/new', component: EditIngredientComponent, canActivate: [AuthGuard]}
    ]
  },
  {path: 'statistic', component: StatisticPageComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
