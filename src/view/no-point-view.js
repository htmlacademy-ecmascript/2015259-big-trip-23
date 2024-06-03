import { EmptyFiltersList } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createNoPointTemplate(currentFilterType) {
  return (
    `<p class="trip-events__msg">
      ${EmptyFiltersList[currentFilterType]}
    </p>`
  );
}

export default class NoPointView extends AbstractView {
  #currentFilterType = null;

  constructor(currentFilterType) {
    super();
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createNoPointTemplate(this.#currentFilterType);
  }
}
