import { slideInOut } from "./../../animations/slideInOut.animation";
import { tap } from "rxjs/operators";
import { RecipeService } from "./../recipe.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Recipe } from "../recipe.model";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromAppStore from "../../store/app.reducer";
import { map } from "rxjs/operators";
import * as RecipeActions from "../../recipes/store/recipes.actions";

@Component({
  selector: "app-recipe-list",
  templateUrl: "./recipe-list.component.html",
  styleUrls: ["./recipe-list.component.css"],
  animations: [slideInOut],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipeChangeSub: Subscription;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromAppStore.AppState>
  ) {}

  ngOnInit() {
    this.recipeChangeSub = this.store
      .select("recipes")
      .pipe(
        map((recipesState) => {
          return recipesState.recipes;
        })
      )
      .subscribe((recipes) => {
        this.recipes = recipes;
      });

    // this.recipes = this.recipeService.getRecipes();
    // this.recipeChangeSub = this.recipeService.recipesChanged
    //   .subscribe(
    //     (recipes: Recipe[]) => {
    //       this.recipes = recipes;
    //     }
    //   );
  }

  onNewRecipe() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  onFetchData() {
    //this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onSaveData() {
    //this.dataStorageService.storeRecipes();
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  ngOnDestroy() {
    this.recipeChangeSub.unsubscribe();
  }
}
