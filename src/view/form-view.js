import { POINT_TYPES, DateFormat, ModeType } from '../const.js';
import { capitalizeFirstLetter, formatDateInForm } from '../utils/utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';

import 'flatpickr/dist/flatpickr.min.css';

// Функция для рендеринга типов точек маршрута
function renderEventTypes(id, offerType) {
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
            ${capitalizeFirstLetter(type)}
          </label>
        </div>
      `
  ).join('');
}

// Функция для рендеринга доступных предложений
function renderOffersTypes(offersTypes, pointOffers, isDisabled) {
  if (!offersTypes || offersTypes.length === 0) {
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
              id="event-offer-${offerType.id}"
              type="checkbox"
              name="event-offer-${offerType.title}"
              ${pointOffers.includes(offerType) ? 'checked' : ''}
              ${isDisabled ? 'disabled' : ''}
            >
            <label class="event__offer-label" for="event-offer-${offerType.id}">
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
function renderEventDestination(pointDest) {
  if (!pointDest || !pointDest.description || pointDest.pictures.length === 0) {
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
const renderCityOptionsList = (destinations) => destinations.map((destination) => `<option value="${destination.name}"></option>`).join('');

// Функция для рендеринга обертки типа маршрута
function renderTypeWrapper(id, routesTypesMarkup, offerType, isDisabled) {
  return `
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${offerType}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
      <div class="event__type-list">
        <fieldset class="event__type-group" ${isDisabled ? 'disabled' : ''}>
          <legend class="visually-hidden">Event type</legend>
          ${routesTypesMarkup}
        </fieldset>
      </div>
    </div>`;
}

// Функция для рендеринга полей события
function renderEventFieldGroups(id, dateFrom, dateTo, basePrice, offerType, pointDestination, destinations, isDisabled) {
  const formatDateTimeForDisplay = (date) => date ? `${formatDateInForm(date, DateFormat.FULL)} ${formatDateInForm(date, DateFormat.TIME)}` : '';

  return `
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label event__type-output" for="event-destination-${id}">
          ${offerType ? capitalizeFirstLetter(offerType) : ''}
        </label>
        <input
          class="event__input event__input--destination"
          id="event-destination-${id}"
          type="text"
          name="event-destination"
          value="${pointDestination?.name || ''}"
          list="destination-list-${id}"
          ${isDisabled ? 'disabled' : ''}
          required
        >
        <datalist id="destination-list-${id}">
          ${renderCityOptionsList(destinations)}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input
          class="event__input event__input--time"
          id="event-start-time-${id}"
          type="text"
          name="event-start-time"
          value="${formatDateTimeForDisplay(dateFrom)}"
          ${isDisabled ? 'disabled' : ''}
          required
        >
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input
          class="event__input event__input--time"
          id="event-end-time-${id}"
          type="text"
          name="event-end-time"
          value="${formatDateTimeForDisplay(dateTo)}"
          ${isDisabled ? 'disabled' : ''}
          required
        >
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input
        class="event__input event__input--price"
        id="event-price-${id}"
        type="number"
        min=1
        pattern="^[ 0-9]+$"
        name="event-price"
        value="${basePrice}"
        ${isDisabled ? 'disabled' : ''}
        required>
      </div>`;
}

// Функция для создания шаблона формы редактирования события
function createEditFormTemplate(point, destinations = [], offers, mode) {
  const {
    basePrice, dateFrom, dateTo, destination,
    type: offerType, offers: offersList,
    id, isDisabled, isSaving, isDeleting,
  } = point;
  const pointDestination = destinations.find((dest) => dest.id === destination);
  const typeOffers = offers.find((offer) => offer?.type === offerType).offers || [];
  const pointOffers = typeOffers.filter((typeOffer) => offersList.includes(typeOffer.id));

  const routesTypesMarkup = renderEventTypes(id, offerType);
  const routesTypesWrapperMarkup = renderTypeWrapper(id, routesTypesMarkup, offerType, isDisabled);
  const offersTypesMarkup = renderOffersTypes(typeOffers, pointOffers, isDisabled);
  const pointDestinationMarkup = renderEventDestination(pointDestination);
  const eventFieldGroupsMarkup = renderEventFieldGroups(id, dateFrom, dateTo, basePrice, offerType, pointDestination, destinations, isDisabled);

  return (
    `<form class="event event--edit" action="#" method="post">
        <header class="event__header">
          ${routesTypesWrapperMarkup}
          ${eventFieldGroupsMarkup}
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isSaving ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${isDeleting ? 'disabled' : ''}>
          ${mode === ModeType.CREATE_NEW ? 'Сancel' : 'Delete'}
          </button>
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
    const form = this.element.querySelector('.event--edit');
    const { dateFrom, dateTo, destination } = this._state;
    if (form.checkValidity() && dateTo !== '' && dateFrom !== '' && destination) {
      this.#handleFormSubmit(FormView.parseStateToPoint(this._state));
    } else {
      this.shake();
    }
  };

  // Установка виджетов выбора даты и времени
  #setDatepicker() {
    this.#dateFrom = flatpickr(
      this.element.querySelector(`#event-start-time-${this.point.id}`),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
        'time_24hr': true,
        maxDate: this._state.dateTo,
      },
    );
    this.#dateTo = flatpickr(
      this.element.querySelector(`#event-end-time-${this.point.id}`),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        'time_24hr': true,
        minDate: this._state.dateFrom,
      },
    );
  }

  // Обработчик изменения начальной даты
  #dateFromChangeHandler = ([selectedDate]) => {
    const newMinDate = dayjs(selectedDate).toISOString();
    this._setState({ dateFrom: newMinDate });
    this.#dateTo.set('minDate', newMinDate);
  };

  // Обработчик изменения конечной даты
  #dateToChangeHandler = ([selectedDate]) => {
    const newMaxDate = dayjs(selectedDate).toISOString();
    this._setState({ dateTo: newMaxDate });
    this.#dateFrom.set('maxDate', newMaxDate);
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
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  // Преобразование состояния представления в данные события
  static parseStateToPoint(state) {
    const states = { ...state };

    delete states.isDisabled;
    delete states.isSaving;
    delete states.isDeleting;

    return states;
  }
}
