import { CITIES, POINT_TYPES, TIME_FORMAT, FULL_DATE_FORMAT, ModeType } from '../const.js';
import { transformDate, formatDateInForm } from '../utils/utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';

import 'flatpickr/dist/flatpickr.min.css';

// Функция для рендеринга типов точек маршрута
function renderRoutesTypes(id, offerType) {
  return POINT_TYPES.map((type) => `
        <div class="event__type-item">
          <input
            id="event-type-${type}-${id}"
            class="event__type-input visually-hidden"
            type="radio"
            name="event-type"
            value="${type}"
            ${offerType === type ? 'checked' : ''}
          >
          <label class="event__type-label event__type-label--${type}" for="event-type-${type}-${id}">
            ${transformDate(type)}
          </label>
        </div>
      `
  ).join('');
}

// Функция для рендеринга доступных предложений
function renderOffersTypes(offersTypes, pointOffers, id) {
  if (offersTypes && offersTypes.length === 0) {
    return '';
  }

  return `
    <section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersTypes.map((offerType) => `
          <div class="event__offer-selector">
            <input
              class="event__offer-checkbox visually-hidden"
              id="event-offer-${offerType.title}-${id}"
              type="checkbox"
              name="event-offer-${offerType.title}"
              ${pointOffers.includes(offerType) ? 'checked' : ''}
            >
            <label class="event__offer-label" for="event-offer-${offerType.title}-${id}">
              <span class="event__offer-title">${offerType.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offerType.price}</span>
            </label>
          </div>
        `).join('')}
      </div>
    </section>`;
}

// Функция для рендеринга информации о месте назначения
function renderPointDestination(id, pointDest) {
  if (!pointDest || !pointDest.description || !pointDest.pictures || pointDest.pictures.length === 0) {
    return '';
  }

  const description = pointDest.description;
  const pictures = pointDest.pictures;

  return `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      ${pictures.length ? `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
          </div>
        </div>
      ` : ''}
    </section>`;
}

// Функция для рендеринга списка городов в поле ввода назначения
const renderCityOptionsList = () => CITIES.map((city) => `<option value="${city}"></option>`).join('');

// Функция для рендеринга обертки типа маршрута
function renderTypeWrapper(id, routesTypesMarkup, offerType) {
  return `
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${offerType}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${routesTypesMarkup}
        </fieldset>
      </div>
    </div>`;
}

// Функция для рендеринга полей события
function renderEventFieldGroups(id, dateFrom, dateTo, basePrice, offerType, pointDestination) {
  return `
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label event__type-output" for="event-destination-${id}">
          ${offerType ? transformDate(offerType) : ''}
        </label>
        <input
          class="event__input event__input--destination"
          id="event-destination-${id}"
          type="text"
          name="event-destination"
          value="${pointDestination?.name || ''}"
          list="destination-list-${id}"
          required
        >
        <datalist id="destination-list-${id}">
          ${renderCityOptionsList(id)}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input
          class="event__input event__input--time"
          id="event-start-time-${id}"
          type="text"
          name="event-start-time"
          value="${formatDateInForm(dateFrom, FULL_DATE_FORMAT)} ${formatDateInForm(dateFrom, TIME_FORMAT)}"
          required
        >
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input
          class="event__input event__input--time"
          id="event-end-time-${id}"
          type="text"
          name="event-end-time"
          value="${formatDateInForm(dateTo, FULL_DATE_FORMAT)} ${formatDateInForm(dateTo, TIME_FORMAT)}"
          required
        >
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input event__input--price" id="event-price-${id}" type="number" min=1 name="event-price" value="${basePrice}" required>
      </div>`;
}

// Функция для создания шаблона формы редактирования события
function createEditFormTemplate(point, destinations = [], offers, mode) {
  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    type: offerType,
    offers: offersList,
    id,
  } = point;
  const pointDestination = destinations.find((dest) => dest.id === destination);
  const typeOffers = offers.find((offer) => offer?.type === offerType).offers;
  const pointOffers = typeOffers.filter((typeOffer) => offersList.includes(typeOffer?.id));

  const routesTypesMarkup = renderRoutesTypes(id, offerType);
  const routesTypesWrapperMarkup = renderTypeWrapper(id, routesTypesMarkup, offerType);
  const offersTypesMarkup = renderOffersTypes(typeOffers, pointOffers, id);
  const pointDestinationMarkup = renderPointDestination(id, pointDestination);
  const eventFieldGroupsMarkup = renderEventFieldGroups(id, dateFrom, dateTo, basePrice, offerType, pointDestination);

  return (
    `<form class="event event--edit" action="#" method="post">
        <header class="event__header">
          ${routesTypesWrapperMarkup}
          ${eventFieldGroupsMarkup}
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${mode === ModeType.CREATE_NEW ? 'Сancel' : 'Delete'}</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersTypesMarkup}
          ${pointDestination ? pointDestinationMarkup : ''}
      </section>
    </form>`
  );
}

