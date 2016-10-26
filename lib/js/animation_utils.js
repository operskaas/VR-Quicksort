import 'aframe';

export const moveCameraAndControls = (direction) => {
  const deltaX = direction === 'left' ? -4 : 4 ;
  const delta = [deltaX, 0, 1]
  const camera = document.querySelector('a-camera');
  moveByAnimation(camera, delta, true);

  const controls = document.getElementById('controls');
  moveByAnimation(controls, delta, true);
};

export const moveAndPulsePivot = (pivotEl) => {
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

  pivotEl.appendChild(pulseAnimation);
  pivotEl.appendChild(moveAnimation);
};

export const stopPulsingAndMovePivot = (pivotEl) => {
  pivotEl.innerHTML = '';
  moveByAnimation(pivotEl, [-0.5, 0, 0], true);
};

export const moveByAnimation = (element, pos, delta = false, cb = () => {}) => {
  if (delta) {
    const prevPos = element.object3D.position;
    pos = `${pos[0] + prevPos.x} ${pos[1] + prevPos.y} ${pos[2] + prevPos.z}`;
  } else {
    pos = `${pos[0]} ${pos[1]} ${pos[2]}`;
  }

  const animDur = '2000'

  const moveAnimation = document.createElement('a-animation');
  moveAnimation.setAttribute('attribute', 'position');
  moveAnimation.setAttribute('dur', animDur);
  moveAnimation.setAttribute('to', pos);
  element.appendChild(moveAnimation);

  setTimeout(() => {
    element.removeChild(moveAnimation);
    cb();
    }, parseInt(animDur)
  );
}

export const moveContenderToCompare = (contender) => {
  const moveAnimation = document.createElement('a-animation');
  moveAnimation.setAttribute('attribute', 'position');
  moveAnimation.setAttribute('dur', '1500');
  moveAnimation.setAttribute('to', '0.5 2 3');

  contender.appendChild(moveAnimation);
};