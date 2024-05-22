import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import InfoTripView from '../view/info-trip-view.js';
import { updateItem } from '../utils.js';
import { render } from '../framework/render.js';
import { generateFilter } from '../mocks/filter-mock.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';

const infoTripElement = document.querySelector('.trip-main');
export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #boardPoints = null;
  #filters = {};
  #pointsPresenter = new Map();

  constructor({ boardContainer, pointsModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    const boardDestinations = this.#pointsModel.getDestinations();
    const boardOffers = this.#pointsModel.getOffers();

    this.#boardPoints = [...this.#pointsModel.getPoints()];
    this.#renderFilters();

    render(new InfoTripView(), infoTripElement, 'afterbegin');

    if (this.#pointsModel.getPoints().length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();

    for (let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderPoint(this.#boardPoints[i], boardDestinations, boardOffers);
    }
  }

  #renderPoint(point, boardDestinations, boardOffers) {
    const pointPresenter = new PointPresenter(this.#boardContainer, this.#handlePointChange, point, boardDestinations, boardOffers);
    pointPresenter.init(point);
    this.#pointsPresenter.set(point.id, pointPresenter);
  }

  #renderNoPoints() {
    render(new NoPointView, this.#boardContainer);
  }

  #clearPointsList() {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();
  }

  #renderFilters() {
    this.#filters = generateFilter(this.#pointsModel.points);
    render(new FilterView(this.#filters), document.querySelector('.trip-controls__filters'));
  }

  #renderSort() {
    render(new SortView(), this.#boardContainer);
  }

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointsPresenter.get(updatedPoint.id).init(updatedPoint);
  };
}
