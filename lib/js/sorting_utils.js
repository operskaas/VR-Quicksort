import 'aframe';

import { setHeightAndColor } from './setup';

export const elValue = element => {
  return parseInt(element.id.substr(3));
};