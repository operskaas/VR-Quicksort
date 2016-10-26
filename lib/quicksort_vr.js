import 'aframe';
import 'aframe-look-at-component';
import 'aframe-bmfont-text-component';
import {
  moveAndPulsePivot, 
  stopPulsingAndMovePivot, 
  moveByAnimation, 
  moveContenderToCompare
} from './js/animation_utils';
import {
  randomElOrder, 
  setElHeights, 
  makeArrayElsVisible,
  setHeightAndColor
} from './js/setup';
import {
  elValue, 
  detachFromParent,
  attachToParent
} from './js/sorting_utils';
import {
  addPhase1Text,
  addPhase2Text,
  addPhase3Text,
  addPhase4Text,
  setText,
  setIntroText
} from './js/text_util';



const setUpCompare = () => {
  setText('mid-text', "Let's compare the pivot element to the next element");
  moveContenderToCompare(currentContender);
  setCompareListener();
}

let arrayEls;
let phase = 1;
let currentPivotEl;
let currentContender;

const incrementPhase = () => phase++;

const moveToPhase = (phase) => {
  switch (phase) {
    case 1:
      makeArrayElsVisible(arrayEls);
      addPhase1Text();
      break;
    case 2:
      addPhase2Text();
      break;
    case 3:
      setCurrentPivotEl();
      addPhase3Text();
      moveAndPulsePivot(currentPivotEl);
      break;
    case 4:
      addPhase4Text();
      stopPulsingAndMovePivot(currentPivotEl);
      setCurrentContender();
      moveContenderToCompare(currentContender);
      break;
    case 5:
      compare();
      break;
    default:
      break;
  }
  incrementPhase();
};


const setCurrentPivotEl = () => {
  currentPivotEl = arrayEls.splice(0,1)[0];
};

const setCurrentContender = () => {
  currentContender = arrayEls.splice(0,1)[0];
};

const compare = () => {
  let comparison = 'smaller';
  let direction = 'left'

  if (elValue(currentPivotEl) < elValue(currentContender)) {
    comparison = 'greater';
    direction = 'right';
  }
  setText('mid-text', `In this case, the contender is ${comparison} than the pivot element, so it will be moved to the ${direction}`);
  _addToDOMArray(direction, currentContender);
  setCurrentContender();

  if (arrayEls.length > 0) {
    changeNextTextListener();
  } else {
    console.log('finished sorting this round');
  }
};

const leftArray = [];
const rightArray = [];

const _addToDOMArray = (id, element) => {
  const prevPos = element.object3D.getWorldPosition();
  const detachedEl = detachFromParent(element);
  const scene = document.querySelector('a-scene');
  attachToParent(scene, detachedEl, prevPos);
  setHeightAndColor(detachedEl);

  const arr = document.getElementById(id);
  const arrPos = arr.object3D.getWorldPosition();
  moveByAnimation(detachedEl, [arrPos.x, arrPos.y, arrPos.z], false, () => {
    const globalPos = detachedEl.object3D.getWorldPosition();
    const detached = detachFromParent(detachedEl);
    attachToParent(arr, detached, globalPos);
    setHeightAndColor(detached);
    if (id === 'left') {
      moveByAnimation(arr, [-1, 0, 0], true);
    } else {
      moveByAnimation(arr, [1, 0, 0], true);
    }
    const xOffset = arr.childElementCount;
    moveByAnimation(detached, [xOffset, 0, 0]);
  });
};

const setListenerOnNextText = () => {
  const nextText = document.getElementById('next-text');
  nextText.addEventListener('click', moveToPhaseListener);
};

const moveToPhaseListener = e => {
  moveToPhase(phase);
}

const setCompareListener = () => {
  const nextText = document.getElementById('next-text');
  nextText.addEventListener('click', compareListener)
};

const compareListener = (e) => {
  compare();
  const nextText = document.getElementById('next-text');
  nextText.removeEventListener('click', compareListener);
}

const changeNextTextListener = () => {
  const nextText = document.getElementById('next-text');
  nextText.removeEventListener('click', moveToPhaseListener);

  nextText.addEventListener('click', setUpCompareListener);
};

const setUpCompareListener = e => {
  setUpCompare();
  const nextText = document.getElementById('next-text');
  nextText.removeEventListener('click', setUpCompareListener);
};



document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('a-scene');
  scene.addEventListener('loaded', () => {

    setIntroText();

    arrayEls = randomElOrder();

    setElHeights(arrayEls);

    setListenerOnNextText();
  });

});
