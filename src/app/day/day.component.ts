import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DayService } from './day.service';
import { NgForm } from '@angular/forms';
import { MealService } from './meal/meal.service';
import { MealPartModel } from './meal/meal-part.model';
import { IngredientModel } from './meal/ingredient/ingredient.model';
import { DayModel } from './day.model';
import { MealTypeModel } from './meal/meal-type.model';
import { IngredientService } from './meal/ingredient/ingredient.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-current-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit, OnDestroy {
  @ViewChild('f') foodForm: NgForm;
  day: DayModel;
  subscription: Subscription;
  ingredients: IngredientModel[] = [];

  constructor(private dayService: DayService,
              private mealService: MealService,
              private ingredientService: IngredientService) {
  }

  ngOnInit() {
    this.day = this.dayService.getDay();
    this.ingredients = this.ingredientService.getIngredients();
    this.subscription =  this.ingredientService.ingredientsChanged.subscribe(
      (ingredients: IngredientModel[]) => {
        this.ingredients = ingredients;
      }
    );
  }

  onSubmit() {
    const formData = this.foodForm.value;
    const ingredient = this.ingredientService.getIngredientById(formData.ingredientId);
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
