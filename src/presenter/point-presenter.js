import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { ModeType } from '../const.js';

export default class PointPresenter {
  #boardContainer = null; // Контейнер для отображения точки
  #pointComponent = null; // Компонент точки
  #pointEditComponent = null; // Компонент формы редактирования точки
  #handleFavotiteChange = null; // Функция для обработки изменения избранного
  #boardOffers = null; // Предложения на доске
  #boardDestinations = null; // Места на доске
  #point = null; // Текущая точка
  #handleModeChange = null; // Функция для обработки изменения режима
  #mode = ModeType.DEFAULT; // Режим по умолчанию

  constructor(boardContainer, onFavoriteChange, point, boardDestinations, boardOffers, onModeChange) {
    // Конструктор принимает контейнер, функцию для обработки избранного, точку, места и предложения на доске, а также функцию для обработки изменения режима
    this.#boardContainer = boardContainer;
    this.#handleFavotiteChange = onFavoriteChange;
    this.#point = point;
    this.#boardDestinations = boardDestinations;
    this.#boardOffers = boardOffers;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    // Метод для инициализации
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;
    this.#pointComponent = new PointView({
      // Создаем новый компонент точки
      point: this.#point,
      boardDestinations: this.#boardDestinations,
      boardOffers: this.#boardOffers,
      onEditClick: this.#editClickHandler, // Обработчик клика по кнопке редактирования
      onFavoriteClick: this.#toggleFavoriteStateHandler, // Обработчик клика по кнопке избранного
    });

    this.#pointEditComponent = new EditFormView({
      // Создаем новый компонент формы редактирования точки
      point: { ...this.#point },
      boardDestinations: this.#boardDestinations,
      boardOffers: this.#boardOffers,
      onFormSubmit: this.#handleFormSubmit // Обработчик отправки формы
    });
    if (prevPointComponent === null || prevPointEditComponent === null) {
      // Если компоненты точки или формы редактирования не существуют
      render(this.#pointComponent, this.#boardContainer); // Рендерим компонент точки в контейнер
      return;
    }

    if (this.#mode === ModeType.DEFAULT) {
      // Если режим по умолчанию
      replace(this.#pointComponent, prevPointComponent); // Заменяем компонент точки на новый
    }

    if (this.#mode === ModeType.EDITING) {
      // Если режим редактирования
      replace(this.#pointEditComponent, prevPointEditComponent); // Заменяем компонент формы редактирования на новый
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
    if (this.#mode !== ModeType.DEFAULT) {
      // Если режим не по умолчанию
      this.#replaceFormToPoint(); // Заменяем форму на точку
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint(); // Заменяем форму на точку
    }
  };

  #replacePointToForm() {
    // Метод для замены точки на форму редактирования
    replace(this.#pointEditComponent, this.#pointComponent); // Заменяем компонент точки на компонент формы редактирования
    document.addEventListener('keydown', this.#escKeyDownHandler); // Добавляем обработчик нажатия клавиши Escape
    this.#handleModeChange(); // Обрабатываем изменение режима
    this.#mode = ModeType.EDITING; // Устанавливаем режим редактирования
  }

  #replaceFormToPoint() {
    // Метод для замены формы на точку
    replace(this.#pointComponent, this.#pointEditComponent); // Заменяем компонент формы редактирования на компонент точки
    document.removeEventListener('keydown', this.#escKeyDownHandler); // Удаляем обработчик нажатия клавиши Escape
    this.#mode = ModeType.DEFAULT; // Устанавливаем режим по умолчанию
  }

  #editClickHandler = () => {
    // Обработчик клика по кнопке редактирования
    this.#replacePointToForm(); // Заменяем точку на форму редактирования
  };

  #handleFormSubmit = (point) => {
    // Обработчик отправки формы
    this.#handleFavotiteChange(point); // Обрабатываем изменение избранного
    this.#replaceFormToPoint(); // Заменяем форму на точку
  };

  #toggleFavoriteStateHandler = () => {
    // Обработчик переключения состояния избранного
    this.#handleFavotiteChange({ ...this.#point, isFavorite: !this.#point.isFavorite }); // Обрабатываем изменение избранного
  };
}
