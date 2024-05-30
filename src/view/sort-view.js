import { SORTS } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { capitalizeFirstLetter } from '../utils/utils.js';


function renderSortItem(sort, currentSortType) {
  return `
      <div class="trip-sort__item trip-sort__item--${sort}">
          <input
              id="sort-${sort}"
              class="trip-sort__input visually-hidden"
              type="radio"
              name="trip-sort"
              value="sort-${sort}"
              ${sort === 'offers' || sort === 'event' ? 'disabled' : ''}
              ${currentSortType === sort ? 'checked' : ''}
              data-sort-type="${sort}"
          >
          <label class="trip-sort__btn" for="sort-${sort}">${capitalizeFirstLetter(sort)}</label>
      </div>
  `;
}

function createSortTemplate(currentSortType) {
  const sortsMarkup = SORTS.map((sort, index) => renderSortItem(sort, index, currentSortType)).join('');
  return `
    <form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${sortsMarkup}
    </form>`;
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({ onSortTypeChange, currentSortType }) {
    super();

    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    const { sortType } = evt.target.dataset;
    if (evt.target.tagName === 'INPUT' && sortType !== 'offers' && sortType !== 'event') {

      this.#handleSortTypeChange(sortType);
    }
  };
}
