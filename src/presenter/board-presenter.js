import SortView from '../view/sort-view.js';
import InfoTripView from '../view/info-trip-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import FilterPresenter from './filter-presenter.js';
import { render, remove } from '../framework/render.js';
import { SortType, FilterType, UpdateType, UserAction } from '../const.js';
import { sortPointsByDay, sortPointsByTime, sortPointsByPrice } from '../utils/sort.js';
import { filterByFuture, filterByPast, filterByPresent, filtersGenerateInfo } from '../utils/filter.js';

const infoTripElement = document.querySelector('.trip-main');

export default class BoardPresenter {
  #boardContainer = null; // Контейнер для отображения списка точек маршрута
  #pointsModel = null; // Модель данных о точках маршрута
  #filterModel = null; // Фильтры для точек маршрута
  #sortComponent = null; // Компонент для сортировки точек маршрута
  #pointPresenters = new Map(); // Презентеры точек маршрута
  #currentSortType = SortType.DAY; // Текущий тип сортировки

  constructor({ boardContainer, pointsModel, filterModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderBoard();
    this.#renderFilters();// Отображение фильтров
    render(new InfoTripView(), infoTripElement, 'afterbegin'); // Отображение информации о поездке
  }

  // Получение отсортированного списка точек маршрута
  get points() {
    const points = this.#filterPoints(this.#pointsModel.points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...points].sort(sortPointsByTime);
      case SortType.PRICE:
        return [...points].sort(sortPointsByPrice);
      case SortType.DAY:
        return [...points].sort(sortPointsByDay);
      default:
        return [...points].sort(sortPointsByDay);
    }
  }

  #filterPoints(points) {
    const filterType = this.#filterModel.filter;
    const filteredPoints = filtersGenerateInfo[filterType](points);

    switch (filterType) {
      case FilterType.FUTURE:
        return filterByFuture(filteredPoints);
      case FilterType.PAST:
        return filterByPast(filteredPoints);
      case FilterType.PRESENT:
        return filterByPresent(filteredPoints);
      case FilterType.EVERYTHING:
        return filteredPoints;
      default:
        return filteredPoints;
    }
  }

  // Отображение списка точек маршрута
  #renderBoard() {
    const boardDestinations = this.#pointsModel.destinations; // Получение списка пунктов назначения
    const boardOffers = this.#pointsModel.offers; // Получение списка дополнительных опций
    const points = this.points;

    if (this.#pointsModel.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();

    // Для каждой точки маршрута отображается соответствующий компонент
    points.forEach((point) => {
      this.#renderPoint(point, boardDestinations, boardOffers);
    });
  }

  // Обработка изменения режима представления
  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderFilters() {
    const siteHeaderElement = document.querySelector('.trip-controls__filters');
    const filterPresenter = new FilterPresenter({
      filterContainer: siteHeaderElement,
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel,
    });

    filterPresenter.init();
  }

  // Отображение точки маршрута
  #renderPoint(point, boardDestinations, boardOffers) {
    const pointPresenter = new PointPresenter(
      this.#boardContainer,
      this.#handleViewAction,
      point,
      boardDestinations,
      boardOffers,
      this.#handleModeChange
    );
    pointPresenter.init();
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  // Отображение сообщения о отсутствии точек маршрута
  #renderNoPoints() {
    render(new NoPointView(), this.#boardContainer);
  }

  // Отображение компонента сортировки
  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer);
  }

  // Обработка изменения типа сортировки
  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType; // Сортировка точек маршрута
    this.#clearBoard({ resetRenderedTaskCount: true }); // Очистка списка точек маршрута
    this.#renderBoard(); // Повторное отображение списка точек маршрута
  };

  #clearBoard({ resetSortType = false } = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  // Обработка пользовательских действий
  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update); // Обновление данных точки маршрута
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update); // Добавление новой точки маршрута
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update); // Удаление точки маршрута
        break;
    }
  };

  // Обработка событий модели
  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        //обновление части списка (например, когда поменялось описание)
        if (this.#pointPresenters.has(data.id)) {
          this.#pointPresenters.get(data.id).init(data);
        }
        break;
      case UpdateType.MINOR:
        //обновление списока (например, когда задача ушла в архив)
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        //обновление всей доски (например, при переключении фильтра)
        this.#clearBoard({ resetSortType: true });
        this.#currentSortType = SortType.DAY;
        this.#renderBoard();
        break;
    }
  };
}
