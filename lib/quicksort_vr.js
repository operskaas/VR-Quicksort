import 'aframe';
import 'aframe-look-at-component';
import 'aframe-bmfont-text-component';
import {
  moveAndPulsePivot, 
  stopPulsingAndMovePivot, 
  moveByAnimation, 
  moveContenderToCompare,
  moveCameraAndControls
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


let elTree;
let currentTreeNode = 0;
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


const setUpCompare = () => {
  setText('mid-text', "Let's compare the pivot element to the next element");
  moveContenderToCompare(currentContender);
  setNextTextClickListener(compare);
}

const currentEls = () => {
  return elTree[currentTreeNode].els;
}

const setCurrentPivotEl = () => {
  currentPivotEl = currentEls().splice(0,1)[0];
  elTree[currentTreeNode].pivot = currentPivotEl;
};

const setCurrentContender = () => {
  currentContender = currentEls().splice(0,1)[0];
};

const compare = () => {
  let comparison = 'smaller';
  let direction = 'left'

  if (elValue(currentPivotEl) < elValue(currentContender)) {
    comparison = 'greater';
    direction = 'right';
  }
  setText('mid-text', `In this case, the contender is ${comparison} than the pivot element, so it will be moved to the ${direction}`);
  addToTreeNode(direction, currentContender);

  if (currentEls().length > 0) {
    setCurrentContender();
    changeNextTextListener();
  } else { // have sorted all contenders in arrayEls
    console.log('finished sorting this round');
    sortLeftArray();
    sortRightArray();
    concatLeftPivotRight();
  }
};

const sortLeftArray = () => {
  setText('mid-text', "Let's take a look at the elements on the left");

  moveCameraAndControls('left');
  setNextTextClickListener(() => {
    setText('mid-text', "Looks like we got some elements over here");

    setCurrentPivotEl();
    setNextTextClickListener()
  });

};

const sortRightArray = () => {

};

const concatLeftPivotRight = () => {

};


const leftArray = [];
const rightArray = [];

const addToTreeNode = (direction, element) => {
  const prevPos = element.object3D.getWorldPosition();
  // const detachedEl = detachFromParent(element);
  // const scene = document.querySelector('a-scene');
  // attachToParent(scene, detachedEl, prevPos);
  // setHeightAndColor(detachedEl);

  // const arr = document.getElementById(direction);
  const sideNodeKey = elTree[currentTreeNode][direction]
  const sideNode = elTree[sideNodeKey];
  sideNode.els.push(element);
  // const arrPos = arr.object3D.getWorldPosition();
  const sideNodePos = sideNode.position;
  const destPos = sideNodePos.slice();
  let xOffset = sideNode.els.length;
  if (direction === 'left') {xOffset = -xOffset}
  destPos[0] += xOffset;
  moveByAnimation(element, destPos, false, () => {
    // const globalPos = detachedEl.object3D.getWorldPosition();
    // const detached = detachFromParent(detachedEl);
    // attachToParent(arr, detached, globalPos);
    // setHeightAndColor(detached);
  });
};

const setNextTextClickListener = (cb) => {
  const nextText = document.getElementById('next-text');
  const eventCB = () => {
    cb();
    nextText.removeEventListener('click', eventCB);
  }
  nextText.addEventListener('click', eventCB);
}

const setListenerOnNextText = () => {
  const nextText = document.getElementById('next-text');
  nextText.addEventListener('click', moveToPhaseListener);
};

const moveToPhaseListener = e => {
  moveToPhase(phase);
}

const changeNextTextListener = () => {
  const nextText = document.getElementById('next-text');
  nextText.removeEventListener('click', moveToPhaseListener); // should be a no-op after first time, will this break?

  setNextTextClickListener(setUpCompare);
};

document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('a-scene');
  scene.addEventListener('loaded', () => {

    setIntroText();

    arrayEls = randomElOrder();
    elTree = {
      0: {
        sorted: false,
        els: arrayEls.slice(),
        left: 1,
        right: 2,
        parent: null,
        pivot: null,
        position: [0, 0, 0]
      },
      1: {
        sorted: false,
        els: [],
        left: null,
        right: null,
        parent: 0,
        pivot: null,
        position: [-4, 2, 6]
      },
      2: {
        sorted: false,
        els: [],
        left: null,
        right: null,
        parent: 0,
        pivot: null,
        position: [4, 2, 6]
      }
    };

    setElHeights(arrayEls);

    setListenerOnNextText();
  });

});
