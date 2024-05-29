import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { render } from './framework/render.js';

const boardContainerElement = document.querySelector('.trip-events');
const buttonContainer = document.querySelector('.trip-main');
const pointsModel = new PointsModel();
pointsModel.initPoints();
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  boardContainer: boardContainerElement,
  pointsModel: pointsModel,
  filterModel: filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const newPointButton = new NewPointButtonView({
  onClick: () => {
    newPointButton.disabled = true;
    boardPresenter.createPoint();
  }
});

render(newPointButton, buttonContainer);

boardPresenter.init();

function handleNewPointFormClose() {
  newPointButton.disabled = false;
}
