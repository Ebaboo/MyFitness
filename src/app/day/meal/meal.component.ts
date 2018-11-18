import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { MealModel } from './meal.model';
import { DayService } from '../day.service';
import { MealService } from './meal.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { EditMealComponent } from './edit-meal/edit-meal.component';
import { MealTypeModel } from './meal-type.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit, OnDestroy {
  meals: MealModel[] = [];
  subscription: Subscription;


  constructor(private dayService: DayService,
              private mealService: MealService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.subscription = this.mealService.mealsChanged.subscribe(
      (meals: MealModel[]) => {
        this.meals = meals;
        console.log(this.meals);
      }
    );
    this.mealService.getMealsForDay('18-11-2018', '18-11-2018');
  }

  onDeleteIngredient(mealIndex, mealPartIndex) {
    this.mealService.DeleteIngredient(mealIndex, mealPartIndex);
  }

  // onMealUpdate(mealType: MealTypeModel, mealIndex: number) {
  //   const editingMeal = this.mealService.getMealByTypeAndIndex(mealType, mealIndex);
  //   this.dialog.open(EditMealComponent, {
  //     data: {
  //       mealType: mealType,
  //       mealIndex: mealIndex,
  //       data: editingMeal[0].mealParts[0]
  //     }});
  // }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
