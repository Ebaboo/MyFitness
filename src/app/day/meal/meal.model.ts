import { MealPartModel } from './meal-part.model';
import { MealTypeModel } from './meal-type.model';

export class MealModel {
  public id: number;
  public mealParts: MealPartModel[];
  public mealType: MealTypeModel;

  constructor(id: number, mealParts: MealPartModel[], mealType: MealTypeModel) {
    this.id = id;
    this.mealParts = mealParts;
    this.mealType = mealType;
  }
}

