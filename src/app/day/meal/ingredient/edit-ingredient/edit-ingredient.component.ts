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
  id: UUID;
  editMode = false;
  ingredientForm: FormGroup;
  ingredient: IngredientModel;

  constructor(private route: ActivatedRoute,
              private ingredientService: IngredientService) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
        window.scroll(0, 0);
      }
    );
  }


  onSubmit() {
    if (this.editMode) {
      this.ingredientService.updateIngredient(this.id, this.ingredientForm.value);
    } else {
        this.ingredientService.addIngredient(UUID.UUID(), this.ingredientForm.value);
    }
  }

  private initForm() {
    let ingredientName = '';
    let ingredientCalories = null;
    if (this.editMode) {
      this.ingredient = this.ingredientService.getIngredientById(this.id);
      ingredientName = this.ingredient.name;
      ingredientCalories = this.ingredient.calories;
    }
    this.ingredientForm = new FormGroup({
      'ingredientName': new FormControl(ingredientName, Validators.required),
      'ingredientCalories': new FormControl(ingredientCalories, Validators.required)

    });
  }


}
