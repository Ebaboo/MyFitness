import { Component, OnInit } from '@angular/core';
import { MealModel } from './meal.model';
import { CurrentDayService } from '../current-day.service';
import { MealService } from './meal.service';
import { CurrentDayModel } from '../current-day.model';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit {
  meals: MealModel[];

  constructor(private currentDayService: CurrentDayService,
              private mealService: MealService) { }

  ngOnInit() {
    this.meals = this.mealService.getMealsForDay(this.currentDayService.getCurrentDay());
  }

}
