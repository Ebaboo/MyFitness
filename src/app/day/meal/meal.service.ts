import { Injectable, OnInit } from '@angular/core';
import { MealModel } from './meal.model';
import { Subject } from 'rxjs';
import { MealTypeModel } from './meal-type.model';
import { MealPartModel } from './meal-part.model';
import { IngredientModel } from './ingredient/ingredient.model';

@Injectable({
  providedIn: 'root'
})

export class MealService implements OnInit {
  meals: MealModel[] = [];
  mealsChanged = new Subject<MealModel[]>();

  constructor() {
  }

  ngOnInit() {

  }

  getMealsForDay(): MealModel[] {
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
    if (!hasMealParts) {
      this.meals.push(new MealModel(
        1, [mealPart],
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

}
