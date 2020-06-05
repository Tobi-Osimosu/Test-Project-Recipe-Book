import { Recipe } from "../recipe.model";
import * as RecipesActions from "./recipes.actions";

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [],
};

export function recipeReducer(
  state = initialState,
  action: RecipesActions.RecipesActions
) {
  switch (action.type) {
    case RecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload],
      };
    case RecipesActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload],
      };
    case RecipesActions.UPDATE_RECIPE:
      const recipes = [...state.recipes];
      const specificRecipe = state.recipes[action.payload.id];
      const updatedRecipe = {
        ...specificRecipe,
        ...action.payload.newRecipe,
      };
      recipes[action.payload.id] = updatedRecipe;
      return {
        ...state,
        recipes: recipes,
      };
    case RecipesActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, recipeIndex) => {
          return recipeIndex !== action.payload;
        }),
      };
    default:
      return state;
  }
}
