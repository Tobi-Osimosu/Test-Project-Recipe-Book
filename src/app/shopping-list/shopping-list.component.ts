import { slideInOut } from "./../animations/slideInOut.animation";
import { ShoppingListService } from "./shopping-list.service";
import { Ingredient } from "./../shared/ingredient.model";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Observable, of } from "rxjs";
import { Store } from "@ngrx/store";
import * as ShoppingListActions from "./store/shopping-list.actions";
import * as fromAppStore from "../store/app.reducer";
import { map } from "rxjs/operators";

@Component({
  selector: "app-shopping-list",
  templateUrl: "./shopping-list.component.html",
  styleUrls: ["./shopping-list.component.css"],
  animations: [slideInOut],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  //ingredients: Observable<{ ingredients: Ingredient[] }>;
  shoppingListState: Observable<{ ingredients: Ingredient[] }>;
  private igChangeSub: Subscription;

  constructor(
    private slService: ShoppingListService,
    private store: Store<fromAppStore.AppState>
  ) {}

  ngOnInit() {
    this.shoppingListState = this.store.select("shoppingList");

    // this.ingredients = this.slService.getingredients();
    // this.igChangeSub = this.slService.ingredientsChanged.subscribe(
    //   (ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   }
    // );
  }

  onEditItem(index: number) {
    //this.slService.startedEditting.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy() {
    //this.igChangeSub.unsubscribe();
  }
}
