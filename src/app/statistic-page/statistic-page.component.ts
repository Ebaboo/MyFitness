import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { MealService } from '../day/meal/meal.service';
import { MealModel } from '../day/meal/meal.model';
import * as moment from 'moment';
import { WeightService } from '../day/weight/weight.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-statistic-page',
  templateUrl: './statistic-page.component.html',
  styleUrls: ['./statistic-page.component.css']
})
export class StatisticPageComponent implements OnInit {
  meals: MealModel[];
  chart: any = [];
  startDate = new Date();
  currentDate = new Date();
  counter = 0;
  @ViewChild('canvas', { read: ElementRef }) private canvas: ElementRef;
  public context: CanvasRenderingContext2D;

  constructor(
    private mealService: MealService,
    private weightService: WeightService
  ) {}

  ngOnInit() {
    this.startDate.setDate(this.startDate.getDate() - 7);
    this.makeChart();
  }

  onStartChange() {
    this.makeChart();
  }

  onEndChange() {
    this.makeChart();
  }

  private makeChart() {
    let allDates = [];
    let allDatesKeys = [];
    let caloriesByDates = [];
    const currentDate = this.formatDate(this.currentDate);
    const startDate = this.formatDate(this.startDate);
      forkJoin(this.mealService
        .getMealsBetweenDates(startDate, currentDate),
        this.weightService.getWeightBetweenDates(startDate, currentDate)
      )
      .subscribe(data => {
        this.meals = [...data[0].meals];
        const mealByDates = this.sortMealsByDate(this.meals);

        const dateKeys = Object.keys(mealByDates);
        const totalCaloriesForEachMeal = this.getTotalCaloriesByMeal(
          dateKeys,
          mealByDates
        );

        const totalCaloriesByDay = this.getTotalCaloriesByDate(
          dateKeys,
          totalCaloriesForEachMeal
        );

        allDates = this.getDates(startDate, currentDate);
        const soretedTotalCaloriesByDate = this.sortAndInsertMealByDate(
          allDates,
          totalCaloriesByDay
        );

        // totalCaloriesByDay = Object.keys(totalCaloriesByDay)
        //   .sort()
        //   .reduce((r, k) => ((r[k] = totalCaloriesByDay[k]), r), {});
        allDatesKeys = Object.keys(soretedTotalCaloriesByDate);
        caloriesByDates = Object.values(soretedTotalCaloriesByDate);

        const weightByDated = this.sortWeightByDate(data[1].weightData);

        const sortedWeightByDate = this.sortAndInsertWeightByDate(
          allDates,
          weightByDated
        );
        const weightByDates = Object.values(sortedWeightByDate);


        this.context = (<HTMLCanvasElement>(
          this.canvas.nativeElement
        )).getContext('2d');
        const gradient = this.context.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(159, 12, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(12, 255, 222, 0.5)');
        const weightGradient = this.context.createLinearGradient(100, 100, 100, 400);
        weightGradient.addColorStop(0, 'rgba(251, 255, 12, 0.6)');
        weightGradient.addColorStop(1, 'rgba(255, 12, 218, 0.6)');

        if (this.chart.length < 1) {
          this.chart = new Chart(this.context, {
            type: 'line',
            data: {
              labels: allDatesKeys,
              datasets: [
                {
                  label: 'Total Calories: ',
                  data: caloriesByDates,
                  borderColor: '#3cba9f',
                  fill: true,
                  backgroundColor: gradient,
                  pointBorderColor: '#fff',
                  pointBorderWidth: 2,
                  pointRadius: 5,
                  pointHoverRadius: 8
                },
                {
                  label: 'Weight: ',
                  data: weightByDates,
                  borderColor: '#3cba9f',
                  fill: true,
                  backgroundColor: weightGradient,
                  pointBorderColor: '#fff',
                  pointBorderWidth: 2,
                  pointRadius: 5,
                  pointHoverRadius: 8
                }
              ]
            },
            options: {
              spanGaps: true,
              maintainAspectRatio: false,
              showAllTooltips: false,
              title: {
                display: true,
                text: 'Total Calories By Each Day'
              },
              legend: {
                display: true
              },
              scales: {
                xAxes: [
                  {
                    gridLines: {
                      color: 'rgba(61, 199, 213, 0.3)' // makes grid lines from y axis red
                    }
                  }
                ],
                yAxes: [
                  {
                    gridLines: {
                      color: 'rgba(61, 199, 213, 0.3)' // makes grid lines from y axis red
                    }
                  }
                ]
              },
              chartArea: {
                backgroundColor: 'rgba(0, 0, 0 ,0.05)'
              }
            }
          });
        } else {
          this.chart['data'].labels = allDatesKeys;
          this.chart['data'].datasets[0].data = caloriesByDates;
          this.chart['data'].datasets[1].data = weightByDates;
          this.chart.update();
        }
      });
  }

  private sortAndInsertMealByDate(allDates: any[], totalCaloriesByDay: {}) {
    const soretedTotalCaloriesByDate = {};
    allDates.map(date => {
      if (!totalCaloriesByDay.hasOwnProperty(date)) {
        totalCaloriesByDay[date] = 0;
        soretedTotalCaloriesByDate[date] = 0;
      } else {
        totalCaloriesByDay[date] = totalCaloriesByDay[date];
        soretedTotalCaloriesByDate[date] = totalCaloriesByDay[date];
      }
    });
    return soretedTotalCaloriesByDate;
  }

  private sortAndInsertWeightByDate(allDates: any[], totalCaloriesByDay: {}) {
    const soretedWeight = {};
    allDates.map(x => {
      if (!totalCaloriesByDay.hasOwnProperty(x)) {
        totalCaloriesByDay[x] = null;
        soretedWeight[x] = null;
      } else {
        totalCaloriesByDay[x] = totalCaloriesByDay[x];
        soretedWeight[x] = totalCaloriesByDay[x];
      }
    });
    return soretedWeight;
  }

  private formatDate(startDate) {
    const day = startDate.getDate();
    const month = startDate.getMonth() + 1;
    const year = startDate.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private sortMealsByDate(meals) {
    const MealByDates = {};
    meals.forEach((val, index) => {
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


  private sortWeightByDate(meals) {
    const weightByDates = {};
    meals.forEach((val, index) => {
      const formatedDateAsIndex = moment(val.date).format('DD-MM-YYYY');
      if (index === 0) {
        weightByDates[formatedDateAsIndex] = val.weight;

        return;
      }
      if (weightByDates.hasOwnProperty(formatedDateAsIndex)) {
        weightByDates[formatedDateAsIndex].push(val.weight);
        console.log('huy');
      } else {
        weightByDates[formatedDateAsIndex] = val.weight;

      }
    });
    return weightByDates;
  }

}
