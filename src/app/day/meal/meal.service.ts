import { Injectable, OnInit } from '@angular/core';
import { MealModel } from './meal.model';
import { Subject } from 'rxjs';
import { MealTypeModel } from './meal-type.model';
import { MealPartModel } from './meal-part.model';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class MealService implements OnInit {
  meals: MealModel[] = [];
  mealsChanged = new Subject<MealModel[]>();

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  getMealsBetweenDates(greater: string, smaller: string) {
    const queryParams = `?gt=${greater}&lt=${smaller}`;
    return this.http.get<{ meals: MealModel[] }>(
      BACKEND_URL + '/meals' + queryParams
    );
  }

  getMealsForDay(greater: string, smaller: string) {
    const queryParams = `?gt=${greater}&lt=${smaller}`;
    this.http
      .get<{ meals: MealModel[] }>(
        BACKEND_URL + '/meals' + queryParams
      )
      .subscribe(data => {
        this.meals = [...data.meals];
        this.mealsChanged.next([...this.meals]);
      });
  }

  addMeal(ingredientId: string, amount: number, mealType: number, day: string) {
    const meal = {
      ingredientId: ingredientId,
      mealType: mealType,
      amount: amount,
      date: day
    };
    this.http
      .post<{ message: string; meal: MealModel }>(
        BACKEND_URL + '/meals',
        meal
      )
      .subscribe(responseMeal => {
        this.meals.push(responseMeal.meal);
        this.mealsChanged.next([...this.meals]);
      });
  }

  addMealPartToMeal(ingredientId: string, amount: number, mealId: string) {
    const mealPartData = {
      ingredientId: ingredientId,
      amount: amount
    };
    this.http
      .patch<{ message: string; meal: MealModel }>(
        BACKEND_URL + '/meals' + '/' + mealId,
        mealPartData
      )
      .subscribe(response => {
        this.meals.map(meal => {
          if (meal.id === response.meal.id) {
            meal.mealParts = response.meal.mealParts;
            return;
          }
        });
        // this.meals.sort((a, b) =>
        //   a.mealType < b.mealType ? -1 : a.mealType > b.mealType ? 1 : 0
        // );
        this.mealsChanged.next(this.meals);
      });
  }

  DeleteIngredient(mealId: string, mealPartId: string) {
    const queryParams = `?mealId=${mealId}&mealPartId=${mealPartId}`;
    this.http
      .delete<{ message: string; meals: MealModel }>(
        BACKEND_URL + '/meals' + queryParams
      )
      .subscribe(responseData => {
        this.meals.forEach(meal => {
          if (meal.mealType === responseData.meals.mealType) {
            meal.mealParts = responseData.meals.mealParts;
            return;
          }
        });
        this.mealsChanged.next(this.meals.slice());
      });
  }

  updateIngredientInMeal(mealId: string, mealPartId: string, amount: string) {
    const mealData = {
      mealId: mealId,
      mealPartId: mealPartId,
      amount: amount
    };
    this.http
      .patch<{ message: string; meal: MealModel }>(
        BACKEND_URL + '/meals-update',
        mealData
      )
      .subscribe(response => {
        this.meals.map(meal => {
          if (meal.id === response.meal.id) {
            return (meal.mealParts = response.meal.mealParts);
          }
        });
        this.mealsChanged.next(this.meals);
      });
  }
}


