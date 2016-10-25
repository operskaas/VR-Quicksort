import { setHeightAndColor } from './setup';

export const elValue = element => {
  return parseInt(element.id.substr(3));
};

export const moveParent = (element, newParent) => {
  const clone = element.cloneNode();
  element.parentNode.removeChild(element);
  newParent.appendChild(clone);
  setHeightAndColor(clone);
  return clone;
}