import { SORTS } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { transformDate } from '../utils.js';

function renderSortItem(sort, index) {
  return `
      <div class="trip-sort__item trip-sort__item--${sort}">
          <input
              id="sort-${sort}"
              class="trip-sort__input visually-hidden"
              type="radio"
              name="trip-sort"
              value="sort-${sort}"
              ${sort === 'offers' || sort === 'event' ? 'disabled' : ''}
              ${index === 0 ? 'checked' : ''}
          >
          <label class="trip-sort__btn" for="sort-${sort}">${transformDate(sort)}</label>
      </div>
  `;
}

function createSortTemplate() {
  const sortsMarkup = SORTS.map(renderSortItem).join('');
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortsMarkup}
    </form>
  `;
}
export default class SortView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createSortTemplate();
  }
}
