import { EmptyFiltersList } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createNoPointTemplate() {
  return (
    `<p class="trip-events__msg">
      ${EmptyFiltersList.everything}
    </p>`
  );
}

export default class NoPointView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createNoPointTemplate();
  }
}
