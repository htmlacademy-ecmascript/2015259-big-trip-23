import { CITIES, POINT_TYPES, TIME_FORMAT, FULL_DATE_FORMAT } from '../const.js';
import { transformDate, formatDateInForm } from '../utils.js';
import { createElement } from '../render.js';

function createEditFormTemplate(point, destinations, offers) {
  const {
    basePrice: price,
    dateFrom: dateFrom,
    dateTo: dateTo,
    destination,
    type: offerType,
    offers: offersList,
    id,
  } = point;
  const pointDestination = destinations.find((dest) => dest?.id === destination);
  const typeOffers = offers.find((offer) => offer?.type === offerType).offers;
  const pointOffers = typeOffers.filter((typeOffer) => offersList.includes(typeOffer?.id));
  return (
    `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${offerType}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${POINT_TYPES.map((type) => `
                <div class="event__type-item">
                  <input
                    id="event-type-${type}-${id}"
                    class="event__type-input
                    visually-hidden"
                    type="radio"
                    name="event-type"
                    value="${type}"
                    ${offerType === type ? 'checked' : ''}
                  >
                  <label
                    class="event__type-label
                    event__type-label--${type}"
                    for="event-type-${type}-${id}"
                  >${transformDate(type)}</label>
                </div>`).join('')}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
          ${transformDate(offerType)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination-${id}" value="${pointDestination?.name}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
          ${CITIES.map((city) => `
          <option value=${city}></option>
        `).join('')}
          </datalist>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${formatDateInForm(dateFrom, FULL_DATE_FORMAT)} ${formatDateInForm(dateFrom, TIME_FORMAT)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${formatDateInForm(dateTo, FULL_DATE_FORMAT)} ${formatDateInForm(dateTo, TIME_FORMAT)}">
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
      ${typeOffers.length !== 0 ? `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${typeOffers.map((typeOffer) => `
          <div class="event__offer-selector">
            <input
              class="event__offer-checkbox
              visually-hidden"
              id="event-offer-${typeOffer.title}-${id}"
              type="checkbox"
              name="event-offer-${typeOffer.title}"
              ${pointOffers.includes(typeOffer) ? 'checked' : ''}
            >
            <label class="event__offer-label" for="event-offer-${typeOffer.title}-${id}">
              <span class="event__offer-title">${typeOffer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${typeOffer.price}</span>
            </label>
          </div>`).join('')}
          </div>
        </section>` : ''}
        ${pointDestination.description === '' && pointDestination.pictures.length === 0 ? '' : `
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${pointDestination.description}</p>
          ${pointDestination.pictures.length !== 0 ? `
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${pointDestination.pictures.map((picture) => `<img class="event__photo" src=${picture.src} alt=${picture.description}>`).join('')}
              </div>
            </div>
          ` : ''}
        </section>`}
      </section>
    </form>`
  );
}

export default class EditFormView {
  constructor({ point, boardDestinations, boardOffers }) {
    this.point = point;
    this.destinations = boardDestinations;
    this.offers = boardOffers;
  }

  getTemplate() {
    return createEditFormTemplate(this.point, this.destinations, this.offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
