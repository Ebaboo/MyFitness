import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrentDayService } from './current-day.service';
import { CurrentDayModel } from './current-day.model';
import { NgForm } from '@angular/forms';
import { MealService } from './meal/meal.service';
import { MealModel } from './meal/meal.model';
import { MealPartModel } from './meal/meal-part.model';
import { FoodModel } from './meal/food/food.model';

@Component({
  selector: 'app-current-day',
  templateUrl: './current-day.component.html',
  styleUrls: ['./current-day.component.css']
})
export class CurrentDayComponent implements OnInit {
  @ViewChild('f') foodForm: NgForm;
  currentDay: CurrentDayModel;

  constructor(private currentDayService: CurrentDayService,
              private mealService: MealService) {
  }

  ngOnInit() {
    this.currentDay = this.currentDayService.getCurrentDay();
  }

  onSubmit(data: NgForm) {
    const formData = data.value;
    switch (formData.whatMeal) {
      case 'breakfast':
        this.mealService.addMealToDay(
          this.currentDay,
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
          this.currentDay,
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
          this.currentDay,
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
