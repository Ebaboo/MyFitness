import { IngredientModel } from './ingredient/ingredient.model';

export class MealPartModel {
  public ingredient: IngredientModel;
  public grams: number;

  constructor(food: IngredientModel, grams: number) {
    this.ingredient = food;
    this.grams = grams;
  }

  getCalories(): number {
    return this.grams * this.ingredient.calories;
  }
}
