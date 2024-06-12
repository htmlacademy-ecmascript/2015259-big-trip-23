import SortView from '../view/sort-view.js';
import PointInfoPresenter from './header-info-trip-presenter.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import FilterPresenter from './filter-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import TripList from '../view/trip-list-view.js';
import LoadingView from '../view/loading-view.js';
import ErrorPointView from '../view/error-point-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { render, remove } from '../framework/render.js';
import { SortType, FilterType, UpdateType, UserAction, RenderPosition, TimeLimit } from '../const.js';
import { sortPointsByDay, sortPointsByTime, sortPointsByPrice } from '../utils/sort.js';
import { filterByFuture, filterByPast, filterByPresent, filtersGenerateInfo } from '../utils/filter.js';

export default class BoardPresenter {
  #boardContainer = null; // Контейнер для отображения списка точек маршрута
  #pointsModel = null; // Модель данных о точках маршрута
  #filterModel = null; // Фильтры для точек маршрута
  #sortComponent = null; // Компонент для сортировки точек маршрута
  #pointPresenters = new Map(); // Презентеры точек маршрута
  #currentSortType = SortType.DAY; // Текущий тип сортировки
  #tripList = new TripList();
  #noPointComponent = null;
  #newPointPresenter = null;
  #newPointDestroyHandler = null;
  #loadedHandler = null;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #errorMessageComponent = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ boardContainer, pointsModel, filterModel, onNewPointDestroy, onLoaded }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newPointDestroyHandler = onNewPointDestroy;
    this.#loadedHandler = onLoaded;
    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  init() {
    this.#renderBoard();
    this.#renderFilters();// Отображение фильтров
    this.#renderHeaderInfo();
    this.#renderSort();
    remove(this.#errorMessageComponent);

    this.#newPointPresenter = new NewPointPresenter({
      boardContainer: this.#tripList.element,
      onDataChange: this.#viewActionHandler,
      pointsModel: this.#pointsModel,
      onDestroy: this.destroyNewPoint.bind(this),
    });

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
      default:
        return [...points].sort(sortPointsByDay);
    }
  }

  destroyNewPoint() {
    if (this.points.length === 0) {
      this.#renderNoPoints();
    }
    this.#newPointDestroyHandler();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    const sortInputs = document.querySelectorAll('.trip-sort__input');
    sortInputs.forEach((input) => {
      if (input.id !== 'sort-day') {
        input.checked = false;
      } else {
        input.checked = true;
      }
    });

    const filterInputs = document.querySelectorAll('.trip-filters__filter-input');
    filterInputs.forEach((input) => {
      if (input.id !== 'filter-everything') {
        input.checked = false;
      } else {
        input.checked = true;
      }
    });
  }

  #filterPoints(points) {
    const filterType = this.#filterModel.filter;
    const filteredPoints = filtersGenerateInfo[filterType](points);

    switch (filterType) {
      case FilterType.FUTURE:
        return filterByFuture(filteredPoints);
      case FilterType.PRESENT:
        return filterByPresent(filteredPoints);
      case FilterType.PAST:
        return filterByPast(filteredPoints);
      case FilterType.EVERYTHING:
      default:
        return filteredPoints;
    }
  }

  // Отображение списка точек маршрута
  #renderBoard() {
    const boardDestinations = this.#pointsModel.destinations; // Получение списка пунктов назначения
    const boardOffers = this.#pointsModel.offers; // Получение списка дополнительных опций
    const points = this.points;
    render(this.#tripList, this.#boardContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (filtersGenerateInfo[this.#filterModel.filter](points).length === 0) {
      this.#renderNoPoints();
      return;
    }

    // Для каждой точки маршрута отображается соответствующий компонент
    points.forEach((point) => {
      this.#renderPoint(point, boardDestinations, boardOffers);
    });
  }

  #renderFilters() {
    const siteHeaderElement = document.querySelector('.trip-controls__filters');
    const filterPresenter = new FilterPresenter({
      filterContainer: siteHeaderElement,
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel,
    });

    filterPresenter.init();
  }

  #renderHeaderInfo() {
    const controlsTripElement = document.querySelector('.trip-main__trip-controls');
    const pointInfoPresenter = new PointInfoPresenter({
      infoContainer: controlsTripElement,
      pointsModel: this.#pointsModel,
    });

    pointInfoPresenter.init();
  }

  // Отображение точки маршрута
  #renderPoint(point, boardDestinations, boardOffers) {
    const pointPresenter = new PointPresenter(
      this.#tripList.element,
      this.#viewActionHandler,
      point,
      boardDestinations,
      boardOffers,
      this.#modeChangeHandler
    );
    pointPresenter.init();
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  // Отображение сообщения о отсутствии точек маршрута
  #renderNoPoints() {
    this.#noPointComponent = new NoPointView(this.#filterModel.filter);
    render(this.#noPointComponent, this.#boardContainer);
  }

  // Обработка пользовательских действий
  #viewActionHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT: // Обновление данных точки маршрута
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT: // Добавление новой точки маршрута
        this.#uiBlocker.block();
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        this.#uiBlocker.unblock();
        break;
      case UserAction.DELETE_POINT: // Удаление точки маршрута
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  // Обработка событий модели
  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        //обновление части списка (например, когда поменялось описание)
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        //обновление списока (например, когда задача ушла в архив)
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        //обновление всей доски (например, при переключении фильтра)
        this.#clearBoard({ resetSortType: true });
        remove(this.#sortComponent);
        this.#renderSort();
        this.#currentSortType = SortType.DAY;
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        this.#loadedHandler(true);
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearBoard();
        this.#renderErrorMessage();
        this.#loadedHandler(false);
        break;
    }
  };

  // Обработка изменения режима представления
  #modeChangeHandler = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderErrorMessage() {
    this.#errorMessageComponent = new ErrorPointView();
    render(this.#errorMessageComponent, this.#boardContainer);
  }

  // Обработка изменения типа сортировки
  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType; // Обновите текущий тип сортировки
    this.#clearBoard(); // Очистите доску
    this.#renderBoard(); // Перерисуйте доску
  };

  // Отображение компонента сортировки
  #renderSort() {
    // Создайте новый экземпляр SortView с обновленным типом сортировки
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });
    // Вставьте компонент сортировки в DOM
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#newPointPresenter.destroy();
    this.#pointPresenters.clear();
    remove(this.#loadingComponent);
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }
}
