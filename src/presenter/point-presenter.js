import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import { render, replace } from '../framework/render.js';

export default class PointPresenter {
  #boardContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;

  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init(point, boardDestinations, boardOffers) {
    this.#pointComponent = new PointView({
      point,
      boardDestinations,
      boardOffers,
      onEditClick: this.#handleEditClick
    });

    this.#pointEditComponent = new EditFormView({
      point,
      boardDestinations,
      boardOffers,
      onFormSubmit: this.#handleFormSubmit
    });
    render(this.#pointComponent, this.#boardContainer);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
  };
}
