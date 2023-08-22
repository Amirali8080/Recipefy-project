import { async } from "regenerator-runtime";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

//////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //  0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // bookmarksView.update(model.state.bookmarks);
    //  1) loading recipe
    await model.loadRecipe(id);
    //  2) render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) load search query
    await model.loadSearchResult(query);

    // 3) render results
    resultsView.render(model.getSearchResultsPage());

    // 4) render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};
const controlPagination = function (goToPage) {
  // 1) render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newSevings) {
  // Update recipe servings (in state)
  model.updateServings(newSevings);
  // Update recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add or Delete bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  // Update recipe view
  recipeView.update(model.state.recipe);
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // Render recipe
    recipeView.render(model.state.recipe);
    // success message
    addRecipeView.renderMessage();
    // Render bookmarks view
    bookmarksView.render(model.state.bookmarks);
    //Change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    // close form window
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, 2500);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
