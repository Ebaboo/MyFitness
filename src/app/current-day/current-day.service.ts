import { Injectable, OnInit } from '@angular/core';
import { CurrentDayModel } from './current-day.model';
import { MealModel } from './meal/meal.model';

@Injectable({
  providedIn: 'root'
})
export class CurrentDayService implements OnInit {
  CurrentDay: CurrentDayModel = new CurrentDayModel(new Date());


  ngOnInit() {

  }

  getCurrentDay() {
    return this.CurrentDay;
  }


  constructor() {
  }
}
