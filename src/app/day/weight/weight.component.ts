import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WeightService } from './weight.service';
import * as moment from 'moment';
import { WeightModel } from './weight.model';

@Component({
  selector: 'app-weight',
  templateUrl: './weight.component.html',
  styleUrls: ['./weight.component.css']
})
export class WeightComponent implements OnInit, OnChanges {
  form: FormGroup;
  weightOfDay: WeightModel[] = [];
  showForm = true;
  editMode = false;
  cancelButtonAppear = false;
  @Input() pickerDate;

  constructor(private weightService: WeightService) {}

  ngOnInit() {
    this.form = new FormGroup({
      weight: new FormControl(
        null, Validators.required
      )
    });
    this.weightService.weightChanged.subscribe(weightData => {
      this.weightOfDay = weightData;
      if (this.weightOfDay.length > 0) {
        this.showForm = false;
      } else {
        this.showForm = true;
      }
    });
  }

  ngOnChanges() {
    this.form = new FormGroup({
      weight: new FormControl(
        null, Validators.required
      )
    });
  }

  onSubmit() {
    if (!this.editMode) {
      this.weightService.addWeight(this.form.value.weight, this.pickerDate);
    } else {
      if (window.confirm('Are sure you want to update this item?')) {
        this.weightService.updateWeight(this.weightOfDay[0]._id,
          this.form.value.weight);
          this.showForm = false;
      }

    }

  }

  onChangeWeight() {
    this.editMode = true;
    this.showForm = true;
    this.cancelButtonAppear = true;
    this.form.setValue({
      weight: this.weightOfDay[0].weight
    });
  }

  onCancel() {
    this.showForm = false;
    this.cancelButtonAppear = false;
  }
}