// Класс представления формы редактирования события
export default class FormView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleFormClose = null;
  #dateFrom = null;
  #dateTo = null;
  #handleDeleteClick = null;
  #modeType = null;

  constructor({ point, boardDestinations, boardOffers, onFormSubmit, onCloseForm, onDeleteClick, mode }) {
    super();
    this.point = point;
    this.destinations = boardDestinations;
    this.offers = boardOffers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onCloseForm;
    this.#handleDeleteClick = onDeleteClick;
    this.#modeType = mode;
    this._setState(FormView.parsePointToState(point));
    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit')?.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#formCloseHandler);
    this.element.querySelector('.event__save-btn')?.addEventListener('click', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group')?.addEventListener('change', this.#changeTransportTypeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#selectOfferHandler);
    this.element.querySelector('.event__input--price')?.addEventListener('change', this.#priceInputHandler);
    this.element.querySelector('.event__input--destination')?.addEventListener('change', this.#destinationInputHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    this.#setDatepicker();
  }

  get template() {
    return createEditFormTemplate(this._state, this.destinations, this.offers, this.#modeType);
  }

  reset(point) {
    this.updateElement(FormView.parsePointToState(point));
  }

  removeElement() {
    super.removeElement();

    if (this.#dateFrom) {
      this.#dateFrom.destroy();
      this.#dateFrom = null;
    }

    if (this.#dateTo) {
      this.#dateTo.destroy();
      this.#dateTo = null;
    }
  }

  // Обработчик закрытия формы
  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClose();
  };

  // Обработчик удаления события
  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(FormView.parseStateToPoint(this._state));
  };

  // Обработчик отправки формы
  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit({...this._state});
  };

  // Установка виджетов выбора даты и времени
  #setDatepicker() {
    this.#dateFrom = flatpickr(
      this.element.querySelector(`#event-start-time-${this.point.id}`),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.date_from,
        onChange: this.#dateFromChangeHandler,
        ['time_24hr']: true,
        maxDate: this._state.dateTo,
      },
    );
    this.#dateTo = flatpickr(
      this.element.querySelector(`#event-end-time-${this.point.id}`),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.date_to,
        onChange: this.#dateToChangeHandler,
        ['time_24hr']: true
      },
    );
  }

  // Обработчик изменения начальной даты
  #dateFromChangeHandler = ([dateFrom, dateTo]) => {
    this._setState({dateFrom: dayjs(dateFrom).$d.toISOString()});
    this.#dateTo.set('minDate', dayjs(dateFrom).$d.toISOString());
    this.#dateFrom.set({'maxDate': dayjs(dateTo).$d.toISOString()});
  };

  // Обработчик изменения конечной даты
  #dateToChangeHandler = ([dateTo]) => {
    this._setState({dateTo: dayjs(dateTo).$d.toISOString()});
    this.#dateFrom.set({'maxDate': dayjs(dateTo).$d.toISOString()});
  };

  // Обработчик изменения типа транспорта
  #changeTransportTypeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({ type: evt.target.value, offers: [] });
  };

  // Обработчик изменения цены
  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({ basePrice: +evt.target.value });
  };

  // Обработчик выбора предложений
  #selectOfferHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      if (evt.target.checked) {
        this._setState({ offers: [...this._state.offers, evt.target.dataset.offerId] });
      } else {
        this._setState({ offers: this._state.offers.filter((offer) => offer !== evt.target.dataset.offerId) });
      }
    }
  };

  // Обработчик изменения пункта назначения
  #destinationInputHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      const newDestination = this.destinations.find((dest) => dest?.name === evt.target.value);
      if (newDestination) {
        this.updateElement({ destination: newDestination.id });
      }
    }
  };

  // Преобразование данных события в состояние представления
  static parsePointToState(point) {
    return { ...point };
  }

  // Преобразование состояния представления в данные события
  static parseStateToPoint(state) {
    const point = { ...state };

    return point;
  }
}
