import Presenter from './presenter/board-presenter.js';

const boardContainerElement = document.querySelector('.trip-events');
const boardPresenter = new Presenter ({boardContainer: boardContainerElement});

boardPresenter.init();
