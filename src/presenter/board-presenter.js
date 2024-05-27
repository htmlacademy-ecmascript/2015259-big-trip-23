import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import InfoTripView from '../view/info-trip-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/utils.js';
import { render } from '../framework/render.js';
import { SortType, FilterType } from '../const.js';
import { sortPointsByDay, sortPointsByTime, sortPointsByPrice } from '../utils/sort.js';
import { filterByFuture, filterByPast, filterByPresent, generateFilter } from '../utils/filter.js';

const infoTripElement = document.querySelector('.trip-main');

export default class BoardPresenter {
  #boardContainer = null; // Контейнер для отображения списка точек маршрута
  #pointsModel = null; // Модель данных о точках маршрута
  #filters = {}; // Фильтры для точек маршрута
  #boardPoints = []; // Отсортированные точки маршрута для отображения
  #sortComponent = null; // Компонент для сортировки точек маршрута
  #pointPresenters = new Map(); // Презентеры точек маршрута
  #currentSortType = SortType.DAY; // Текущий тип сортировки
  #currentFilterType = FilterType.EVERYTHING; // Текущий тип фильтрации
  #sourcedBoardPoints = []; // Исходные точки маршрута

  constructor({ boardContainer, pointsModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#renderFilters(); // Отображение фильтров
    render(new InfoTripView(), infoTripElement, 'afterbegin'); // Отображение информации о поездке

    // Если нет точек маршрута, отображается сообщение о их отсутствии
    if (this.#pointsModel.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    // Сортировка и отображение точек маршрута
    this.#boardPoints = [...this.#pointsModel.points].sort(sortPointsByDay);
    this.#sourcedBoardPoints = [...this.#pointsModel.points];

    this.#renderSort(); // Отображение компонента сортировки
    this.#renderPointList(); // Отображение списка точек маршрута
  }

  // Отображение списка точек маршрута
  #renderPointList() {
    const boardDestinations = this.#pointsModel.getDestinations(); // Получение списка пунктов назначения
    const boardOffers = this.#pointsModel.getOffers(); // Получение списка дополнительных опций

    // Для каждой точки маршрута отображается соответствующий компонент
    this.#boardPoints.forEach((point) => {
      this.#renderPoint(point, boardDestinations, boardOffers);
    });
  }

  // Обработка изменения режима представления
  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  // Отображение точки маршрута
  #renderPoint(point, boardDestinations, boardOffers) {
    const pointPresenter = new PointPresenter(
      this.#boardContainer,
      this.#handlePointChange,
      point,
      boardDestinations,
      boardOffers,
      this.#handleModeChange
    );
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  // Отображение сообщения о отсутствии точек маршрута
  #renderNoPoints() {
    render(new NoPointView(), this.#boardContainer);
  }

  // Отображение фильтров
  #renderFilters() {
    this.#filters = generateFilter(this.#pointsModel.points);
    render(new FilterView({ filters: this.#filters, onFilterTypeChange: this.#handleFilterTypeChange }), document.querySelector('.trip-controls__filters'));
  }

  // Отображение компонента сортировки
  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer);
  }

  // Обработка изменения типа сортировки
  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType); // Сортировка точек маршрута
    this.#clearPointsList(); // Очистка списка точек маршрута
    this.#renderPointList(); // Повторное отображение списка точек маршрута
  };

  // Сортировка точек маршрута
  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#boardPoints.sort(sortPointsByTime); // Сортировка по времени
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortPointsByPrice); // Сортировка по цене
        break;
      case SortType.DAY:
        this.#boardPoints.sort(sortPointsByDay); // Сортировка по дате
        break;
      default:
        this.#boardPoints.sort(sortPointsByDay);
    }
    this.#currentSortType = sortType;
  }

  // Обработка изменения типа фильтрации
  #handleFilterTypeChange = (filterType) => {
    if (this.#currentFilterType === filterType) {
      return;
    }

    this.#filterPoints(filterType); // Фильтрация точек маршрута
    this.#clearPointsList(); // Очистка списка точек маршрута
    this.#renderPointList(); // Повторное отображение списка точек маршрута
  };

  // Фильтрация точек маршрута
  #filterPoints(filterType) {
    switch (filterType) {
      case FilterType.FUTURE:
        this.#boardPoints = filterByFuture(this.#sourcedBoardPoints); // Фильтрация по будущим точкам маршрута
        break;
      case FilterType.PAST:
        this.#boardPoints = filterByPast(this.#sourcedBoardPoints); // Фильтрация по прошлым точкам маршрута
        break;
      case FilterType.PRESENT:
        this.#boardPoints = filterByPresent(this.#sourcedBoardPoints); // Фильтрация по текущим точкам маршрута
        break;
      case FilterType.EVERYTHING:
        this.#boardPoints = this.#sourcedBoardPoints; // Отображение всех точек маршрута
        break;
      default:
        this.#boardPoints = this.#sourcedBoardPoints;
    }
    this.#currentFilterType = filterType;
  }

  // Очистка списка точек маршрута
  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  // Обработка изменения данных о точке маршрута
  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint); // Обновление списка точек маршрута
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint); // Обновление исходных точек маршрута

    const pointPresenter = this.#pointPresenters.get(updatedPoint.id);
    if (pointPresenter) {
      pointPresenter.init(updatedPoint); // Обновление представления точки маршрута
    }
  };
}
