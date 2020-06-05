import { HttpClient } from "@angular/common/http";
import { switchMap, map, tap, withLatestFrom } from "rxjs/operators";
import { Effect, ofType, Actions } from "@ngrx/effects";
import * as RecipeActions from "./recipes.actions";
import { Recipe } from "../recipe.model";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromAppStore from "../../store/app.reducer";

@Injectable()
export class RecipeEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromAppStore.AppState>
  ) {}

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http
        .get<Recipe[]>("https://recipe-book-c7ddf.firebaseio.com/recipes.json")
        .pipe(
          //Incase there is a recipe without an ingredient, an empty array will be given to it
          map((recipes) => {
            return recipes.map((recipe) => {
              return {
                ...recipe,
                ingredients: recipe.ingredients ? recipe.ingredients : [],
              };
            });
          }),
          map((recipes) => {
            return new RecipeActions.SetRecipes(recipes);
          })
        );
    })
  );

  //This is my solution without withLatestFrom
  // @Effect()
  // storeRecipes = this.actions$.pipe(
  //   ofType(RecipeActions.STORE_RECIPES),
  //   switchMap(() => {
  //     return this.store.select("recipes").pipe(
  //       map((recipeState) => {
  //         return recipeState.recipes;
  //       }),
  //       map((recipes) => {
  //         return this.http
  //           .put(
  //             "https://recipe-book-c7ddf.firebaseio.com/recipes.json",
  //             recipes
  //           )
  //           .subscribe();
  //       })
  //     );
  //   })
  // );

  @Effect({ dispatch: false })
  storeRecipes = this.actions$.pipe(
    ofType(RecipeActions.STORE_RECIPES),
    //To get store data from effects, use withLatestfrom
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put(
        "https://recipe-book-c7ddf.firebaseio.com/recipes.json",
        recipesState.recipes
      );
    })
  );
}
