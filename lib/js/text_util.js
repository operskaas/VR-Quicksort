export const addPhase1Text = () => {
  document.getElementById('top-text').setAttribute('visible', 'false');
  setText('mid-text', 'These boxes represent the elements to be sorted. When sorted, the smallest box will be on the left, and the largest on the right');
};

export const addPhase2Text = () => {
  setText('mid-text', 'The first step is to select the pivot element. The pivot element will be sorted first by comparing it against all other elements');
};

export const addPhase3Text = () => {
  setText('mid-text', "It is common to use the first element as the pivot element. Any elements smaller than the pivot element will be moved to the left, and any elements larger than the pivot element will be moved to the right");
}; 

export const addPhase4Text = () => {
  setText('mid-text', "Let's compare it with the first remaining element");
};

export const setIntroText = () => {
  setText('top-text', 'Welcome to Quicksort VR!');
  setText('mid-text', "Look at 'Continue' to get started");
};

export const setText = (id, text, scale = 3) => {
  const textEl = document.getElementById(id);
  textEl.setAttribute('visible', 'true');
  textEl.setAttribute('bmfont-text', `text: ${text}; align: center; width: 750; color: red;`);
  textEl.setAttribute('scale', `${scale} ${scale} ${scale}`);
};
