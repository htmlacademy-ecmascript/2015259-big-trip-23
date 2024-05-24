import { FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { transformDate } from '../utils/utils.js';

const filtersNames = Object.values(FilterType);

function createFilterItemTemplate(filter, index, isChecked) {
  const { type, count } = filter;

  return (
    `<div class="trip-filters__filter">
    <input
      id="filter-${type}"
      class="trip-filters__filter-input visually-hidden"
      type="radio"
      name="trip-filter"
      value="${type}"
      ${isChecked ? 'checked' : ''}
      ${count === 0 ? 'disabled' : ''}
      data-filter-type="${filtersNames[index]}"
    >
    <label class="trip-filters__filter-label" for="filter-${type}" ${count === 0 ? 'disabled' : ''}>
      ${transformDate(type)}
    </label>
  </div>`
  );
}

function createFilterTemplate(filterItems) {
  const filterItemsTemplate = filterItems.map((filter, index) => createFilterItemTemplate(filter, index, index === 0)).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}
export default class FilterView extends AbstractView {
  #filters = {};
  #handleFilterTypeChange = null;

  constructor({filters, onFilterTypeChange}) {
    super();
    this.#filters = filters;

    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.getAttribute('disabled') === '' || evt.target.tagName !== 'INPUT') {
      return;
    }

    this.#handleFilterTypeChange(evt.target.dataset.filterType);
  };
}
