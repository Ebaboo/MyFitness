import { Component, OnDestroy, OnInit } from '@angular/core';
import { IngredientModel } from '../ingredient.model';
import { IngredientService } from '../ingredient.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.css']
})
export class IngredientListComponent implements OnInit, OnDestroy {
  ingredients: IngredientModel[];
  searchStr = '';
  subscription: Subscription;

  constructor(private ingredientService: IngredientService) { }

  ngOnInit() {
    this.subscription =  this.ingredientService.ingredientsChanged.subscribe(
      (ingredients: IngredientModel[]) => {
        this.ingredients = ingredients;
      }
    );
    this.ingredients = this.ingredientService.getIngredients();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
