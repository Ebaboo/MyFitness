import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { WeightModel } from './weight.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/auth/auth.service';

const BACKEND_URL = environment.apiUrl + '/weight';

@Injectable({
  providedIn: 'root'
})
export class WeightService {
  userId: string;
  weight: WeightModel[];
  weightChanged = new Subject<WeightModel[]>();

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getWeightForDay(date: string) {
    const queryParams = `?startDate=${date}&endDate=${date}`;
    this.http
      .get<{ message: string; weightData: WeightModel[] }>(
        BACKEND_URL + queryParams
      )
      .subscribe(response => {
        this.weight = response.weightData;
        this.weightChanged.next(this.weight);
      });
  }

  getWeightBetweenDates(startDate, endDate) {
    const queryParams = `?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<{ message: string; weightData: WeightModel[] }>(
      BACKEND_URL + queryParams
    );
  }

  addWeight(currentWeight: number, date: Date) {
    const weight = {
      weight: currentWeight,
      date: date
    };
    this.http
      .post<{ message: string; weight: WeightModel[] }>(BACKEND_URL, weight)
      .subscribe(response => {
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
    this.http
      .patch<{ message: string; weightData: WeightModel }>(
        BACKEND_URL,
        weightData
      )
      .subscribe(response => {
        this.weight[0] = response.weightData;
        this.weightChanged.next(this.weight);
      });
  }
}
