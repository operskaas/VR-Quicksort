import 'aframe';

export const addPhase1Text = () => {
  document.getElementById('top-text').setAttribute('visible', 'false');
  setText('mid-text', 'These boxes were randomly shuffled, and need to be sorted! We will use a recursive quicksort algorithm to sort them');
};

export const addPhase2Text = () => {
  setText('mid-text', 'The first step is to select the pivot element. The pivot element will be compared against all other elements');
};

export const addPhase3Text = () => {
  setText('mid-text', "It is common to use the first element as the pivot element. Any elements smaller than the pivot element will be moved to the left, and any elements larger than the pivot element will be moved to the right");
}; 

export const addPhase3HalfText = () => {
  setText('mid-text', "After moving elements to the left or right, we will need to then recursively sort the left and right segments. When a segment has one or zero elements in it, we will know it is sorted, and if both the left and right are sorted, we will combine them with the pivot element in the middle");
}; 

export const addPhase4Text = () => {
  setText('mid-text', "Let's bring in the first contender!");
};

export const setIntroText = () => {
  setText('top-text', 'Welcome to Quicksort VR!');
  setText('mid-text', "Grab the screen to move the white cursor. If you have a Google Cardboard, press the button in the lower right!");
};

export const setText = (id, text, scale = 3) => {
  const textEl = document.getElementById(id);
  textEl.setAttribute('visible', 'true');
  textEl.setAttribute('bmfont-text', `text: ${text}; align: center; width: 750; color: white;`);
  textEl.setAttribute('scale', `${scale} ${scale} ${scale}`);
};