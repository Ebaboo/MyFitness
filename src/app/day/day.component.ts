import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { DayService } from './day.service';
import { NgForm } from '@angular/forms';
import { MealService } from './meal/meal.service';
import { MealModel } from './meal/meal.model';
import { MealPartModel } from './meal/meal-part.model';
import { IngredientModel } from './meal/ingredient/ingredient.model';
import { DayModel } from './day.model';
import { MealTypeModel } from './meal/meal-type.model';
import { IngredientService } from './meal/ingredient/ingredient.service';

@Component({
  selector: 'app-current-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {
  @ViewChild('f') foodForm: NgForm;
  day: DayModel;
  ingredients: IngredientModel[] = [];

  constructor(private dayService: DayService,
              private mealService: MealService,
              private ingredientsService: IngredientService) {
  }

  ngOnInit() {
    this.day = this.dayService.getDay();
    this.ingredients = this.ingredientsService.getIngredients();
  }

  onSubmit() {
    const formData = this.foodForm.value;
    console.log(formData);
    const ingredient = this.ingredientsService.getIngredientById(formData.ingredientId);
    switch (formData.whatMeal) {
      case 'breakfast':
        this.mealService.addMealPartToMeal(
          MealTypeModel.Breakfast,
          new MealPartModel(
            ingredient,
            formData.amount
          ));
        break;
      case 'lunch':
        this.mealService.addMealPartToMeal(
          MealTypeModel.Lunch,
          new MealPartModel(
            ingredient,
            formData.amount
          ));
        break;
      case 'dinner':
        this.mealService.addMealPartToMeal(
          MealTypeModel.Dinner,
          new MealPartModel(
            ingredient,
            formData.amount
          ));
        break;
    }

  }

}
