import { RecipeService } from "./../recipe.service";
import { Recipe } from "./../recipe.model";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromAppStore from "../../store/app.reducer";
import * as RecipesActions from "../store/recipes.actions";
import * as ShoppingListActions from "../../shopping-list/store/shopping-list.actions";
import { map } from "rxjs/operators";

@Component({
  selector: "app-recipe-detail",
  templateUrl: "./recipe-detail.component.html",
  styleUrls: ["./recipe-detail.component.css"],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromAppStore.AppState>
  ) {}

  ngOnInit() {
    this.store
      .select("recipes")
      .pipe(
        map((recipesState) => {
          return recipesState.recipes;
        })
      )
      .subscribe((recipes) => {
        this.route.params.subscribe((params: Params) => {
          this.id = +params["id"];
          this.recipe = recipes[this.id];
        });
      });
    // this.route.params.subscribe((params: Params) => {
    //   this.id = +params["id"];
    //   this.recipe = this.recipeService.getRecipe(this.id);
    // });
  }

  onAddToShoppingList() {
    //this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(
      new ShoppingListActions.AddIngredients(this.recipe.ingredients)
    );
  }

  onEditRecipe() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    //this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    this.router.navigate(["../"], { relativeTo: this.route });
  }
}
