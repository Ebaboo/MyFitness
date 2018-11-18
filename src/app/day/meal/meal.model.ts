import { MealPartModel } from './meal-part.model';
import { MealTypeModel } from './meal-type.model';

export class MealModel {
  id = null;
  public mealParts: MealPartModel[];
  public mealType: MealTypeModel;
  public date: string;

  constructor(mealParts: MealPartModel[], mealType: MealTypeModel) {
    this.mealParts = mealParts;
    this.mealType = mealType;
  }
}

