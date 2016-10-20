import 'aframe';
import 'aframe-text-component';
import 'aframe-look-at-component';



const valsToBeSorted = [];

for (var i = 0; i < 10; i++) {
  valsToBeSorted.push(Math.floor(Math.random() * 100));
}



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

  AFRAME.registerComponent('array-element', {
    init: function () {
        this.el.setAttribute('color', "#cccccc");
        this.el.setAttribute('position', "0 0 0");
        this.el.setAttribute('width', '0.5');
        this.el.setAttribute('height', '1');
        this.el.setAttribute('depth', '0.5');
    }
  });

  AFRAME.registerComponent('user-facing-text', {
    init: function () {
        this.el.setAttribute('look-at', "#user");
        this.el.setAttribute('material', "color: red");
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