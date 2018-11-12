import { Injectable } from '@angular/core';
import { IngredientModel } from './ingredient.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  ingredientsChanged = new Subject<IngredientModel[]>();
  ingredients: IngredientModel[] = [];

  constructor(private http: HttpClient) {}

  getIngredients() {
    this.http
      .get<{ message: string; ingredients: any }>(
        'http://localhost:3000/api/ingredients'
      )
      .pipe(
        map(ingredientsData => {
          return ingredientsData.ingredients.map(ingredient => {
            return {
              id: ingredient._id,
              name: ingredient.name,
              calories: ingredient.calories
            };
          });
        })
      )
      .subscribe(mapedIngredients => {
        this.ingredients = mapedIngredients;
        this.ingredientsChanged.next([...this.ingredients]);
      });
    return [...this.ingredients].slice();
  }

  getIngredientById(id: string) {
    return this.ingredients.find(ingredientId => ingredientId.id === id);
  }

  updateIngredient(id: string, ingredientData) {
    this.http
      .put('http://localhost:3000/api/ingredients/' + id, ingredientData)
      .subscribe(response => {
        this.ingredients.map(ingredient => {
          if (ingredient.id === id) {
            ingredient.name = ingredientData.ingredientName;
            ingredient.calories = ingredientData.ingredientCalories;
            return;
          }
        });
        this.ingredientsChanged.next(this.ingredients);
      });

  }

  addIngredient(id: string, ingredientData) {
    const ingredient = new IngredientModel(
      null,
      ingredientData.ingredientName,
      ingredientData.ingredientCalories
    );
    this.http
      .post<{ message: string; ingredientId: string }>(
        'http://localhost:3000/api/ingredients',
        ingredient
      )
      .subscribe(responseData => {
        const ingredientId = responseData.ingredientId;
        ingredient.id = ingredientId;
      });
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients);
  }
}
