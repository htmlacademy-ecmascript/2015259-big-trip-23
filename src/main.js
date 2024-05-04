import Presenter from './presenter/board-presenter.js';
import PointsModel from './model/point-model.js';

const boardContainerElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
pointsModel.initPoints();
const boardPresenter = new Presenter({
  boardContainer: boardContainerElement,
  pointsModel,
});

boardPresenter.init();
