import { UUID } from 'angular2-uuid';

export class IngredientModel {
  public id: UUID;
  public name: string;
  public calories: number;

  constructor(id: UUID, name: string, calories: number) {
    this.name = name;
    this.calories = calories;
    this.id = id;
  }
}

