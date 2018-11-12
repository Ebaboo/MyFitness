import { MealPartModel } from './meal-part.model';
import { MealTypeModel } from './meal-type.model';
import { UUID } from 'angular2-uuid';

export class MealModel {
  public mealParts: MealPartModel[];
  public mealType: MealTypeModel;
  private date: Date;

  constructor(mealParts: MealPartModel[], mealType: MealTypeModel) {
    this.mealParts = mealParts;
    this.mealType = mealType;
    this.date = new Date();
  }
}

