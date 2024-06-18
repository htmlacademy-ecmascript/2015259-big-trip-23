import { UpdateType } from '../const.js';
import { replace, remove, render, RenderPosition } from '../framework/render.js';
import HeaderInfoTripView from '../view/header-info-trip-view.js';

export default class PointInfoPresenter {
  #pointInfoContainer;
  #pointsModel = null;
  #destinations = null;
  #pointInfoComponent = null;

  constructor({ infoContainer, pointsModel }) {
    this.#pointInfoContainer = infoContainer;
    this.#pointsModel = pointsModel;
    this.#pointsModel.addObserver(this.#modelChangeHandler);
  }

  get dateFrom() {
    return this.#pointsModel.points[0]?.dateFrom;
  }

  get dateTo() {
    return this.#pointsModel.points[this.#pointsModel.points.length - 1]?.dateTo;
  }

  init() {
    this.#destinations = this.#pointsModel.destinations;

    const points = this.#pointsModel.points;
    if (points.length > 0) {
      const dateFrom = this.dateFrom;
      const dateTo = this.dateTo;
      const previousHeaderInfoComponent = this.#pointInfoComponent;
      const totalCost = this.#caclculateTotalPrice(points);

      const newTripInfoComponent = new HeaderInfoTripView(dateFrom, dateTo, this.destinationNames, totalCost);
      if (previousHeaderInfoComponent === null) {
        render(newTripInfoComponent, this.#pointInfoContainer, RenderPosition.BEFOREBEGIN);
      } else {
        replace(newTripInfoComponent, previousHeaderInfoComponent);
        remove(previousHeaderInfoComponent);
      }
      this.#pointInfoComponent = newTripInfoComponent;
    } else {
      remove(this.#pointInfoComponent);
      this.#pointInfoComponent = null;
    }
  }

  get destinationNames() {
    const points = this.#pointsModel.points;
    const destinationNames = points.map((point) => this.#getDestinationsById(point.destination).name);

    return destinationNames;
  }

  #getDestinationsById(id) {
    return this.#destinations.find((item) => item.id === id);
  }

  #caclculateTotalPrice(points) {
    return points.reduce((sum, point) => {
      sum += point.basePrice + this.#sumOffersPrice(point.offers, point.type);
      return sum;
    }, 0);
  }

  #sumOffersPrice(selectedOffers, type) {
    const offers = this.#pointsModel.offers.find((item) => item.type === type).offers;
    return offers.reduce((sum, item) => {
      if (selectedOffers.includes(item.id)) {
        sum += item.price;
      }
      return sum;
    }, 0);
  }

  #modelChangeHandler = (updateType) => {
    if (updateType !== UpdateType.ERROR) {
      this.init();
    }
  };
}
