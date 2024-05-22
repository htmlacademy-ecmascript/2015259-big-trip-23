import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import InfoTripView from '../view/info-trip-view.js';
import { render } from '../framework/render.js';
import { generateFilter } from '../mocks/filter-mock.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';

const infoTripElement = document.querySelector('.trip-main');
const filterElement = document.querySelector('.trip-controls__filters');

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #boardPoints = [];
  #filters = {};

  constructor({ boardContainer, pointsModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filters = generateFilter(this.#pointsModel.getPoints());
  }

  init() {
    const boardDestinations = this.#pointsModel.getDestinations();
    const boardOffers = this.#pointsModel.getOffers();

    this.#boardPoints = [...this.#pointsModel.getPoints()];

    render(new InfoTripView(), infoTripElement, 'afterbegin');
    render(new FilterView(this.#filters), filterElement);

    if (this.#pointsModel.getPoints().length === 0) {
      render(new NoPointView(), this.#boardContainer);
      return;
    }

    render(new SortView(), this.#boardContainer);

    for (let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderPoint(this.#boardPoints[i], boardDestinations, boardOffers);
    }
  }

  #renderPoint(point, boardDestinations, boardOffers) {
    const pointPresenter = new PointPresenter(this.#boardContainer);
    pointPresenter.init(point, boardDestinations, boardOffers);
  }
}
