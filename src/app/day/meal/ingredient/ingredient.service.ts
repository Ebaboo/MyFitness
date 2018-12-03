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
      // .pipe(
      //   map(ingredientsData => {
      //     return ingredientsData.ingredients.map(ingredient => {
      //       return {
      //         id: ingredient._id,
      //         name: ingredient.name,
      //         calories: ingredient.calories
      //       };
      //     });
      //   })
      // )
      .subscribe(mapedIngredients => {
        this.ingredients = mapedIngredients.ingredients;
        this.ingredientsChanged.next([...this.ingredients]);
      });
    return [...this.ingredients].slice();
  }

  getIngredientById(id: string) {
    return this.http.get<{_id: string, name: string, calories: number}>('http://localhost:3000/api/ingredients/' + id);
  }

  updateIngredient(id: string, ingredientData) {
    this.http
      .put<{message: string, ingredient: any}>('http://localhost:3000/api/ingredients/' + id, ingredientData)
      .subscribe(response => {
        this.ingredients.map(ingredient => {
          if (ingredient._id === response.ingredient._id) {
            ingredient.name = response.ingredient.name;
            ingredient.calories = response.ingredient.calories;
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
      .post<{ message: string; ingredient: IngredientModel }>(
        'http://localhost:3000/api/ingredients',
        ingredient
      )
      .subscribe(responseData => {
        // console.log(responseData.ingredient);
        // const ingredientId = responseData.ingredientId;
        // ingredient._id = ingredientId;
        const recievedIngredient = {
          _id: responseData.ingredient._id,
          name: responseData.ingredient.name,
          calories: responseData.ingredient.calories
        };
        this.ingredients.push(recievedIngredient);
        this.ingredientsChanged.next(this.ingredients);
      });
  }
}
