# Quick Sort Visualization
### MVP
This will be a step-by-step, user-paced walkthrough of the quicksort algorithm in VR
* Users will be able to click through, step-by-step, the quicksorting of an actual array of numbers
* Number value will be represented by height and color on 3D bars
* The user can input their own numbers at the beginning, or they can click a button to generate a random array

### Languages and Libraries
* HTML and CSS will be used for overall layout and style of site
* JavaScript and jQuery for DOM manipulation
* A-Frame will be used for VR Scene generation and animation
* Webpack to bundle JS files

### WireFrame



### Implementation Timeline
**Day 1**
* Setup webpack.config.js and package.json
* Complete layout and design of site with HTML and CSS
* Write quicksort logic
* Render colored bars representing numbers in array in VR

**Day 2**
* Goal is to try to have visual sorting happen at the click of a button
* Have colored bars indicate when they are the pivot by getting slightly larger, outlined,
and turning white.
* Animate at least one complete sorting step by having bars move
* Ideally, be able to press 'Sort' button, and have random numbers be sorted

**Day 3**
* Finish animating one full sort
* Have brief introduction giving overview of how quicksort works and what the
colored bars represent, with zoomed-in visualization of one step happening

### Bonus Features
* Allow user to input numbers, which will be normalized and turned into colored bars,
and walk through sorting with those inputs, or be able to click button for random numbers
* Explanation of why the algorithm is O(n * log(n)) time, with visualization comparing different sized inputs
* Allow user to switch from using bars as a shape to variously sized circles
