import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { DayService } from '../day.service';
import { MealModel } from './meal.model';
import { MealService } from './meal.service';
import { MealTypeModel } from './meal-type.model';
import { EditMealComponent } from './edit-meal/edit-meal.component';

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
      }
    );
    this.mealService.getMealsForDay('19-11-2018', '19-11-2018');
  }

  onDeleteIngredient(mealId: string, mealpartId: string) {
    this.mealService.DeleteIngredient(mealId, mealpartId);
  }

  onMealUpdate(mealId: string, mealPartId: string, amount: number) {
    this.dialog.open(EditMealComponent, {
      data: {
        mealId: mealId,
        mealPartId: mealPartId,
        amount: amount
      }});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
