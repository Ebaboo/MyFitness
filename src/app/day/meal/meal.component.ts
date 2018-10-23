import { Component, OnInit } from '@angular/core';
import { MealModel } from './meal.model';
import { DayService } from '../day.service';
import { MealService } from './meal.service';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit {
  meals: MealModel[];


  constructor(private dayService: DayService,
              private mealService: MealService) { }

  ngOnInit() {
    this.mealService.mealsChanged.subscribe(
      (meals: MealModel[]) => {
        this.meals = meals;
        this.meals.sort(
          (a, b) => a.mealType < b.mealType ? -1 : a.mealType > b.mealType ? 1 : 0
        );
        console.log(this.meals);
      }
    );
    this.meals = this.mealService.getMealsForDay();
    this.meals.sort(
      (a, b) => a.mealType < b.mealType ? -1 : a.mealType > b.mealType ? 1 : 0
    );
  }

}
