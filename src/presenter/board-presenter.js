import EditListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import FilterView from '../view/filter-view.js';
import InfoTripView from '../view/info-trip-view.js';
import {render, RenderPosition} from '../render.js';

const POINTS_COUNT = 3;

const infoTripElement = document.querySelector('.trip-main');
const filterElement = document.querySelector('.trip-controls__filters');

export default class Presenter {
  sortComponent = new SortView();
  editListComponent = new EditListView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(new InfoTripView(), infoTripElement, RenderPosition.AFTERBEGIN);
    render(this.sortComponent, this. boardContainer);
    render(this.editListComponent, this. boardContainer);
    render(new FilterView(), filterElement);
    render(new EditFormView(), this.boardContainer);

    for (let i = 0; i < POINTS_COUNT; i++) {
      render(new PointView(), this.boardContainer);
    }
  }
}
