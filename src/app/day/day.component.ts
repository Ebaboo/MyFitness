import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { DayService } from './day.service';
import { NgForm } from '@angular/forms';
import { MealService } from './meal/meal.service';
import { MealModel } from './meal/meal.model';
import { MealPartModel } from './meal/meal-part.model';
import { FoodModel } from './meal/food/food.model';
import { DayModel } from './day.model';
import { MealTypeModel } from './meal/meal-type.model';

@Component({
  selector: 'app-current-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {
  @ViewChild('f') foodForm: NgForm;
  day: DayModel;

  constructor(private dayService: DayService,
              private mealService: MealService) {
  }

  ngOnInit() {
    this.day = this.dayService.getDay();
  }

  onSubmit(data: NgForm) {
    const formData = data.value;
    switch (formData.whatMeal) {
      case 'breakfast':
        this.mealService.addMealPartToMeal(
          MealTypeModel.Breakfast,
          new MealPartModel(
              new FoodModel(formData.name, 200),
              formData.amount
        ));
        break;
      case 'lunch':
        this.mealService.addMealPartToMeal(
          MealTypeModel.Lunch,
          new MealPartModel(
            new FoodModel(formData.name, 200),
            formData.amount
          ));
        break;
      case 'dinner':
        this.mealService.addMealPartToMeal(
          MealTypeModel.Dinner,
          new MealPartModel(
            new FoodModel(formData.name, 200),
            formData.amount
          ));
        break;
    }

  }

}
