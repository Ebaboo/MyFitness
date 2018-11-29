import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { MealService } from '../day/meal/meal.service';
import { MealModel } from '../day/meal/meal.model';
import * as moment from 'moment';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-statistic-page',
  templateUrl: './statistic-page.component.html',
  styleUrls: ['./statistic-page.component.css']
})
export class StatisticPageComponent implements OnInit {
  meals: MealModel[];
  chart = [];
  startDate = new Date();
  currentDate = new Date();

  constructor(private mealService: MealService) {}

  ngOnInit() {
    this.makeChart(this.startDate, this.currentDate);
  }

  onChange(startDate) {
    this.makeChart();
  }

  private makeChart(startDate: any, currentDate: any) {
    currentDate = this.formatDate(this.currentDate);
    startDate = this.formatDate(this.startDate);
    console.log(startDate, currentDate);
    this.mealService
      .getMealsBetweenDates(startDate, currentDate)
      .subscribe(data => {
        this.meals = [...data.meals];
        const MealByDates = this.sortMealsByDate();

        const dateKeys = Object.keys(MealByDates);
        const totalCaloriesForEachMeal = this.getTotalCaloriesByMeal(
          dateKeys,
          MealByDates
        );
        let totalCaloriesByDay = this.getTotalCaloriesByDate(
          dateKeys,
          totalCaloriesForEachMeal
        );


        const allDates = this.getDates('20-11-2018', startDate);
        allDates.map(x => {
          if (!totalCaloriesByDay.hasOwnProperty(x)) {
            totalCaloriesByDay[x] = 0;
          }
        });

        totalCaloriesByDay = Object.keys(totalCaloriesByDay)
          .sort()
          .reduce((r, k) => ((r[k] = totalCaloriesByDay[k]), r), {});
        const allDatesKeys = Object.keys(totalCaloriesByDay);
        const caloriesByDates = Object.values(totalCaloriesByDay);

        this.chart = new Chart('canvas', {
          type: 'line',
          data: {
            labels: allDatesKeys,
            datasets: [
              {
                label: 'Total Calories: ',
                data: caloriesByDates,
                title: 'Total Calories For Each Day',
                borderColor: '#3cba9f',
                fill: true
              }
            ]
          },
          options: {
            title: {
              display: true,
              text: 'Total Calories By Each Day'
            },
            legend: {
              display: false
            },
            scales: {
              xAxes: [
                {
                  display: true
                }
              ],
              yAxes: [
                {
                  display: true
                }
              ]
            }
          }
        });
      });
  }

  private formatDate(startDate) {
    const day = startDate.getDate();
    const month = startDate.getMonth() + 1;
    const year = startDate.getFullYear();
    return `${day}-${month}-${year}`;

  }

  private sortMealsByDate() {
    const MealByDates = {};
    this.meals.forEach((val, index) => {
      const formatedDateAsIndex = moment(val.date).format('DD-MM-YYYY');
      if (index === 0) {
        MealByDates[formatedDateAsIndex] = [val];
        return;
      }
      if (MealByDates.hasOwnProperty(formatedDateAsIndex)) {
        MealByDates[formatedDateAsIndex].push(val);
      } else {
        MealByDates[formatedDateAsIndex] = [val];
      }
    });
    return MealByDates;
  }

  private getDates(startDate, stopDate) {
    const dateArray = [];
    let currentDate = moment(startDate, 'DD-MM-YYYY')
      .add(2, 'hours')
      .utc()
      .toISOString();
    stopDate = moment(stopDate, 'DD-MM-YYYY')
      .add(2, 'hours')
      .utc()
      .toISOString();
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format('DD-MM-YYYY'));
      currentDate = moment(currentDate)
        .add(1, 'days')
        .toISOString();
    }
    return dateArray;
  }

  private getTotalCaloriesByDate(
    dateKeys: string[],
    totalCaloriesForEachMeal: {}
  ) {
    const totalCaloriesByDay = {};
    dateKeys.forEach(x => {
      totalCaloriesForEachMeal[x].forEach(t => {
        if (!totalCaloriesByDay[x]) {
          totalCaloriesByDay[x] = t.totalCalories;
        } else {
          totalCaloriesByDay[x] = totalCaloriesByDay[x] + t.totalCalories;
        }
      });
    });
    return totalCaloriesByDay;
  }

  private getTotalCaloriesByMeal(dateKeys: string[], MealByDates: {}) {
    const obj = {};
    dateKeys.forEach(dateKey => {
      obj[dateKey] = [];
    });
    let indexCounter = 0;
    dateKeys.forEach(dateKey => {
      MealByDates[dateKey].forEach(meal => {
        meal.mealParts.forEach((c, d) => {
          obj[dateKey].push({
            totalCalories: c.grams * c.ingredient.calories,
            grams: c.grams,
            calories: c.ingredient.calories,
            meal: c
          });
          indexCounter++;
        });
      });
    });
    return obj;
  }
}

// const MealByDates = new Map();
// this.meals.forEach((val, index) => {
// const formatedDateAsIndex = moment(val.date).format('DD-MM-YYYY');
//   if (index === 0) {
//     MealByDates.set(formatedDateAsIndex, [val]);
//     return;
//   }
//   if (MealByDates.has(formatedDateAsIndex)) {
//     MealByDates.get(formatedDateAsIndex).push(val);
//   } else {
//     MealByDates.set(formatedDateAsIndex, [val]);
//   }

// });
