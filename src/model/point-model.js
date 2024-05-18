import { POINTS_COUNT } from '../const.js';
import { mockDestinations } from '../mocks/destination-mock.js';
import { mockOffers } from '../mocks/offers-mock.js';
import { getRandomPoint } from '../mocks/points-mock.js';

export default class PointsModel {
  constructor() {
    this.points = [];
    this.destinations = [];
    this.offers = [];
  }

  initPoints() {
    this.points = Array.from({ length: POINTS_COUNT }, getRandomPoint);
    this.destinations = mockDestinations;
    this.offers = mockOffers;
  }

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }
}
