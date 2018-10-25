import { IngredientModel } from './ingredient/ingredient.model';

export class MealPartModel {
  public food: IngredientModel;
  public grams: number;

  constructor(food: IngredientModel, grams: number) {
    this.food = food;
    this.grams = grams;
  }

  getCalories(): number {
    return this.grams * this.food.calories;
  }
}
