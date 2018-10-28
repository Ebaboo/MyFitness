import { IngredientModel } from './ingredient/ingredient.model';

export class MealPartModel {
  public ingredient: IngredientModel;
  public grams: number;

  constructor(ingredient: IngredientModel, grams: number) {
    this.ingredient = ingredient;
    this.grams = grams;
  }

  getCalories(): number {
    return this.grams * this.ingredient.calories;
  }
}
