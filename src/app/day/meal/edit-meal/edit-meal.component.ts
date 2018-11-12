import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MealService } from '../meal.service';

@Component({
  selector: 'app-edit-meal',
  templateUrl: './edit-meal.component.html',
  styleUrls: ['./edit-meal.component.css']
})
export class EditMealComponent implements OnInit {
  ingredientForm: FormGroup;


  constructor(private dialogRef: MatDialogRef<EditMealComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private mealService: MealService ) {
  }

  ngOnInit() {
    this.ingredientForm = new FormGroup({
      'grams': new FormControl(this.data.data.grams)
    });
  }

  onSubmit() {
    const mealIndex = this.data.mealIndex;
    const mealType = this.data.mealType;
    this.mealService.updateIngredientInMeal(mealType, mealIndex,
      this.ingredientForm.value.grams);
    this.onClose();

  }

  onClose() {
     this.dialogRef.close();
  }



}
