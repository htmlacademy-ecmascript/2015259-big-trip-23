import { SORTS } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { transformDate } from '../utils/utils.js';

const sortsNames = Object.values(SORTS);

function renderSortItem(sort, index, currentSortType) {
  return `
      <div class="trip-sort__item trip-sort__item--${sort}">
          <input
              id="sort-${sort}"
              class="trip-sort__input visually-hidden"
              type="radio"
              name="trip-sort"
              value="sort-${sort}"
              ${sort === 'offers' || sort === 'event' ? 'disabled' : ''}
              ${currentSortType === sortsNames[index] ? 'checked' : ''}
              data-sort-type="${sortsNames[index]}"
          >
          <label class="trip-sort__btn" for="sort-${sort}">${transformDate(sort)}</label>
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

    this.element.addEventListener('change', this.#sortTypeChangeHandler.bind(this));
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT' || evt.target.dataset.sortType === 'offers' || evt.target.dataset.sortType === 'event') {
      return;
    }

    this.#handleSortTypeChange(evt.target.dataset.sortType);
  }
}
