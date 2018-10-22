import { Injectable, OnInit } from '@angular/core';
import { DayModel } from './day.model';

@Injectable({
  providedIn: 'root'
})
export class DayService implements OnInit {
  day: DayModel = new DayModel(new Date());


  ngOnInit() {

  }

  getCurrentDay() {
    return this.day;
  }


  constructor() {
  }
}
