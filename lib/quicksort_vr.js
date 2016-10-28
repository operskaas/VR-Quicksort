import 'aframe';
import 'aframe-look-at-component';
import 'aframe-bmfont-text-component';
import {
  moveByAnimation, 
  moveContenderToCompare,
  moveCameraAndControls,
  sumVectors,
  shiftAllEls,
  moveAllElsToCenter
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
let currentTreeNode;
let arrayEls;
let phase = 1;
let currentPivotEl;
let currentContender;

const incrementPhase = () => phase++;

const moveToPhase = phase => {
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
      placePivot();
      break;
    case 4:
      addPhase4Text();
      moveByAnimation(currentPivotEl, [-0.5, 0, 0], true);
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

const placePivot = () => {
  const camera = document.getElementById('camera-cont');
  const cameraPos = camera.object3D.getWorldPosition();
  const destPos = sumVectors([cameraPos.x, cameraPos.y, cameraPos.z], [0, -1, -7])
  moveByAnimation(currentPivotEl, destPos);
};

const setUpCompare = () => {
  setText('mid-text', "Let's compare the pivot element to the next element");
  moveContenderToCompare(currentContender);
  setNextTextClickListener(compare);
}

const setCurrentPivotEl = () => {
  currentPivotEl = currentTreeNode.els.splice(0,1)[0];
  currentTreeNode.pivot = currentPivotEl;
};

const setCurrentContender = () => {
  currentContender = currentTreeNode.els.splice(0,1)[0];
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

  if (currentTreeNode.els.length > 0) {
    setCurrentContender();
    changeNextTextListener();
  } else {
    console.log('finished sorting this round');
    const leftKey = currentTreeNode.left;
    const rightKey = currentTreeNode.right;
    sortTreeNode(leftKey);
  }
};

const bothSideNodesAreSorted = () => {
  const leftSideNode = elTree[currentTreeNode.left];
  const rightSideNode = elTree[currentTreeNode.right];
  if (!leftSideNode || !rightSideNode) {
    return false;
  }

  return (rightSideNode.sorted && leftSideNode.sorted);
};

const sortTreeNode = key => {
  debugger
  currentTreeNode = elTree[key];
  setText('mid-text', "Let's take a look at these elements over here");

  const destCameraPos = sumVectors(currentTreeNode.position, [0, 0, 15]);
  moveCameraAndControls(destCameraPos);

  setNextTextClickListener(() => {
    const numEls = currentTreeNode.els.length;
    if (numEls <= 1) {
      if (numEls === 1) {
        setText('mid-text', "Since we only have one element here, we can consider it sorted");
      } else if (bothSideNodesAreSorted()) {
        console.log('both side nodes are sorted');
        concatLeftPivotRight();
      } else {
        setText('mid-text', "Since we have no elements here, we can consider it sorted");     
      }
      currentTreeNode.sorted = true;  
      if (complementSideNodeIsSorted()) {
        sortTreeNode(currentTreeNode.parent);
      } else {
        sortTreeNode(complementSideKey());
      }
    } else {
      createTreeSideNodes();
      setCurrentPivotEl();
      setText('mid-text', "Once again we will choose the first element as the pivot");
      placePivot();
      setNextTextClickListener(() => {
        moveByAnimation(currentPivotEl, [-0.5, 0, 0], true);
        setCurrentContender();
        moveContenderToCompare(currentContender);
        setNextTextClickListener(compare);
      });
    }
  });
};

const complementSideNodeIsSorted = () => {
  return elTree[complementSideKey()].sorted;
};

const complementSideKey = () => {
  const currentKey = currentTreeNode.key;
  const parentNode = elTree[currentTreeNode.parent];
  if (currentKey === parentNode.left) {
    return parentNode.right;
  } else {
    return parentNode.left;
  }
};

const createTreeSideNodes = () => {
  let newKey = currentTreeNode.key + 1;
  while (elTree[newKey]) {
    newKey++;
  }
  currentTreeNode.left = newKey;
  currentTreeNode.right = newKey + 1;
  elTree[newKey] = {
    key: newKey,
    sorted: false,
    desc: 'left',
    els: [],
    left: null,
    right: null,
    parent: currentTreeNode.key,
    pivot: null,
    position: sumVectors(currentTreeNode.position, [-4, 0, 6])
  };

  elTree[newKey + 1] = {
    key: newKey + 1,
    sorted: false,
    desc: 'right',
    els: [],
    left: null,
    right: null,
    parent: currentTreeNode.key,
    pivot: null,
    position: sumVectors(currentTreeNode.position, [4, 0, 6])
  };
};

const concatLeftPivotRight = () => {
  const leftEls = elTree[currentTreeNode.left].els;
  const rightEls = elTree[currentTreeNode.right].els;
  const leftLength = leftEls.length;
  for (let i = 0; i < leftLength; i++) {
    currentTreeNode.els.push(leftEls.shift());
  }

  currentTreeNode.els.push(currentTreeNode.pivot);
  currentTreeNode.pivot = null;

  const rightLength = rightEls.length;
  for (let i = 0; i < rightLength; i++) {
    currentTreeNode.els.push(rightEls.shift());
  }

  moveAllElsToCenter(currentTreeNode);
};

const leftArray = [];
const rightArray = [];

const addToTreeNode = (direction, element) => {
  const sideNodeKey = currentTreeNode[direction]
  const sideNode = elTree[sideNodeKey];
  sideNode.els.push(element);

  const sideNodePos = sideNode.position;
  const destPos = sideNodePos.slice();
  let xOffset = (sideNode.els.length - 1) / 4;
  // if (direction === 'left') {xOffset = -xOffset}
  destPos[0] += xOffset;
  moveByAnimation(element, destPos);
  shiftAllEls(sideNode);
};

const setNextTextClickListener = cb => {
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
        key: 0,
        sorted: false,
        els: arrayEls.slice(),
        left: 1,
        right: 2,
        parent: null,
        pivot: null,
        position: [0, 0, 0]
      },
      1: {
        key: 1,
        sorted: false,
        desc: 'left',
        els: [],
        left: null,
        right: null,
        parent: 0,
        pivot: null,
        position: [-4, 2, 6]
      },
      2: {
        key: 2,
        sorted: false,
        desc: 'right',
        els: [],
        left: null,
        right: null,
        parent: 0,
        pivot: null,
        position: [4, 2, 6]
      }
    };

    currentTreeNode = elTree[0];
    currentTreeNode.els = arrayEls;

    setElHeights(arrayEls);

    setListenerOnNextText();
  });

});
