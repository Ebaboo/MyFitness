import { Pipe, PipeTransform } from '@angular/core';
import { IngredientModel } from '../day/meal/ingredient/ingredient.model';

@Pipe({
  name: 'searchIngredients',
  pure: false
})
export class SearchIngredientsPipe implements PipeTransform {
  transform(ingredients: IngredientModel[], value: string) {
    return ingredients.filter(
      (ingredient: IngredientModel) => {
        return ingredient.name.toLowerCase().includes(value.toLowerCase());
      }
    );
  }
}
