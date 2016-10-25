import 'aframe';

import { setHeightAndColor } from './setup';

export const elValue = element => {
  return parseInt(element.id.substr(3));
};

export const detachFromParent = element => {
  const clone = element.cloneNode();
  element.parentNode.removeChild(element);
  return clone;
};

export const attachToScene = (element, parentPos, relPos) => {
  document.querySelector('a-scene').appendChild(element);
  const globalPos = `${parentPos.x + relPos.x} ${parentPos.y + relPos.y} ${parentPos.z + relPos.z}`;
  element.setAttribute('position', globalPos);
};