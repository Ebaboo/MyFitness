import { Injectable, OnInit } from '@angular/core';
import { MealModel } from './meal.model';
import { Subject } from 'rxjs';
import { MealTypeModel } from './meal-type.model';
import { MealPartModel } from './meal-part.model';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment'

@Injectable({
  providedIn: 'root'
})
export class MealService implements OnInit {
  meals: MealModel[] = [];

  // oneMeal = new MealModel(
  //   [new MealPartModel(
  //     new IngredientModel('5be97525a5992346a4962b68', 'Гречневая каша', 50),
  //     200
  //     ),
  //     new MealPartModel(
  //       new IngredientModel('5be9605607785b3228370444', 'Bread', 50),
  //       200
  //       ),
  //   ],
  //   MealTypeModel.Breakfast
  // );

  mealsChanged = new Subject<MealModel[]>();

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  getMealsForDay(greater: string, smaller: string) {
    const queryParams = `?gt=${greater}&lt=${smaller}`;
    this.http
      .get<{meals: MealModel[]}>('http://localhost:3000/api/meals' + queryParams)
      .subscribe(data => {
        this.meals = [...data.meals];
        this.mealsChanged.next([...this.meals]);
      });
  }

  addMeal(ingredientId: string, amount: number, mealType: number) {
    const meal = {
      ingredientId: ingredientId, mealType: mealType, amount: amount
    };
    this.http.post<{message: string}>('http://localhost:3000/api/meals', meal)
    .subscribe(response => {
      this.mealsChanged.next(this.meals);
    });
  }

  addMealPartToMeal(mealType: MealTypeModel, mealPart: MealPartModel, mealId) {
    let hasMealParts = false;
    this.meals.forEach(data => {
      if (data.mealType === mealType) {
        data.mealParts.push(mealPart);
        hasMealParts = true;
      }
    });
    this.meals.sort((a, b) =>
      a.mealType < b.mealType ? -1 : a.mealType > b.mealType ? 1 : 0
    );
    if (!hasMealParts) {
      this.meals.push(new MealModel([mealPart], mealType));
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

  // getMealByTypeAndIndex(mealType: MealTypeModel, index: number) {
  //   return this.meals.filter((editingMeal: MealModel) => {
  //     if (editingMeal.mealType === mealType) {
  //       return editingMeal;
  //     }
  //   });
  // }

  updateIngredientInMeal(
    mealType: MealTypeModel,
    mealIndex: number,
    grams: number
  ) {
    this.meals.map((meals: MealModel) => {
      if (meals.mealType === mealType) {
        meals.mealParts[mealIndex].grams = grams;
      }
    });
    this.mealsChanged.next(this.meals.slice());
  }
}
