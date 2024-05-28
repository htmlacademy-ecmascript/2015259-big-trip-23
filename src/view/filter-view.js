import { FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { transformDate } from '../utils/utils.js';

const filtersNames = Object.values(FilterType);

function renderFilterItem(filter, index, currentFilterType) {
  const { type, count } = filter;
  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${count === 0 ? 'disabled' : ''}
        ${currentFilterType === type ? 'checked' : ''}
        data-filter-type="${filtersNames[index]}"
      >
      <label
        class="trip-filters__filter-label"
        for="filter-${type}"
        ${count === 0 ? 'disabled' : ''}
      >
        ${transformDate(type)}
      </label>
    </div>
  `;
}

function createFilterTemplate(filters, currentFilterType) {
  const filtersMarkup = filters.map((filter, index) => renderFilterItem(filter, index, currentFilterType)).join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Применить фильтр</button>
    </form>
  `;
}

export default class FilterView extends AbstractView {
  #filters = {};
  #handleFilterTypeChange = null;
  #currentFilter = null;

  constructor({ filters, onFilterTypeChange, currentFilterType }) {
    super();

    this.#filters = filters;
    this.#handleFilterTypeChange = onFilterTypeChange;
    this.#currentFilter = currentFilterType;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.getAttribute('disabled') === '' || evt.target.tagName !== 'INPUT') {
      return;
    }
    this.#handleFilterTypeChange(evt.target.dataset.filterType);
  };
}
