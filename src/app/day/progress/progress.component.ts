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

  constructor(private mealService: MealService,
    private authService: AuthService) {}

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
    const startColor = 'rgba(245, 242, 74 , 1)';
    const middleColor = '#4AFF21';
    const endColor = '#F31E1E';
    if (roundNumber < 40) {
      this.bgColor =
        '-webkit-gradient(linear, left top, right top,   color-stop(0%,' +
        startColor +
        '), color-stop(100%,rgba(125,185,232,0)))';
    } else if  (roundNumber < 80 ) {
      this.bgColor = '-webkit-gradient(linear, left top, right top,   color-stop(0%,' +
      middleColor +
      '), color-stop(100%, rgba(125,185,232,0)))';
    } else if ( roundNumber < 99 ) {
      this.bgColor = '-webkit-gradient(linear, left top, right top,   color-stop(0%,' +
      endColor +
      '), color-stop(100%,rgba(125,185,232,0)))';
    } else {
      this.bgColor = '-webkit-gradient(linear, left top, right top,   color-stop(0%,' +
      endColor +
      '), color-stop(100%,' + endColor + '))';
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
