import { Component, OnInit, ViewChild } from '@angular/core';
import { DayService } from './day.service';
import { NgForm } from '@angular/forms';
import { MealService } from './meal/meal.service';
import { MealModel } from './meal/meal.model';
import { MealPartModel } from './meal/meal-part.model';
import { FoodModel } from './meal/food/food.model';
import { DayModel } from './day.model';

@Component({
  selector: 'app-current-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {
  @ViewChild('f') foodForm: NgForm;
  day: DayModel;

  constructor(private currentDayService: DayService,
              private mealService: MealService) {
  }

  ngOnInit() {
    this.day = this.currentDayService.getCurrentDay();
  }

  onSubmit(data: NgForm) {
    const formData = data.value;
    switch (formData.whatMeal) {
      case 'breakfast':
        this.mealService.addMealToDay(
          this.day,
          new MealModel(
            Math.random(),
            [new MealPartModel(
              new FoodModel(formData.name, 200),
              formData.amount
            )],
            MealType.Breakfast
          )
        );
        break;
      case 'lunch':
        this.mealService.addMealToDay(
          this.day,
          new MealModel(
            Math.random(),
            [new MealPartModel(
              new FoodModel(formData.name, 200),
              formData.amount
            )],
            MealType.Lunch
          )
        );
        break;
      case 'dinner':
        this.mealService.addMealToDay(
          this.day,
          new MealModel(
            Math.random(),
            [new MealPartModel(
              new FoodModel(formData.name, 200),
              formData.amount
            )],
            MealType.Dinner
          )
        );
        break;
    }

  }

}
