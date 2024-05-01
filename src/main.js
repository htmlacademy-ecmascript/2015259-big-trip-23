import BoardPresenter from './presenter/board-presenter.js';

const boardContainerElement = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({boardContainer: boardContainerElement});

boardPresenter.init();
