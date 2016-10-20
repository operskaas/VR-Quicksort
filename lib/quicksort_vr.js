import 'aframe';
import 'aframe-text-component';
import 'aframe-look-at-component';

const NUM_ELS = 12;

const EL_IDS = ['el-1', 'el-2', 'el-3', 'el-4', 'el-5', 'el-6', 'el-7', 'el-8', 'el-9', 'el-10', 'el-11', 'el-12'];
const EL_X_POSITIONS = EL_IDS.map((id, idx) => {
  return -((EL_IDS.length - 1) / 2) + idx;
});

const setElHeights = () => { 
  const elXPositions = EL_X_POSITIONS.slice();

  EL_IDS.forEach((elId, idx) => {
    const el = document.getElementById(elId);
    const numEls = EL_IDS.length;
    el.setAttribute('height', `${0.5 + idx/5}`);
    const blueHex = Math.floor(17 + ((255 - 17) * (idx / numEls))).toString(16);
    el.setAttribute('material', `color:#7777${blueHex}`);
    const randPositionIdx = Math.floor(Math.random() * elXPositions.length);
    const x = elXPositions.splice(randPositionIdx, 1);
    el.setAttribute('position', `${x} 1 2`);
  });
};

const generateValsToBeSorted = () => {
  const valsToBeSorted = [];

  for (var i = 0; i < NUM_ELS; i++) {
    valsToBeSorted.push(Math.floor(Math.random() * 100));
  }  

  return valsToBeSorted;
};

const generateArrayEls = (valsToBeSorted) => {
  const arrayEls = valsToBeSorted.map((val, idx) => {
    new ArrayElement(val, idx);
  });
  return arrayEls;
};





document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('a-scene');
  scene.addEventListener('loaded', () => {


    const valsToBeSorted = generateValsToBeSorted();
    setElHeights();


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
