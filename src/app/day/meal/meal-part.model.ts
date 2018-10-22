import { FoodModel } from './food/food.model';

export class MealPartModel {
  public food: FoodModel;
  public grams: number;

  constructor(food: FoodModel, grams: number) {
    this.food = food;
    this.grams = grams;
  }

  getCalories(): number {
    return this.grams * this.food.calories;
  }
}
