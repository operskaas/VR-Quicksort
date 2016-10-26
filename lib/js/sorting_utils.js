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

export const attachToParent = (parent, element, elGlobalPos) => {
  parent.appendChild(element);
  const parentGlobalPos = parent.object3D.getWorldPosition();
  const relPos = {x: (elGlobalPos.x - parentGlobalPos.x), y: (elGlobalPos.y - parentGlobalPos.y), z: (elGlobalPos.z - parentGlobalPos.z)};
  element.setAttribute('position', relPos);
};