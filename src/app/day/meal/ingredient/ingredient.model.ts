export class IngredientModel {
  public id: string;
  public name: string;
  public calories: number;

  constructor(id: string, name: string, calories: number) {
    this.name = name;
    this.calories = calories;
    this.id = id;
  }
}
