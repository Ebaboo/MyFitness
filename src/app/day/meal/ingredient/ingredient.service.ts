import { Injectable } from '@angular/core';
import { IngredientModel } from './ingredient.model';
import { UUID } from 'angular2-uuid';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  ingredientsChanged = new Subject<IngredientModel[]>();
  ingredients: IngredientModel[] = [
    new IngredientModel(UUID.UUID(), 'bread', 200),
    new IngredientModel(UUID.UUID(), 'Steak', 550),
    new IngredientModel(UUID.UUID(), 'Гречневая каша', 550),
    new IngredientModel(UUID.UUID(), 'Пузовик', 550),
  ];

  constructor() {
  }


  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredientById(id: UUID) {
    return this.ingredients.find(
      ingredientId => ingredientId.id === id
    );
  }

  updateIngredient(id: UUID, ingredientData) {
    this.ingredients.map(
      (ingredient) => {
        if (ingredient.id === id) {
          ingredient.name = ingredientData.ingredientName;
          ingredient.calories = ingredientData.ingredientCalories;
        }
      }
    );
    this.ingredientsChanged.next(this.ingredients);
  }

  addIngredient(id: UUID, ingredientData) {
    this.ingredients.push( new IngredientModel(
      id,
      ingredientData.ingredientName,
      ingredientData.ingredientCalories)
    );
    this.ingredientsChanged.next(this.ingredients);
  }

}