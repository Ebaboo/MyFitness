import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { DayService } from './day.service';
import { NgForm } from '@angular/forms';
import { MealService } from './meal/meal.service';
import { MealPartModel } from './meal/meal-part.model';
import { IngredientModel } from './meal/ingredient/ingredient.model';
import { DayModel } from './day.model';
import { IngredientService } from './meal/ingredient/ingredient.service';
import { Subscription } from 'rxjs';
import { MealModel } from './meal/meal.model';
import { AuthService } from '../auth/auth.service';
import * as moment from 'moment';
import { WeightService } from './weight/weight.service';

@Component({
  selector: 'app-current-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit, OnDestroy {
  @ViewChild('f') foodForm: NgForm;
  day: DayModel;
  subscription: Subscription;
  userIsAuthenticated = false;
  nickname: string;
  ingredients: IngredientModel[] = [];
  meals: MealModel[] = [];
  lastSevenDays = [];
  selectedIndex = null;
  pickedDate: string;

  constructor(
    private dayService: DayService,
    private mealService: MealService,
    private ingredientService: IngredientService,
    private authService: AuthService,
    private weightService: WeightService
  ) {}

  ngOnInit() {
    this.nickname = this.authService.getUserName();
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
    this.getDates1();

  }

  //  getDates() {
  //   const dateArray = [];
  //   const normalDates = [];
  //   let currentDate = moment(new Date())
  //     .utc()
  //     .add(2, 'hours')
  //     .subtract(7, 'days');
  //   const stopDates = moment(new Date()).add(1, 'days');
  //   while (currentDate <= stopDates) {
  //     normalDates.push(currentDate.toDate());
  //     dateArray.push(moment(currentDate).format('DD-MM-YYYY'));
  //     currentDate = moment(currentDate).add(1, 'days');
  //   }
  //   this.lastSevenDays = normalDates;
  //   const formatedCurrentDate = normalDates.length - 1;
  //   this.onDaySelected(normalDates[(formatedCurrentDate)], formatedCurrentDate);
  // }

  getDates1() {
    const dateArray = [];
    const normalDates = [];
    let currentDate = moment(new Date())
      .utc()
      .subtract(7, 'days');
    const stopDate = moment(new Date(), 'DD-MM-YYYY');
    while (currentDate <= stopDate) {
      normalDates.push(currentDate.toDate());
      dateArray.push(moment(currentDate).format('DD-MM-YYYY'));
      currentDate = moment(currentDate).add(1, 'days');
    }
    this.lastSevenDays = normalDates;
    const formatedCurrentDate = normalDates.length - 1;
    this.onDaySelected(normalDates[(formatedCurrentDate)], formatedCurrentDate);
  }

  onDaySelected(day, i) {
    const newDate = moment(new Date(day)).format('DD-MM-YYYY');
    this.pickedDate = newDate;
    this.selectedIndex = i;
    this.mealService.getMealsForDay(newDate, newDate);
    this.weightService.getWeightForDay(newDate);
  }

  // getDates() {
  //   const dateArray = [];
  //   const normalDates = [];
  //   let currentDate = moment(new Date())
  //     .add(2, 'hours')
  //     .utc()
  //     .subtract(7, 'days');
  //   const stopDates = moment(new Date()).add(1, 'days');
  //   while (currentDate <= stopDates) {
  //     normalDates.push(currentDate.toDate());
  //     dateArray.push(moment(currentDate).format('DD-MM-YYYY'));
  //     currentDate = moment(currentDate).add(1, 'days');
  //   }
  //   this.lastSevenDays = dateArray;
  //   const formatedCurrentDate = dateArray.length - 1;
  //   console.log(normalDates);
  //   this.onDaySelected(dateArray[(formatedCurrentDate)], formatedCurrentDate);
  // }

  // onDaySelected(day, i) {
  //   this.pickedDate = day;
  //   this.selectedIndex = i;
  //   this.mealService.getMealsForDay(day, day);
  //   this.weightService.getWeightForDay(day);
  // }

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
      this.mealService.addMeal(
        formData.ingredientId,
        formData.amount,
        mealType,
        this.pickedDate
      );
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
            ingredient.id,
            formData.amount,
            mealId
          );
        });
    } else {
      this.mealService.addMeal(
        formData.ingredientId,
        formData.amount,
        mealType,
        this.pickedDate
      );
      return;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
