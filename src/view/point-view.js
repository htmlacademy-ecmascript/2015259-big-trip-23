import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { calculateDurationOfStay, transformToTimeToFormat, transformToDateFromFormat, formatDurationToTwoCharacters } from '../utils/utils.js';

dayjs.extend(duration);

function renderPointOffers(offers) {
  return offers.map(({ price, title }) => `
      <li class="event__offer">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
      </li>
  `).join('');
}

function createPointTemplate(point, destinations, offers) {
  const pointDestination = destinations?.find((dest) => dest.id === point.destination);
  const typeOffers = offers.find((offer) => offer.type === point.type)?.offers || [];
  const filteredPointOffers = typeOffers.filter((offer) => point.offers.includes(offer.id));

  const durationOfStay = calculateDurationOfStay(point.dateTo, point.dateFrom);
  const daysDuration = Math.trunc(durationOfStay.asDays());
  const durationOfStayFormat = `${durationOfStay.days() > 0 ? `${formatDurationToTwoCharacters(daysDuration)}D` : ''} ${formatDurationToTwoCharacters(durationOfStay.hours())}H ${formatDurationToTwoCharacters(durationOfStay.minutes())}M`;

  return `

     <li class="trip-events__item">
        <div class="event">
            <time class="event__date" datetime="${transformToDateFromFormat(point.dateFrom)}">${transformToDateFromFormat(point.dateFrom)}</time>
            <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
            </div>
            <h3 class="event__title">${point.type} ${pointDestination.name}</h3>
            <div class="event__schedule">
                <p class="event__time">
                    <time class="event__start-time" datetime="${point.dateFrom}">${transformToTimeToFormat(point.dateFrom)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${point.dateTo}">${transformToTimeToFormat(point.dateTo)}</time>
                </p>
                <p class="event__duration">${durationOfStayFormat}</p>
            </div>
            <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
            </p>
            <h4 class="visually-hidden">Offers:</h4>
            <ul class="event__selected-offers">
                ${renderPointOffers(filteredPointOffers)}
            </ul>
            <button class="event__favorite-btn ${point.isDisabled ? 'disabled' : ''} ${point.isFavorite ? 'event__favorite-btn--active' : ''}"  type="button">
                <span class="visually-hidden">Add to favorite</span>
                <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                </svg>
            </button>
            <button class="event__rollup-btn" ${point.isDisabled ? 'disabled' : ''} type="button">
                <span class="visually-hidden">Open event</span>
            </button>
        </div>
     </li>

    `;
}

export default class PointView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #editButtonClickHandler = null;
  #handleFavoriteClick = null;

  constructor({ point, boardDestinations, boardOffers, onEditClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#destinations = boardDestinations;
    this.#offers = boardOffers;
    this.#editButtonClickHandler = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler.bind(this));
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler.bind(this));
  }

  get template() {
    return createPointTemplate(this.#point, this.#destinations, this.#offers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#editButtonClickHandler();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
