import { Observable, of } from "rxjs";
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Store } from "@ngrx/store";
import * as fromAppStore from "../store/app.reducer";
import * as RecipesActions from "./store/recipes.actions";
import { Actions, ofType } from "@ngrx/effects";
import { take, map, switchMap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class RecipeResolverService implements Resolve<Recipe[]> {
  constructor(
    private store: Store<fromAppStore.AppState>,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    return this.store.select("recipes").pipe(
      take(1),
      map((recipesState) => {
        return recipesState.recipes;
      }),
      switchMap((recipes) => {
        if (recipes.length === 0) {
          this.store.dispatch(new RecipesActions.FetchRecipes());
          //The code above will fetch the recipes but the code below will wait until they have been set before it loads the page. take(1) completes the observable. first() can also be used because it works exactly as take(1)
          //We are waiting for the effects that is triggered by the action fetch recipes which is set recipes to complete
          return this.actions$.pipe(
            ofType(RecipesActions.SET_RECIPES),
            take(1)
          );
        } else {
          return of(recipes);
        }
      })
    );
  }
}
