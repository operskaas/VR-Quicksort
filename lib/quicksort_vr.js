import 'aframe';
import 'aframe-text-component';
import 'aframe-look-at-component';

const NUM_ELS = 12;

const EL_IDS = ['el-1', 'el-2', 'el-3', 'el-4', 'el-5', 'el-6', 'el-7', 'el-8', 'el-9', 'el-10', 'el-11', 'el-12'];
const EL_X_POSITIONS = EL_IDS.map((id, idx) => {
  return -((EL_IDS.length - 1) / 2) + idx;
});

let arrayEls;

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
    arrayEl.setAttribute('position', `${x} 1 0`);
    arrayEl.setAttribute('visible', `false`);
  });
};

const makeArrayElsVisible = () => {
  arrayEls.forEach(arrayEl => arrayEl.setAttribute('visible', 'true'));
};

// const makeStartingElsInvisible = () => {
//   const startingTexts = document.getElementsByClassName('starting-el');
//   for (let i = 0; i < startingTexts.length; i++) {
//     startingTexts[i].setAttribute('visible', 'false');
//   }
// };

let toBeCleanedUp = document.getElementsByClassName('starting-el');

const addPhase1Text = () => {
  addTemporaryText('These boxes represent the array elements to be sorted', '-8.6 6 0');
  addTemporaryText('Their values are represented by varying heights and color shades', '-10 5 0');
  addTemporaryText('When sorted, the smallest box will be on the left, and the largest on the right', '-11.3 4 0');
};

const addPhase2Text = () => {
  addTemporaryText('The first step is to select the pivot element', '-6.87 5 0');
  addTemporaryText('The pivot element will be sorted first by comparing it against all other elements', '-12 4 0');
};

const addTemporaryText = (text, position) => {
  const textEl = document.createElement('a-entity');
  textEl.setAttribute('text', `text: ${text}`);
  textEl.setAttribute('position', position);
  textEl.setAttribute('material', 'color:#60BC5A');  

  toBeCleanedUp.push(textEl);

  const scene = document.querySelector('a-scene');
  scene.appendChild(textEl);
};

const addPhase3Text = () => {
  addTemporaryText('');
}

const cleanUp = () => {
  for( let i = 0; i < toBeCleanedUp.length; i++ ) {
    toBeCleanedUp[i].setAttribute('visible', 'false');
  }
  toBeCleanedUp = [];
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
      break;
    default:
      break;
  }
  incrementPhase();

};

const changeStartText = () => {
  const startText = document.getElementById('next-text');
  startText.setAttribute('text', 'text: Continue');
  startText.setAttribute('position', '-1.33 2.8 0.5');

  const startBox = document.getElementById('start-box');
  startBox.setAttribute('scale', '3.25 1 1');
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

    // AFRAME.registerComponent('cursor-listener', {
    //   init: function () {
    //     var COLORS = ['red', 'green', 'blue'];
    //     this.el.addEventListener('click', function (evt) {
    //       var randomIndex = Math.floor(Math.random() * COLORS.length);
    //       this.setAttribute('material', 'color', COLORS[randomIndex]);
    //       console.log('I was clicked at: ', evt.detail.intersection.point);
    //     });
    //   }
    // });


    AFRAME.registerComponent('user-facing-text', {
      init: function () {
          this.el.setAttribute('look-at', "#user");
          this.el.setAttribute('material', "color: red");
      }
    });




    // const animation = document.createElement('a-animation');
    // animation.setAttribute('attribute', 'rotation');
    // animation.setAttribute('dur', '1000');
    // animation.setAttribute('fill', 'forwards');
    // animation.setAttribute('to', '0 360 0');
    // animation.setAttribute('repeat', 'indefinite');

    // const rotateBox = document.getElementById('rotate-box');
    // rotateBox.appendChild(animation);

  });

});
