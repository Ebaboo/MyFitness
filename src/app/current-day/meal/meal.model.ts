import { MealPartModel } from './meal-part.model';

export class MealModel {
  public id: number;
  public mealParts: MealPartModel[];
  public mealType: MealType;

  constructor(id: number, mealParts: MealPartModel[], mealType: MealType) {
    this.id = id;
    this.mealParts = mealParts;
    this.mealType = mealType;
  }
}

