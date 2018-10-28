import { MealPartModel } from './meal-part.model';
import { MealTypeModel } from './meal-type.model';
import { UUID } from 'angular2-uuid';

export class MealModel {
  public id: UUID;
  public mealParts: MealPartModel[];
  public mealType: MealTypeModel;

  constructor(id: UUID, mealParts: MealPartModel[], mealType: MealTypeModel) {
    this.id = id;
    this.mealParts = mealParts;
    this.mealType = mealType;
  }
}

