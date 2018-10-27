import { Component, OnInit } from '@angular/core';
import { MealModel } from './meal.model';
import { DayService } from '../day.service';
import { MealService } from './meal.service';
import { Moment } from 'moment';
import * as moment from 'moment';
@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit {
  meals: MealModel[] = [];


  constructor(private dayService: DayService,
              private mealService: MealService) { }

  ngOnInit() {
    this.mealService.mealsChanged.subscribe(
      (meals: MealModel[]) => {
        this.meals = meals;
        this.meals.sort(
          (a, b) => a.mealType < b.mealType ? -1 : a.mealType > b.mealType ? 1 : 0
        );
      }
    );
    this.meals = this.mealService.getMealsForDay();
    this.meals.sort(
      (a, b) => a.mealType < b.mealType ? -1 : a.mealType > b.mealType ? 1 : 0
    );
  }

  onDeleteIngredient(mealIndex, mealPartIndex) {
    this.mealService.DeleteIngredient(mealIndex, mealPartIndex);
  }


}
