import { Component, OnInit, OnDestroy } from '@angular/core';
import { MealService } from '../meal/meal.service';
import { Subscription } from 'rxjs';
import { MealModel } from '../meal/meal.model';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit, OnDestroy {
  caloriesLimit: number;
  width: any;
  subscription: Subscription;
  meals: MealModel[];
  bgColor = 'white';

  constructor(
    private mealService: MealService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.caloriesLimit = this.setCaloriesLimitByGender();
    const currentDate = moment(new Date())
      .add(2, 'hours')
      .toISOString();
    this.subscription = this.mealService.mealsChanged.subscribe(
      (meals: MealModel[]) => {
        this.meals = meals;
        this.calculateTotalCalories();
      }
    );
  }

  private calculateTotalCalories() {
    let totalCalories = 0;
    if (this.meals) {
      this.meals.forEach(meal => {
        meal.mealParts.forEach(mealPart => {
          totalCalories =
            totalCalories + mealPart.grams * mealPart.ingredient.calories;
        });
      });
      this.width = ((totalCalories / this.caloriesLimit) * 100).toFixed(2);
      this.applyColorToProgressBar();
    } else {
      this.width = 0;
    }
  }

  private applyColorToProgressBar() {
    const roundNumber = parseFloat(this.width);
    const middleColor = '#28EA91';
    const endColor = '#FE5279';
    if (roundNumber < 80) {
      this.bgColor = middleColor;
    } else {
      this.bgColor = endColor;
    }
  }

  private setCaloriesLimitByGender() {
    const gender = this.authService.getGender();
    if (gender === 'male') {
      return 2400;
    } else {
      return 2000;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
