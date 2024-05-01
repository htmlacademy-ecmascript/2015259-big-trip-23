import SortView from '../view/sort-view.js';
import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import {render} from '../render.js';
import FilterView from '../view/filter-view.js';

const POINTS_COUNT = 3;

const filterElement = document.querySelector('.trip-controls__filters');

export default class Presenter {
  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(new FilterView(), filterElement);
    render(new SortView(), this.boardContainer);
    render(new EditFormView(), this.boardContainer);

    for (let i = 0; i < POINTS_COUNT; i++) {
      render(new PointView(), this.boardContainer);
    }
  }
}
