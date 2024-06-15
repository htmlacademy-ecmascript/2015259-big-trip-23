import AbstractView from '../framework/view/abstract-view.js';

function createErrorPointTemplate() {
  return (
    `<p class="trip-events__msg">
      Failed to load latest route information
    </p>`
  );
}

export default class ErrorPointView extends AbstractView {
  get template() {
    return createErrorPointTemplate();
  }
}
