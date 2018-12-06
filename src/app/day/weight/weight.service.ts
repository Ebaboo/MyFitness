import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { WeightModel } from './weight.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeightService {
  weight: WeightModel[];
  weightChanged = new Subject<WeightModel[]>();

  constructor(private http: HttpClient) { }

  getWeightForDay(date: Date) {
    const queryParams = `?startDate=${date}&endDate=${date}`;
    this.http.get<{message: string, weightData: WeightModel[]}>(
      'http://localhost:3000/api/weight' + queryParams
    ).subscribe( response => {
      this.weight = response.weightData;
      this.weightChanged.next(this.weight);
    });
  }

  getWeightBetweenDates(startDate, endDate) {
    const queryParams = `?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<{message: string, weightData: WeightModel[]}>(
      'http://localhost:3000/api/weight' + queryParams
    );
  }

  addWeight(currentWeight: number, date: Date) {
    const weight = {
      weight: currentWeight,
      date: date
    };
    this.http.post<{message: string, weight: WeightModel[]}>(
      'http://localhost:3000/api/weight', weight
    ).subscribe(response => {
      const weightData = [];
      weightData.push(response.weight);
      this.weightChanged.next(weightData);
    });
  }


  updateWeight(id: string, weight: number) {
    const weightData = {
      weightId: id,
      amount: weight
    };
    this.http.patch<{message: string, weightData: WeightModel}>('http://localhost:3000/api/weight', weightData)
    .subscribe(response => {
      this.weight[0] = response.weightData;
      this.weightChanged.next(this.weight);
    });
  }
}
