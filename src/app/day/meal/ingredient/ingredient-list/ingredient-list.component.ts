import { Component, OnInit } from '@angular/core';
import { IngredientModel } from '../ingredient.model';
import { IngredientService } from '../ingredient.service';
@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.css']
})
export class IngredientListComponent implements OnInit {
  ingredients: IngredientModel[];
  searchStr = '';

  constructor(private ingredientService: IngredientService) { }

  ngOnInit() {
    this.ingredientService.ingredientsChanged.subscribe(
      (ingredients: IngredientModel[]) => {
        this.ingredients = ingredients;
      }
    );
    this.ingredients = this.ingredientService.getIngredients();
  }

}
