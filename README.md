# Quicksort VR
[Live](https://operskaas.github.io/VR-Quicksort)

Quicksort VR is a 3D visualization of a non-optimal, recursive quicksort algorithm implementation.
It is written in JavaScript and HTML and uses the [A-Frame](https://github.com/aframevr/aframe) framework

## Usage
Quicksort VR is compatible with most modern browsers, including mobile Chrome. 

Simply go to the live site from a browser and click to drag the white cursor onto the Continue block. 

If you have a Google Cardboard, and are on a mobile device, press the button on the bottom left of the window and place your mobile device into the Google Cardboard. The white cursor follows your gaze, so simply turn your head to hover over the Continue block.

To continue, you must move the cursor away from the block, and then back onto the block. 

![Quicksort VR](docs/walkthrough.gif)

## Setup
After selecting 'Continue' the first time, 12 blocks representing array elements will be randomly arranged and made visible. Their colors are generated by three out of phase sine waves providing rgb values equally spaced along one period. 

## Algorithm & Tree Nodes
The quicksort algorithm being visualized here is a recursive algorithm, and is certainly not an optimal implementation of quicksort.

Each group of elements to be sorted is modeled as an instance of the SortingTreeNode class. This instance contains information about it's center position, whether it is sorted, references to it's parent and child nodes, a reference to it's pivot element if it has one, and a reference to it's non-sorted elements.

The algorithm selects the first element of the array as the pivot element, and compares each remaining element to this pivot element. Elements with a lesser value (represented by a smaller block) will be moved to the current node's left node, and larger elements are moved to the right. These left and right nodes are then sorted the same way if they have 2 or more elements in them. If they have one or less elements, they are considered sorted (the base case), and are skipped. When both side nodes of a node are sorted, the side nodes are concatenated with the pivot element, and the algorithm will move on to the parent node.

 