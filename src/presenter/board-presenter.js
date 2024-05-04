import SortView from '../view/sort-view.js';
import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import FilterView from '../view/filter-view.js';
import InfoTripView from '../view/info-trip-view.js';
import { render, RenderPosition } from '../render.js';

const infoTripElement = document.querySelector('.trip-main');
const filterElement = document.querySelector('.trip-controls__filters');

export default class Presenter {
  constructor({ boardContainer, pointsModel }) {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    const boardDestinations = this.pointsModel.getDestinations();
    const boardOffers = this.pointsModel.getOffers();

    this.boardPoints = [...this.pointsModel.getPoints()];

    render(new InfoTripView(), infoTripElement, RenderPosition.AFTERBEGIN);
    render(new SortView(), this.boardContainer);
    render(new FilterView(), filterElement);
    render(new EditFormView({ point: this.boardPoints[0], boardDestinations, boardOffers }), this.boardContainer);

    for (let i = 0; i < this.boardPoints.length; i++) {
      render(new PointView({ point: this.boardPoints[i], boardDestinations, boardOffers }), this.boardContainer);
    }
  }
}
