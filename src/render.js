import { RENDER_POSITION } from './const';

function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
}

function render(component, container, place = RENDER_POSITION.BEFOREEND) {
  container.insertAdjacentElement(place, component.getElement());
}

export {createElement, render};
