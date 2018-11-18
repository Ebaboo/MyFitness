import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { DayService } from './day.service';
import { NgForm } from '@angular/forms';
import { MealService } from './meal/meal.service';
import { MealPartModel } from './meal/meal-part.model';
import { IngredientModel } from './meal/ingredient/ingredient.model';
import { DayModel } from './day.model';
import { MealTypeModel } from './meal/meal-type.model';
import { IngredientService } from './meal/ingredient/ingredient.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MealModel } from './meal/meal.model';
import { isEmpty } from 'rxjs/operators';

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
  meals: MealModel[] = [];

  constructor(
    private dayService: DayService,
    private mealService: MealService,
    private ingredientService: IngredientService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.day = this.dayService.getDay();
    this.ingredients = this.ingredientService.getIngredients();
    this.subscription = this.ingredientService.ingredientsChanged.subscribe(
      (ingredients: IngredientModel[]) => {
        this.ingredients = ingredients;
      }
    );
    this.subscription = this.mealService.mealsChanged.subscribe(
      (meals: MealModel[]) => {
        this.meals = meals;
      }
    );
  }

  onSubmit() {
    const formData = this.foodForm.value;
    const meals = this.meals;
    let mealId = null;
    let mealType = null;
    let hasMeal = false;
    switch (formData.whatMeal) {
      case 'breakfast':
        mealType = 0;
        break;
      case 'lunch':
        mealType = 1;
        break;
      case 'dinner':
        mealType = 2;
        break;
    }
    if (this.meals.length < 1) {
      this.mealService.addMeal(formData.ingredientId, formData.amount,
         mealType);
         return;
    }

    meals.forEach(meal => {
      if (meal.mealType === mealType) {
        hasMeal = true;
        mealId = meal.id;
        return;
      }
    });

    if (hasMeal) {
      this.ingredientService
        .getIngredientById(formData.ingredientId)
        .subscribe(ingredientData => {
          const ingredient = {
            id: ingredientData._id,
            name: ingredientData.name,
            calories: ingredientData.calories
          };
          this.mealService.addMealPartToMeal(
            mealType,
            new MealPartModel(ingredient, formData.amount),
            mealId
          );
        });
    } else {
      this.mealService.addMeal(formData.ingredientId, formData.amount,
        mealType);
      return;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
