import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { IngredientService } from '../ingredient.service';
import { IngredientModel } from '../ingredient.model';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-edit-ingredient',
  templateUrl: './edit-ingredient.component.html',
  styleUrls: ['./edit-ingredient.component.css']
})
export class EditIngredientComponent implements OnInit {
  id: string;
  editMode = false;
  ingredientForm: FormGroup;
  ingredient: IngredientModel;

  constructor(
    private route: ActivatedRoute,
    private ingredientService: IngredientService
  ) {}

  ngOnInit() {
    this.ingredientForm = new FormGroup({
      ingredientName: new FormControl(null, Validators.required),
      ingredientCalories: new FormControl(null, Validators.required)
    });
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.editMode = params['id'] != null;
        this.ingredientService
          .getIngredientById(this.id)
          .subscribe(ingredientData => {
            this.ingredient = {
              id: ingredientData._id,
              name: ingredientData.name,
              calories: ingredientData.calories
            };
            if (this.editMode) {
              this.ingredientForm.setValue({
                ingredientName: this.ingredient.name,
                ingredientCalories: this.ingredient.calories
              });
            } else {
              this.editMode = null;
            }
          });
      }
      window.scroll(0, 0);
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.ingredientService.updateIngredient(
        this.id,
        this.ingredientForm.value
      );
    } else {
      this.ingredientService.addIngredient('', this.ingredientForm.value);
      this.ingredientForm.reset();
    }
  }
}
