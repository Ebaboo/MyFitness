import { FoodModel } from './food/food.model';

export class MealPartModel {
  public food: FoodModel;
  public grams: number;

  constructor(food: FoodModel, gramms: number) {
    this.food = food;
    this.grams = gramms;
  }

  getCalories(): number {
    return this.grams * this.food.calories;
  }
}
