import { capitalizeFirstLetter } from '../utils/utils.js';
import AbstractView from '../framework/view/abstract-view.js';

function renderFilterItem(filter, currentFilterType) {
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
        data-filter-type="${type}"
      >
      <label
        class="trip-filters__filter-label"
        for="filter-${type}"
        ${count === 0 ? 'disabled' : ''}
      >
        ${capitalizeFirstLetter(type)}
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
  #filters;
  #filtersTypeChangeHandler;
  #currentFilter;

  constructor({ filters, onFilterTypeChange, currentFilterType }) {
    super();
    this.#filters = filters;
    this.#filtersTypeChangeHandler = onFilterTypeChange;
    this.#currentFilter = currentFilterType;
    this.element.addEventListener('change', this.#filterTypeChangeHandler.bind(this));
    this.updateSelectedFilterButton = this.updateSelectedFilterButton.bind(this);

    const everythingInput = this.element.querySelector('#filter-everything');
    if (everythingInput) {
      everythingInput.checked = true;
    }
  }


  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this.#filtersTypeChangeHandler(evt.target.value);
  };

  updateSelectedFilterButton(filterType) {
    const filter = this.element.querySelector(`#filter-${filterType}`);
    if (filter) {
      filter.checked = true;
    }
  }
}
