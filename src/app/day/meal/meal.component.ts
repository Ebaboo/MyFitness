import { Component, EventEmitter, OnInit } from '@angular/core';
import { MealModel } from './meal.model';
import { DayService } from '../day.service';
import { MealService } from './meal.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { EditMealComponent } from './edit-meal/edit-meal.component';
import { MealTypeModel } from './meal-type.model';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit {
  meals: MealModel[] = [];


  constructor(private dayService: DayService,
              private mealService: MealService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.mealService.mealsChanged.subscribe(
      (meals: MealModel[]) => {
        this.meals = meals;
        /*this.meals.sort(
          (a, b) => a.mealType < b.mealType ? -1 : a.mealType > b.mealType ? 1 : 0
        );*/
      }
    );
    /*this.meals.sort(
      (a, b) => a.mealType < b.mealType ? -1 : a.mealType > b.mealType ? 1 : 0
    );*/
    this.meals = this.mealService.getMealsForDay();

  }

  onDeleteIngredient(mealIndex, mealPartIndex) {
    this.mealService.DeleteIngredient(mealIndex, mealPartIndex);
  }

  onMealUpdate(mealType: MealTypeModel, mealIndex: number) {
    const editingMeal = this.mealService.getMealByTypeAndIndex(mealType, mealIndex);
    this.dialog.open(EditMealComponent, {
      data: {
        mealType: mealType,
        mealIndex: mealIndex,
        data: editingMeal[0].mealParts[0]
      }});


  }


}
