import { remove, render } from '../framework/render.js';
import { UserAction, UpdateType, ModeType, NEW_POINT, RenderPosition } from '../const.js';
import FormView from '../view/form-view.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #dataChangeHandler = null;
  #destroyHandler = null;
  #pointEditComponent = null;
  #pointsModel = null;

  constructor({ boardContainer, onDataChange, onDestroy, pointsModel }) {
    this.#pointListContainer = boardContainer;
    this.#dataChangeHandler = onDataChange;
    this.#destroyHandler = onDestroy;
    this.#pointsModel = pointsModel;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new FormView({
      point: NEW_POINT,
      boardDestinations: this.#pointsModel.destinations,
      boardOffers: this.#pointsModel.offers,
      onFormSubmit: this.#formSubmitHandler,
      onDeleteClick: this.#deleteClickHandler,
      onCloseForm: this.#deleteClickHandler,
      mode: ModeType.CREATE_NEW
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#destroyHandler();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent?.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent?.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent?.shake(resetFormState);
  }

  #formSubmitHandler = (point) => {
    this.setSaving();

    this.#dataChangeHandler(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    )
      .then((result) => {
        if (!result) {
          throw new Error('Update failed');
        }
        this.destroy();
      })
      .catch(() => {
        this.setAborting();
      });
  };

  #deleteClickHandler = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
