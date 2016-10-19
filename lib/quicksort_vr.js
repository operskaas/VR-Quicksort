import { AFrame } from 'aframe';
import 'aframe-text-component';
import 'aframe-look-at-component';



document.addEventListener('DOMContentLoaded', () => {

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

  const scene = document.querySelector('a-scene');



  const animation = document.createElement('a-animation');
  animation.setAttribute('attribute', 'rotation');
  animation.setAttribute('dur', '1000');
  animation.setAttribute('fill', 'forwards');
  animation.setAttribute('to', '0 360 0');
  animation.setAttribute('repeat', 'indefinite');

  const rotateBox = document.getElementById('rotate-box');
  rotateBox.appendChild(animation);

  const arrEl = document.createElement("a-box");
  arrEl.setAttribute('color', "#cccccc");
  arrEl.setAttribute('position', "0 0 0");
  arrEl.setAttribute('width', '5');
  arrEl.setAttribute('height', '5');
  arrEl.setAttribute('depth', '5');

  scene.appendChild(arrEl);
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