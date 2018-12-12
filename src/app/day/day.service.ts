import { Injectable, OnInit } from '@angular/core';
import { DayModel } from './day.model';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/weight';

@Injectable({
  providedIn: 'root'
})
export class DayService implements OnInit {
  day: DayModel = new DayModel(new Date());


  ngOnInit() {

  }

  getDay() {
    return this.day;
  }



  constructor() {
  }
}
