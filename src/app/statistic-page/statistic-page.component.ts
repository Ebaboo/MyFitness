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
        const soretedTotalCaloriesByDate = this.sortByDate(
          allDates,
          totalCaloriesByDay
        );

        // totalCaloriesByDay = Object.keys(totalCaloriesByDay)
        //   .sort()
        //   .reduce((r, k) => ((r[k] = totalCaloriesByDay[k]), r), {});
        allDatesKeys = Object.keys(soretedTotalCaloriesByDate);
        caloriesByDates = Object.values(soretedTotalCaloriesByDate);

        const weightByDated = this.sortWeightByDate(data[1].weightData);

        const soretedWeightByDate = this.sortByDate(
          allDates,
          weightByDated
        );
        console.log(soretedWeightByDate);



        this.context = (<HTMLCanvasElement>(
          this.canvas.nativeElement
        )).getContext('2d');
        const gradient = this.context.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(115, 18, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 18, 205, 0.5)');

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
                display: false
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
          this.chart.update();
        }
      });
  }

  private sortByDate(allDates: any[], totalCaloriesByDay: {}) {
    const soretedTotalCaloriesByDate = {};
    allDates.map(x => {
      if (!totalCaloriesByDay.hasOwnProperty(x)) {
        totalCaloriesByDay[x] = 0;
        soretedTotalCaloriesByDate[x] = 0;
      } else {
        totalCaloriesByDay[x] = totalCaloriesByDay[x];
        soretedTotalCaloriesByDate[x] = totalCaloriesByDay[x];
      }
    });
    return soretedTotalCaloriesByDate;
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
