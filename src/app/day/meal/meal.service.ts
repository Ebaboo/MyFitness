import { Injectable } from '@angular/core';
import { DayModel } from '../day.model';
import { MealModel } from './meal.model';

@Injectable({
  providedIn: 'root'
})

export class MealService {

  constructor() { }

  getMealsForDay(currentDay: DayModel): MealModel[]  {
    return null;
  }

  addMealToDay(day: DayModel, meal: MealModel) {

  }

}
