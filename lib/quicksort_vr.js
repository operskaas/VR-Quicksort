import 'aframe';
import 'aframe-look-at-component';
import 'aframe-bmfont-text-component';


const NUM_ELS = 12;

const EL_IDS = ['el-1', 'el-2', 'el-3', 'el-4', 'el-5', 'el-6', 'el-7', 'el-8', 'el-9', 'el-10', 'el-11', 'el-12'];
const EL_X_POSITIONS = EL_IDS.map((id, idx) => {
  return -((EL_IDS.length - 1) / 2) + idx;
});

let arrayEls;
let pivotEl;
let contender;

const randomElOrder = () => {
  const arrayEls = [];

  const elIdCopy = EL_IDS.slice();

  for (let i = 0; i < EL_IDS.length; i++) {
    const randomIdx = Math.floor(Math.random() * elIdCopy.length);
    const randomElId = elIdCopy.splice(randomIdx, 1);
    const randomEl = document.getElementById(randomElId);
    arrayEls.push(randomEl);
  }

  return arrayEls;
};

const setElHeights = (arrayEls) => { 

  arrayEls.forEach((arrayEl, idx) => {
    const numEls = EL_IDS.length;
    const id = parseInt(arrayEl.id.substr(3));
    arrayEl.setAttribute('height', `${0.5 + id/5}`);
    const blueHex = Math.floor(17 + ((255 - 17) * (id / numEls))).toString(16);
    arrayEl.setAttribute('material', `color:#7777${blueHex}`);
    const x = EL_X_POSITIONS[idx];
    arrayEl.setAttribute('position', `${x} 2 0`);
    arrayEl.setAttribute('visible', `false`);
  });
};

const makeArrayElsVisible = () => {
  arrayEls.forEach(arrayEl => arrayEl.setAttribute('visible', 'true'));
};

let toBeCleanedUp = [];

const setText = (id, text, scale = 3) => {
  const textEl = document.getElementById(id);
  textEl.setAttribute('visible', 'true');
  textEl.setAttribute('bmfont-text', `text: ${text}; align: center; width: 750; color: red;`);
  textEl.setAttribute('scale', `${scale} ${scale} ${scale}`);

  toBeCleanedUp.push(textEl);
};

const addPhase1Text = () => {
  setText('mid-text', 'These boxes represent the elements to be sorted. When sorted, the smallest box will be on the left, and the largest on the right');
};

const addPhase2Text = () => {
  setText('mid-text', 'The first step is to select the pivot element. The pivot element will be sorted first by comparing it against all other elements');
};

const addPhase3Text = () => {
  setText('mid-text', "It is common to use the first element as the pivot element. Any elements smaller than the pivot element will be moved to the left, and any elements larger than the pivot element will be moved to the right");
} 

const addPhase4Text = () => {
  setText('mid-text', "Let's compare it with the first remaining element");
}

const setUpCompare = () => {
  setText('mid-text', "Let's compare the pivot element to the next element");
  moveContenderToCompare();
  setCompareListener();
}


const cleanUp = () => {
  for( let i = 0; i < toBeCleanedUp.length; i++ ) {
    toBeCleanedUp[i].setAttribute('visible', 'false');
  }
  toBeCleanedUp = [];
};

const moveAndPulsePivot = () => {
  const pulseAnimation = document.createElement('a-animation');
  pulseAnimation.setAttribute('attribute', 'scale');
  pulseAnimation.setAttribute('direction', 'alternate');
  pulseAnimation.setAttribute('dur', '1000');
  pulseAnimation.setAttribute('fill', 'forwards');
  pulseAnimation.setAttribute('to', '1.3 1.3 1.3');
  pulseAnimation.setAttribute('repeat', 'indefinite');

  const moveAnimation = document.createElement('a-animation');
  moveAnimation.setAttribute('attribute', 'position');
  moveAnimation.setAttribute('dur', '2000');
  moveAnimation.setAttribute('to', '0 2 3');

  pivotEl = arrayEls.splice(0, 1)[0];

  pivotEl.appendChild(pulseAnimation);
  pivotEl.appendChild(moveAnimation);
};

const movePositionBy = (element, delta) => {
  const prevPos = element.getAttribute('position');
  const newPos = `${prevPos.x + delta[0]} ${prevPos.y + delta[1]} ${prevPos.z + delta[2]}`;
  element.setAttribute('position', newPos);
};


let phase = 1;

const incrementPhase = () => phase++;

const moveToPhase = (phase) => {
  cleanUp();
  switch (phase) {
    case 1:
      makeArrayElsVisible();
      addPhase1Text();
      break;
    case 2:
      addPhase2Text();
      break;
    case 3:
      addPhase3Text();
      moveAndPulsePivot();
      break;
    case 4:
      addPhase4Text();
      stopPulsingAndMovePivot();
      moveContenderToCompare();
      break;
    case 5:
      compare();
      break;
    default:
      break;
  }
  incrementPhase();
};

const compare = () => {
  debugger
  let comparison = 'smaller';
  let direction = 'left'

  if (elValue(pivotEl) < elValue(contender)) {
    comparison = 'greater';
    direction = 'right';
  }
  setText('mid-text', `In this case, the contender is ${comparison} than the pivot element, so it will be moved to the ${direction}`);
  placeContender(direction);

  if (arrayEls.length > 0) {
    changeNextTextListener();
  } else {
    console.log('finished sorting this round');
  }
};


const leftArray = [];
const rightArray = [];

const placeContender = direction => {
  if (direction === 'left') {
    moveByAnimation(contender, [-4, 0, 0], true);
    leftArray.push(contender);
  } else {
    moveByAnimation(contender, [4, 0, 0], true);
    rightArray.push(contender);
  }
};

const elValue = element => {
  return parseInt(element.id.substr(3));
};

const stopPulsingAndMovePivot = () => {
  pivotEl.innerHTML = '';
  moveByAnimation(pivotEl, [-0.5, 0, 0], true);
};

const moveByAnimation = (element, pos, delta = false) => {
  if (delta) {
    const prevPos = element.getAttribute('position');
    pos = `${pos[0] + prevPos.x} ${pos[1] + prevPos.y} ${pos[2] + prevPos.z}`;
  } else {
    pos = `${pos[0]} ${pos[1]} ${pos[2]}`;
  }

  const moveAnimation = document.createElement('a-animation');
  moveAnimation.setAttribute('attribute', 'position');
  moveAnimation.setAttribute('dur', '2000');
  moveAnimation.setAttribute('to', pos);

  element.appendChild(moveAnimation);
}

const moveContenderToCompare = () => {
  contender = arrayEls.splice(0,1)[0];

  const moveAnimation = document.createElement('a-animation');
  moveAnimation.setAttribute('attribute', 'position');
  moveAnimation.setAttribute('dur', '1500');
  moveAnimation.setAttribute('to', '0.5 2 3');

  contender.appendChild(moveAnimation);
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

// AFRAME.registerComponent('user-facing-text', {
//   init: function () {
//       this.el.setAttribute('scale', "5 5 1");
//   }
// });

const setIntroText = () => {
  setText('top-text', 'Welcome to Quicksort VR!');
  setText('mid-text', "Look at 'Continue' to get started");
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
