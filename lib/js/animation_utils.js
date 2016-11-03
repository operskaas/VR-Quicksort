import 'aframe';

export const moveCameraAndControls = destPos => {
  const camera = document.getElementById('camera-cont');
  moveByAnimation(camera, destPos);

  const controlsDestPos = sumVectors(destPos, [0, -2, -15]);
  const controls = document.getElementById('controls');
  moveByAnimation(controls, controlsDestPos);
};

export const sumVectors = (v1, v2) => {
  const newVector = [];
  for (var i = v1.length - 1; i >= 0; i--) {
    newVector[i] = v1[i] + v2[i];
  }
  return newVector;
};

export const moveByAnimation = (element, pos, delta = false, cb = () => {}) => {
  if (delta) {
    const prevPos = element.object3D.position;
    pos = `${pos[0] + prevPos.x} ${pos[1] + prevPos.y} ${pos[2] + prevPos.z}`;
  } else {
    pos = `${pos[0]} ${pos[1]} ${pos[2]}`;
  }

  const animDur = '350'

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

export const moveContenderToCompare = contender => {
  const camera = document.getElementById('camera-cont');
  const cameraPos = camera.object3D.getWorldPosition();
  const destPos = sumVectors([cameraPos.x, cameraPos.y, cameraPos.z], [0.3, -1, -7]);

  moveByAnimation(contender, destPos);
};

export const shiftAllEls = node => {
  let shift = -0.5;
  for (var i = 0; i < node.els.length - 1; i++) {
    moveByAnimation(node.els[i], [shift, 0, 0], true);
  }
};

export const moveAllElsToCenter = node => {
  const leftBound = -(node.els.length / 4);
  node.els.forEach((el, idx) => {
    const destPos = sumVectors(node.position, [(leftBound + idx/2), 0, 0]);
    moveByAnimation(el, destPos);
  });
};