import { POINTS_COUNT } from '../const.js';
import { mockDestinations } from '../mocks/destination-mock.js';
import { mockOffers } from '../mocks/offers-mock.js';
import { getRandomPoint } from '../mocks/points-mock.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];

  initPoints() {
    this.#points = Array.from({ length: POINTS_COUNT }, getRandomPoint);
    this.#destinations = mockDestinations;
    this.#offers = mockOffers;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }
}
