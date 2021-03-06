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
  elValue
} from './js/sorting_utils';
import {
  addPhase1Text,
  addPhase2Text,
  addPhase3Text,
  addPhase3HalfText,
  addPhase4Text,
  setText,
  setIntroText,
} from './js/text_util';


let elTree;
let currentTreeNode;
let arrayEls;
let phase = 1;
let currentPivotEl;
let currentContender;

const EL_SPACING = 0.5;

const timeOutDelay = 350;

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
      addPhase3HalfText();
      break;
    case 5:
      addPhase4Text();
      moveByAnimation(currentPivotEl, [-0.3, 0, 0], true);
      setCurrentContender();
      moveContenderToCompare(currentContender);
      break;
    case 6:
      setText('mid-text', 'The next time you select continue, the sorting will go to completion. Try to follow along!');
      break;
    case 7:
      hideTextCursorContinue();
      compare();
      break;
    default:
      break;
  }
  incrementPhase();
};

const hideTextCursorContinue = () => {
  document.getElementById('controls').setAttribute('visible', 'false');
  document.getElementById('cursor').setAttribute('visible', 'false');
}

const placePivot = () => {
  const camera = document.getElementById('camera-cont');
  const cameraPos = camera.object3D.getWorldPosition();
  const destPos = sumVectors([cameraPos.x, cameraPos.y, cameraPos.z], [0, -1, -7])
  moveByAnimation(currentPivotEl, destPos);
};

const setUpCompare = () => {
  setText('mid-text', "Let's compare the pivot element to the next element");
  moveContenderToCompare(currentContender);
  setTimeout(compare, timeOutDelay);
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
  addToSideNode(direction, currentContender);

  setTimeout(() => {
    if (currentTreeNode.els.length > 0) {
      setCurrentContender();
      setUpCompare();
    } else {
      checkLeftAndRightNodes();
    }
  }, timeOutDelay);
};

const checkLeftAndRightNodes = () => {
  const leftKey = currentTreeNode.left;
  const leftNode = elTree[leftKey];

  if (leftNode.els.length <= 1) {
    leftNode.sorted = true;
    const numElsText = leftNode.els.length === 1 ? 'is only one element' : 'are no elements' ;
    setText('mid-text', `Since there ${numElsText} on the left, we can consider it sorted`);
    setTimeout(checkSizeOfRightNode, timeOutDelay);
  } else {
    checkSizeOfRightNode();
  }
};

const checkSizeOfRightNode = () => {
  const rightKey = currentTreeNode.right;
  const rightNode = elTree[rightKey]

  if (rightNode.els.length <= 1) {
    rightNode.sorted = true;
    const numElsText = rightNode.els.length === 1 ? 'is only one element' : 'are no elements' ;
    setText('mid-text', `Since there ${numElsText} on the right, we can consider it sorted`);
    setTimeout(decideWhichNodeToSortNext, timeOutDelay);
  } else {
    decideWhichNodeToSortNext();
  }
}

const decideWhichNodeToSortNext = () => {
  if (bothSideNodesAreSorted()) {
    currentTreeNode.sorted = true;
    setText('mid-text', "Since both the left and right of this section is sorted, we can add the left, pivot, and right elements together");
    concatLeftPivotRight(currentTreeNode);
    setTimeout(()=> {
      if (currentTreeNode.key === 0) {
        setText('mid-text', "Sorted! Refresh to rerun with freshly shuffled elements :)");
        document.getElementById('next-text').setAttribute('visible', 'false');
        document.getElementById('controls').setAttribute('visible', 'true');
        return
      } else {
        sortTreeNode(currentTreeNode.parent);
      }
    }, timeOutDelay);
  } else if (!elTree[currentTreeNode.left].sorted) {
    sortTreeNode(currentTreeNode.left)
  } else if (!elTree[currentTreeNode.right].sorted) {
    sortTreeNode(currentTreeNode.right)
  } else if (complementSideNodeIsSorted()) {
    sortTreeNode(currentTreeNode.parent);
  } else {
    sortTreeNode(complementSideKey());
  }
}

const bothSideNodesAreSorted = () => {
  const leftSideNode = elTree[currentTreeNode.left];
  const rightSideNode = elTree[currentTreeNode.right];
  if (!leftSideNode || !rightSideNode) {
    return false;
  }

  return (rightSideNode.sorted && leftSideNode.sorted);
};

const sortTreeNode = key => {
  currentTreeNode = elTree[key];
  setText('mid-text', "Let's take a look at these elements over here");

  const destCameraPos = sumVectors(currentTreeNode.position, [0, 0, 10]);
  moveCameraAndControls(destCameraPos);

  setTimeout(() => {
    const numEls = currentTreeNode.els.length;
    if (numEls <= 1) {
      decideWhichNodeToSortNext();
    } else {
      createTreeSideNodes();
      setCurrentPivotEl();
      setText('mid-text', "Once again we will choose the first element as the pivot");
      placePivot();
      setTimeout(() => {
        moveByAnimation(currentPivotEl, [-0.3, 0, 0], true);
        setCurrentContender();
        moveContenderToCompare(currentContender);
        setTimeout(compare, timeOutDelay);
      }, timeOutDelay);
    }
  }, timeOutDelay);
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
    position: sumVectors(currentTreeNode.position, [-1.5, 0, 3])
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
    position: sumVectors(currentTreeNode.position, [1.5, 0, 3])
  };
};

const concatLeftPivotRight = node => {
  const leftEls = elTree[node.left].els;
  const rightEls = elTree[node.right].els;
  const leftLength = leftEls.length;
  for (let i = 0; i < leftLength; i++) {
    node.els.push(leftEls.shift());
  }

  node.els.push(node.pivot);
  node.pivot = null;

  const rightLength = rightEls.length;
  for (let i = 0; i < rightLength; i++) {
    node.els.push(rightEls.shift());
  }

  moveAllElsToCenter(node);
};

const addToSideNode = (direction, element) => {
  const sideNode = elTree[currentTreeNode[direction]];
  sideNode.els.push(element);

  let xOffset = (sideNode.els.length - 1) / 4;
  if (direction === 'left') { shiftAllEls(sideNode) }
  const destPos = sumVectors(sideNode.position, [xOffset, 0, 0]);
  moveByAnimation(element, destPos)
  if (direction === 'left') {
    sideNode.position = sumVectors(sideNode.position, [-EL_SPACING / 2, 0, 0]);
  } else {
    sideNode.position = sumVectors(sideNode.position, [EL_SPACING / 2, 0, 0]);
  }
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
        position: [0, 2, 0]
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
        position: [-1.5, 2, 3]
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
        position: [1.5, 2, 3]
      }
    };

    currentTreeNode = elTree[0];
    currentTreeNode.els = arrayEls;

    setElHeights(arrayEls);

    setListenerOnNextText();
  });

});
