import FormView from '../view/form-view.js';
import PointView from '../view/point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { ModeType } from '../const.js';
import { UserAction, UpdateType } from '../const.js';
import { isDatesSame } from '../utils/utils.js';

export default class PointPresenter {
  #boardContainer = null; // Контейнер для отображения точки
  #pointComponent = null; // Компонент точки
  #pointEditComponent = null; // Компонент формы редактирования точки
  #dataChangeHandler = null;
  #boardOffers = null; // Предложения на доске
  #boardDestinations = null; // Места на доске
  #point = null; // Текущая точка
  #modeChangeHandler = null; // Функция для обработки изменения режима
  #modeType = ModeType.VIEWING; // Режим по умолчанию

  constructor(boardContainer, onDataChange, point, boardDestinations, boardOffers, onModeChange) {
    // Конструктор принимает контейнер, функцию для обработки избранного, точку, места и предложения на доске, а также функцию для обработки изменения режима
    this.#boardContainer = boardContainer;
    this.#dataChangeHandler = onDataChange;
    this.#point = point;
    this.#boardDestinations = boardDestinations;
    this.#boardOffers = boardOffers;
    this.#modeChangeHandler = onModeChange;
  }

  init() {
    // Метод для инициализации
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;
    this.#pointComponent = new PointView({
      // Создаем новый компонент точки
      point: this.#point,
      boardDestinations: this.#boardDestinations,
      boardOffers: this.#boardOffers,
      onEditClick: this.#editClickHandler, // Обработчик клика по кнопке редактирования
      onFavoriteClick: this.#toggleFavoriteStateHandler, // Обработчик клика по кнопке избранного
      mode: this.#modeType
    });

    this.#pointEditComponent = new FormView({
      // Создаем новый компонент формы редактирования точки
      point: { ...this.#point },
      boardDestinations: this.#boardDestinations,
      boardOffers: this.#boardOffers,
      onFormSubmit: this.#formSubmitHandler, // Обработчик отправки формы
      onCloseForm: this.#buttonCloseHandler, //Обработчик закрытия формы
      onDeleteClick: this.#deleteClickHandler,
      mode: this.#modeType
    });
    if (prevPointComponent === null || prevPointEditComponent === null) {
      // Если компоненты точки или формы редактирования не существуют
      render(this.#pointComponent, this.#boardContainer); // Рендерим компонент точки в контейнер
      return;
    }

    if (this.#modeType === ModeType.VIEWING) {
      // Если режим по умолчанию
      replace(this.#pointComponent, prevPointComponent); // Заменяем компонент точки на новый
    }

    if (this.#modeType === ModeType.EDITING) {
      // Если режим редактирования
      replace(this.#pointComponent, prevPointEditComponent); // Заменяем компонент формы редактирования на новый
      this.#modeType = ModeType.VIEWING;
    }

    remove(prevPointComponent); // Удаляем предыдущий компонент точки
    remove(prevPointEditComponent); // Удаляем предыдущий компонент формы редактирования
  }

  destroy() {
    // Метод для уничтожения
    remove(this.#pointComponent); // Удаляем компонент точки
    remove(this.#pointEditComponent); // Удаляем компонент формы редактирования
  }

  resetView() {
    // Метод для сброса отображения
    if (this.#modeType !== ModeType.VIEWING) {
      // Если режим не по умолчанию
      this.#pointEditComponent.reset(); // Сбрасываем данные формы редактирования точки до исходного состояни
      this.#replaceFormToPoint(); // Заменяем форму редактирования на отображение точки
    }
  }

  setSaving() {
    if (this.#modeType === ModeType.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#modeType === ModeType.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#modeType === ModeType.VIEWING) {
      this.#pointComponent?.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent?.shake(resetFormState);
  }

  #buttonCloseHandler = () => {
    //Обработчик клика по кнопке закрытия
    this.#pointEditComponent.reset(this.#point); //Сбрасываем данные формы редактирования
    this.#replaceFormToPoint(); // Заменяем форму редактирования на отображение точки
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point); // Сбрасываем данные формы редактирования
      this.#replaceFormToPoint(); // Заменяем форму на точку
    }
  };

  #replacePointToForm() {
    // Метод для замены точки на форму редактирования
    replace(this.#pointEditComponent, this.#pointComponent); // Заменяем компонент точки на компонент формы редактирования
    document.addEventListener('keydown', this.#escKeyDownHandler); // Добавляем обработчик нажатия клавиши Escape
    this.#modeChangeHandler(); // Обрабатываем изменение режима
    this.#modeType = ModeType.EDITING; // Устанавливаем режим редактирования
  }

  #replaceFormToPoint() {
    // Метод для замены формы на точку
    replace(this.#pointComponent, this.#pointEditComponent); // Заменяем компонент формы редактирования на компонент точки
    document.removeEventListener('keydown', this.#escKeyDownHandler); // Удаляем обработчик нажатия клавиши Escape
    this.#modeType = ModeType.VIEWING; // Устанавливаем режим по умолчанию
  }

  #editClickHandler = () => {
    // Обработчик клика по кнопке редактирования
    this.#replacePointToForm(); // Заменяем точку на форму редактирования
    this.#pointEditComponent.reset(this.#point);
  };

  #formSubmitHandler = (update) => {
    // Обработчик отправки формы
    const isMinorUpdate = (
      !isDatesSame(this.#point.dateFrom, update.dateFrom) ||
      !isDatesSame(this.#point.dateTo, update.dateTo) ||
      this.#point.basePrice !== update.basePrice
    );

    this.#dataChangeHandler(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  };

  #deleteClickHandler = (point) => {
    this.#dataChangeHandler(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #toggleFavoriteStateHandler = () => {
    // Обработчик переключения состояния избранного
    this.#dataChangeHandler(UserAction.UPDATE_POINT,
      UpdateType.MINOR, { ...this.#point, isFavorite: !this.#point.isFavorite }
    ); // Обрабатываем изменение избранного
  };
}
