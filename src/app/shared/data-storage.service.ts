import { AuthService } from "./../auth/auth.service";
import { Recipe } from "./../recipes/recipe.model";
import { RecipeService } from "./../recipes/recipe.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Store } from '@ngrx/store';
import * as fromAppStore from "../store/app.reducer"
import * as RecipesAction from "../recipes/store/recipes.actions";

@Injectable()
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private store: Store<fromAppStore.AppState>
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put("https://recipe-book-c7ddf.firebaseio.com/recipes.json", recipes)
      .subscribe();
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>("https://recipe-book-c7ddf.firebaseio.com/recipes.json")
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          //this.recipeService.setRecipes(recipes);
          this.store.dispatch(new RecipesAction.SetRecipes(recipes))
        })
      );
  }
}
