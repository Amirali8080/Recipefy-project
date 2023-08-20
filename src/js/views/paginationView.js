import View from "./View";
import icons from "url:../../img/icons.svg";

class paginationView extends View {
  _parentEl = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }
  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupButtonNext(currentPage);
    }

    // last page
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupButtonPrev(currentPage);
    }
    // other page
    if (currentPage < numPages) {
      const next = this._generateMarkupButtonNext(currentPage);
      const prev = this._generateMarkupButtonPrev(currentPage);
      return [next, prev];
    }
    // page 1, and there are no other pages
    if (numPages === 1) return "";
  }

  _generateMarkupButtonPrev(cur) {
    return `
        <button data-goto=${cur - 1} class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${cur - 1}</span>
        </button>
    `;
  }
  _generateMarkupButtonNext(cur) {
    return `
        <button data-goto=${cur + 1} class="btn--inline pagination__btn--next">
            <span>Page ${cur + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
  }
}

export default new paginationView();
