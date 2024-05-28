import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';

const boardContainerElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter({
  boardContainer: boardContainerElement,
  pointsModel,
  filterModel
});

pointsModel.initPoints();
boardPresenter.init();
