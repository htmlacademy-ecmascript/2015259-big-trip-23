import { remove, render } from '../framework/render.js';
import { nanoid } from 'nanoid';
import { UserAction, UpdateType, ModeType, NEW_POINT, RenderPosition } from '../const.js';
import FormView from '../view/form-view.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointEditComponent = null;
  #boardDestinations = null;
  #boardOffers = null;

  constructor({ boardContainer, onDataChange, onDestroy, boardDestinations, boardOffers }) {
    this.#pointListContainer = boardContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#boardDestinations = boardDestinations;
    this.#boardOffers = boardOffers;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new FormView({
      point: NEW_POINT,
      boardDestinations: this.#boardDestinations,
      boardOffers: this.#boardOffers,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onCloseForm: this.#handleDeleteClick,
      mode: ModeType.CREATE_NEW
    });

    render(this.#pointEditComponent, this.#pointListContainer.querySelector('.trip-events__trip-sort'), RenderPosition.AFTEREND);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      { ...point, id: nanoid() },
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
