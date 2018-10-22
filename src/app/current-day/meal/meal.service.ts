import { Injectable } from '@angular/core';
import { CurrentDayModel } from '../current-day.model';
import { MealModel } from './meal.model';

@Injectable({
  providedIn: 'root'
})

export class MealService {

  constructor() { }

  getMealsForDay(currentDay: CurrentDayModel): MealModel[]  {
    return null;
  }

  addMealToDay(day: CurrentDayModel, meal: MealModel) {

  }

}
