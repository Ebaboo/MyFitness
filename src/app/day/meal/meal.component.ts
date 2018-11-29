import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { MealModel } from './meal.model';
import { MealService } from './meal.service';
import { EditMealComponent } from './edit-meal/edit-meal.component';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit, OnDestroy {
  meals: MealModel[] = [];
  private subscription: Subscription;
  constructor(
    private mealService: MealService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.subscription = this.mealService.mealsChanged.subscribe(
      (meals: MealModel[]) => {
        this.meals = meals;
      }
    );

    const time = moment().format('DD-MM-YYYY');
    this.mealService.getMealsForDay(time, time);
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
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
