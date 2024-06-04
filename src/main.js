import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import PointsApiService from './points-api-server.js';
import { AUTHORIZATION, END_POINT } from './const.js';
import { render } from './framework/render.js';

const boardContainerElement = document.querySelector('.trip-events');
const buttonContainer = document.querySelector('.trip-main');
const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  boardContainer: boardContainerElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

boardPresenter.init();
pointsModel.init();
render(newPointButtonComponent, buttonContainer);

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}
