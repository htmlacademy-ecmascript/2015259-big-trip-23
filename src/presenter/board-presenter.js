import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import InfoTripView from '../view/info-trip-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { render } from '../framework/render.js';
import { SortType, FilterType, UpdateType, UserAction } from '../const.js';
import { sortPointsByDay, sortPointsByTime, sortPointsByPrice } from '../utils/sort.js';
import { filterByFuture, filterByPast, filterByPresent, generateFilter } from '../utils/filter.js';

const infoTripElement = document.querySelector('.trip-main');

export default class BoardPresenter {
  #boardContainer = null; // Контейнер для отображения списка точек маршрута
  #pointsModel = null; // Модель данных о точках маршрута
  #filters = {}; // Фильтры для точек маршрута
  #sortComponent = null; // Компонент для сортировки точек маршрута
  #pointPresenters = new Map(); // Презентеры точек маршрута
  #currentSortType = SortType.DAY; // Текущий тип сортировки
  #currentFilterType = FilterType.EVERYTHING; // Текущий тип фильтрации

  constructor({ boardContainer, pointsModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderFilters(); // Отображение фильтров
    render(new InfoTripView(), infoTripElement, 'afterbegin'); // Отображение информации о поездке

    // Если нет точек маршрута, отображается сообщение о их отсутствии
    if (this.#pointsModel.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort(); // Отображение компонента сортировки
    this.#renderPointList(); // Отображение списка точек маршрута
  }

  // Получение отсортированного списка точек маршрута
  get points() {
    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortPointsByTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortPointsByPrice);
      case SortType.DAY:
        return [...this.#pointsModel.points].sort(sortPointsByDay);
      default:
        return [...this.#pointsModel.points].sort(sortPointsByDay);
    }
  }

  // Отображение списка точек маршрута
  #renderPointList() {
    const boardDestinations = this.#pointsModel.destinations; // Получение списка пунктов назначения
    const boardOffers = this.#pointsModel.offers; // Получение списка дополнительных опций
    const points = this.points;

    // Для каждой точки маршрута отображается соответствующий компонент
    points.forEach((point) => {
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
      this.#handleViewAction,
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

    this.currentSortType = sortType; // Сортировка точек маршрута
    this.#clearPointsList(); // Очистка списка точек маршрута
    this.#renderPointList(); // Повторное отображение списка точек маршрута
  };

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
        [...this.#pointsModel.points] = filterByFuture(this.#pointsModel.points); // Фильтрация по будущим точкам маршрута
        break;
      case FilterType.PAST:
        [...this.#pointsModel.points] = filterByPast(this.#pointsModel.points); // Фильтрация по прошлым точкам маршрута
        break;
      case FilterType.PRESENT:
        [...this.#pointsModel.points] = filterByPresent(this.#pointsModel.points); // Фильтрация по текущим точкам маршрута
        break;
      case FilterType.EVERYTHING:
        [...this.#pointsModel.points] = this.#pointsModel.points; // Отображение всех точек маршрута
        break;
      default:
        [...this.#pointsModel.points] = this.#pointsModel.points;
    }
    this.#currentFilterType = filterType;
  }

  // Очистка списка точек маршрута
  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  // Обработка пользовательских действий
  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updateTask(updateType, update); // Обновление данных точки маршрута
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addTask(updateType, update); // Добавление новой точки маршрута
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deleteTask(updateType, update); // Удаление точки маршрута
        break;
    }
  };

  // Обработка событий модели
  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        //обновление части списка (например, когда поменялось описание)
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        //обновление списока (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        //обновление всей доски (например, при переключении фильтра)
        break;
    }
  };
}
