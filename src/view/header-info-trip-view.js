import AbstractView from '../framework/view/abstract-view.js';
import { transformToTimeToFormatReverse } from '../utils/utils.js';

function transformHeaderDateFormat(from, to) {
  const dateStart = transformToTimeToFormatReverse(from);
  const dateEnd = transformToTimeToFormatReverse(to);
  return `${dateStart} - ${dateEnd}`;
}

function formatRoute(cities) {
  if (cities.length > 3) {
    return `${cities[0]} — ... — ${cities[cities.length - 1]}`;
  } else {
    return cities.join(' — ');
  }
}

function createHeaderInfoTripTemplate(dateFrom, dateTo, destinations, totalCost) {
  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${formatRoute(destinations)}</h1>
    <p class="trip-info__dates">${transformHeaderDateFormat(dateFrom, dateTo)}</p>
  </div>
  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
  </p>
</section>`;
}

export default class HeaderInfoTripView extends AbstractView {
  #destinations = null;
  #dateFrom = null;
  #dateTo = null;
  #totalCost = null;

  constructor(dateFrom, dateTo, destinations, totalCost) {
    super();
    this.#dateFrom = dateFrom;
    this.#dateTo = dateTo;
    this.#destinations = destinations;
    this.#totalCost = totalCost;
  }

  get template() {
    return createHeaderInfoTripTemplate(this.#dateFrom, this.#dateTo, this.#destinations, this.#totalCost);
  }
}
