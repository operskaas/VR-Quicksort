import 'aframe';

export const moveCameraAndControls = (destPos) => {
  const camera = document.getElementById('camera-cont');
  moveByAnimation(camera, destPos);

  const controls = document.getElementById('controls');
  moveByAnimation(controls, destPos);
};

export const sumVectors = (v1, v2) => {
  const newVector = [];
  for (var i = v1.length - 1; i >= 0; i--) {
    newVector[i] = v1[i] + v2[i];
  }
  return newVector;
};

// export const moveAndPulsePivot = (pivotEl) => {
//   const pulseAnimation = document.createElement('a-animation');
//   pulseAnimation.setAttribute('attribute', 'scale');
//   pulseAnimation.setAttribute('direction', 'alternate');
//   pulseAnimation.setAttribute('dur', '1000');
//   pulseAnimation.setAttribute('fill', 'forwards');
//   pulseAnimation.setAttribute('to', '1.3 1.3 1.3');
//   pulseAnimation.setAttribute('repeat', 'indefinite');

//   moveByAnimation(pivotEl, [3, 0, 3], true)

//   pivotEl.appendChild(pulseAnimation);
// };

// export const stopPulsingAndMovePivot = (pivotEl) => {
//   pivotEl.innerHTML = '';
//   moveByAnimation(pivotEl, [-0.5, 0, 0], true);
// };

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
  const camera = document.getElementById('camera-cont');
  const cameraPos = camera.object3D.getWorldPosition();
  const destPos = sumVectors([cameraPos.x, cameraPos.y, cameraPos.z], [0.5, -1, -7]);

  moveByAnimation(contender, destPos);
};