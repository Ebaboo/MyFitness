import { Injectable, OnInit } from '@angular/core';
import { MealModel } from './meal.model';
import { Subject } from 'rxjs';
import { MealTypeModel } from './meal-type.model';
import { MealPartModel } from './meal-part.model';
import { IngredientModel } from './ingredient/ingredient.model';
import { UUID } from 'angular2-uuid';
import { splitDepsDsl } from '@angular/core/src/view/util';

@Injectable({
  providedIn: 'root'
})

export class MealService implements OnInit {
  meals: MealModel[] = [
    new MealModel(
      [new MealPartModel(new IngredientModel(
        UUID.UUID(), 'Ribs', 200
        ), 50
      )],
      MealTypeModel.Breakfast)
  ];
  mealsChanged = new Subject<MealModel[]>();

  constructor() {
  }

  ngOnInit() {

  }

  getMealsForDay(): MealModel[] {
    console.log(this.meals);
    return this.meals.slice();
  }


  addMealPartToMeal(mealType: MealTypeModel, mealPart: MealPartModel) {
    let hasMealParts = false;
    this.meals.forEach(
      (data) => {
        if (data.mealType === mealType) {
          data.mealParts.push(mealPart);
          hasMealParts = true;
        }
      }
    );
    this.meals.sort(
      (a, b) => a.mealType < b.mealType ? -1 : a.mealType > b.mealType ? 1 : 0
    );
    if (!hasMealParts) {
      this.meals.push(new MealModel(
        [mealPart],
        mealType));
    }
    this.mealsChanged.next(this.meals.slice());
  }

  DeleteIngredient(mealIndex: number, mealPartIndex: number) {
    this.meals[mealIndex].mealParts.splice(mealPartIndex, 1);
    if (this.meals[mealIndex].mealParts.length === 0) {
      this.meals.splice(mealIndex, 1);
    }
    this.mealsChanged.next(this.meals.slice());
  }

  getMealByTypeAndIndex(mealType: MealTypeModel, index: number) {
    return this.meals.filter(
      (editingMeal: MealModel) => {
       if (editingMeal.mealType === mealType) {
         return editingMeal;
       }
      }
    );
  }

  updateIngredientInMeal(mealType: MealTypeModel, mealIndex: number, grams: number) {
    this.meals.map(
      (meals: MealModel) => {
        if (meals.mealType === mealType) {
          meals.mealParts[mealIndex].grams = grams;
        }
      }
    );
    this.mealsChanged.next(this.meals.slice());
  }
}
