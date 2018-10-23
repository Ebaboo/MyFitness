import { Injectable, OnInit } from '@angular/core';
import { MealModel } from './meal.model';
import { Subject } from 'rxjs';
import { MealTypeModel } from './meal-type.model';
import { MealPartModel } from './meal-part.model';
import { FoodModel } from './food/food.model';

@Injectable({
  providedIn: 'root'
})

export class MealService implements OnInit {
  private meals: MealModel[] = [];
  mealsChanged = new Subject<MealModel[]>();

  constructor() {
  }

  ngOnInit() {

  }

  getMealsForDay(): MealModel[] {
    return this.meals.slice();
  }


  addMealPartToMeal(mealType: MealTypeModel, mealPart: MealPartModel) {
    let isAttached = false;
    this.meals.forEach(
      (data) => {
        if (data.mealType === mealType) {
          data.mealParts.push(mealPart);
          isAttached = true;
        }
      }
    );
    if (!isAttached) {
      this.meals.push(new MealModel(
        1, [mealPart],
        mealType));
    }
    this.mealsChanged.next(this.meals.slice());
  }

}
