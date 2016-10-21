import 'aframe';
import 'aframe-text-component';
import 'aframe-look-at-component';

const NUM_ELS = 12;

const EL_IDS = ['el-1', 'el-2', 'el-3', 'el-4', 'el-5', 'el-6', 'el-7', 'el-8', 'el-9', 'el-10', 'el-11', 'el-12'];
const EL_X_POSITIONS = EL_IDS.map((id, idx) => {
  return -((EL_IDS.length - 1) / 2) + idx;
});

let arrayEls;
let pivotEl;

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

let toBeCleanedUp = document.getElementsByClassName('starting-el');

const setText = (id, text, xPos, scale = 1) => {
  const textEl = document.getElementById(id);
  textEl.setAttribute('visible', 'true');
  textEl.setAttribute('text', `text: ${text}`);
  let yPos = 7.5;
  if (id === 'mid-text') {
    yPos = 6.5;
  } else if (id === 'bot-text') {
    yPos = 5.5;
  }
  textEl.setAttribute('position', `${xPos} ${yPos} 0`);
  textEl.setAttribute('scale', `${scale} ${scale} ${scale}`);

  toBeCleanedUp.push(textEl);
};

const addPhase1Text = () => {
  setText('top-text', 'These boxes represent the elements to be sorted', '-7.8');
  setText('mid-text', 'When sorted, the smallest box will be on the left,', '-7.55');
  setText('bot-text', 'and the largest on the right', '-4.3');
};

const addPhase2Text = () => {
  setText('top-text', 'The first step is to select the pivot element', '-6.87');
  setText('mid-text', 'The pivot element will be sorted first,', '-5.9');
  setText('bot-text', 'by comparing it against all other elements', '-6.6');
};

const addPhase3Text = () => {
  setText('top-text', 'It is common to use the first element as the pivot element', '-8');
  setText('mid-text', 'Any elements smaller than the pivot element will be moved to the left', '-9.5');
  setText('bot-text', "Any elements larger than the pivot element will be moved to it's right", '-9.5');
}

const addPhase4Text = () => {
  setText('top-text', "Let's compare it with the first remaining element", '-7');

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
  moveAnimation.setAttribute('to', '0 0 1');

  pivotEl = arrayEls.splice(0, 1)[0];

  pivotEl.appendChild(pulseAnimation);
  pivotEl.appendChild(moveAnimation);
};

const moveToPhase = (phase) => {
  cleanUp();
  switch (phase) {
    case 1:
      makeArrayElsVisible();
      addPhase1Text();
      changeStartText();
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

    default:
      break;
  }
  incrementPhase();

};

const changeStartText = () => {
  const startText = document.getElementById('next-text');
  startText.setAttribute('text', 'text: Continue');
  startText.setAttribute('position', '-1.33 -0.2 0.5');

  const startBox = document.getElementById('start-box');
  startBox.setAttribute('width', '3.25');
  movePositionBy(startBox, [3, 0, 0]);
};

const movePositionBy = (element, delta) => {
  const prevPos = element.getAttribute('position');
  const newPos = `${prevPos.x + delta[0]} ${prevPos.y + delta[1]} ${prevPos.z + delta[2]}`;
  element.setAttribute('position', newPos);
};

let phase = 1;

const incrementPhase = () => phase++;

const setListenerOnStartBox = () => {
  const startBox = document.getElementById('start-box');
  startBox.addEventListener('click', (e) => {
    moveToPhase(phase);
  });
};



document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('a-scene');
  scene.addEventListener('loaded', () => {

    arrayEls = randomElOrder();

    setListenerOnStartBox();

    setElHeights(arrayEls);

    AFRAME.registerComponent('user-facing-text', {
      init: function () {
          this.el.setAttribute('look-at', "#user");
          this.el.setAttribute('material', "color: red");
      }
    });


  });

});
