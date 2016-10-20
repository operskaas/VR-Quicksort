import 'aframe';
import 'aframe-text-component';
import 'aframe-look-at-component';

const NUM_ELS = 10;

const EL_IDS = ['el-1', 'el-2', 'el-3', 'el-4', 'el-5'];
const EL_POSITIONS = ['']

const setElHeights = () => {
  EL_IDS.forEach((elId, idx) => {
    const el = document.getElementById(elId);
    el.setAttribute('height', `${0.5 + idx/5}`);
    const blueHex = Math.floor(17 + ((255 - 17) * (idx / EL_IDS.length))).toString(16);
    el.setAttribute('material', `color:#0000${blueHex}`);
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

class ArrayElement {
  constructor(value, idx) {
    this.value = value;
    this.idx = idx;
    this.DOMNode = this.createElement();
    this.appendDOMNode();
  }

  createElement() {
    const el = document.createElement('a-entity');
    const height = 2 * (this.value / 100)
    el.setAttribute('geometry', `primitive: box; height: ${height}; width: 0.5; depth: 0.5;`);
    el.setAttribute('material', `color: #0000cc`);
    el.setAttribute('cursor-listener', '');
    el.className = 'clickable';

    const x = -(NUM_ELS / 2) + (this.idx);
    el.setAttribute('position', `${x} 1 0`);

    el.setAttribute('scale', `1 1 1`);
    return el;
  }

  appendDOMNode() {
    const elContainer = document.querySelector('#el-container');
    elContainer.appendChild(this.DOMNode);
  }
}




document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('a-scene');
  scene.addEventListener('loaded', () => {
    const valsToBeSorted = generateValsToBeSorted();
    setElHeights();

    // const arrElements = generateArrayEls(valsToBeSorted);


    AFRAME.registerComponent('cursor-listener', {
      init: function () {
        var COLORS = ['red', 'green', 'blue'];
        this.el.addEventListener('click', function (evt) {
          var randomIndex = Math.floor(Math.random() * COLORS.length);
          this.setAttribute('material', 'color', COLORS[randomIndex]);
          console.log('I was clicked at: ', evt.detail.intersection.point);
        });
      }
    });

    // AFRAME.registerComponent('array-element', {
    //   init: function () {
    //       this.el.setAttribute('color', "#cccccc");
    //       this.el.setAttribute('position', "0 0 0");
    //       this.el.setAttribute('width', '0.5');
    //       this.el.setAttribute('height', '1');
    //       this.el.setAttribute('depth', '0.5');
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



  // const box = document.querySelector('a-box');
  // box.addEventListener('mouseenter', function () {
  //   box.setAttribute('scale', {
  //     x: 4,
  //     y: 1,
  //     z: 6
  //   });
  // });  

  // box.addEventListener('mouseleave', function () {
  //   box.setAttribute('scale', {
  //     x: 1,
  //     y: 1,
  //     z: 1
  //   });
  // });