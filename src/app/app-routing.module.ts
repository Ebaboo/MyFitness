import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DayComponent } from './day/day.component';
import { EditIngredientComponent } from './day/meal/ingredient/edit-ingredient/edit-ingredient.component';
import { IngredientComponent } from './day/meal/ingredient/ingredient.component';

const appRoutes: Routes = [
  {path: '', component: DayComponent},
  {path: 'ingredient-list', component: IngredientComponent,
  children: [
    {path: 'ingredient/editIngredient/:id', component: EditIngredientComponent},
    {path: 'ingredient/new', component: EditIngredientComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
