# Hand Drawn Path Matcher Training

This is the repository for [this website](https://phlippflap.github.io/hand-drawn-path-matcher-training/) hosted on GitHub Pages designed to train an algorithm that learns to detect hand-drawn paths. 
The algorithm is inspired by the [Viola-Jones Face detection algorithm](https://en.wikipedia.org/wiki/Viola%E2%80%93Jones_object_detection_framework) and uses a similar version of Ada-boost.
It is possible to download the project file including the learned parameters of the algorithm as JSON file once the training is finished.
I am planning to write standalone software that can detect hand-drawn paths given those parameters. Currently that is not available. However, you can take a look at the evaluation code used for fine-tuning written in python in [evaluation.py](python/combined/evaluation.py) to understand how the evaluation algorithm works (and to adapt it to your use case).

This project is written with [React](https://react.dev/) using [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction) for state management and uses [Pyodide](https://github.com/pyodide/pyodide) to execute python code for training and evaluation in the browser.

![Example](https://github.com/PhlippFlap/hand-drawn-path-matcher-training/blob/main/example.gif)

## What is a hand-drawn path

We define a hand-drawn path as a path (defined by a sequence of 2d coordinates) that you can draw by hand in one step (without lifting the pen).
The algorithm is sensitive to the starting point, the direction of the drawn path and the rotation of the path. For instance, a 'z' drawn starting from the top left point is considered different to a 'z' drawn starting from the bottom right point. Additionally, the algorithm distinguishes an 'o' drawn starting at the top and then going to the left and an 'o' starting at the top and then going to the right.
However, the algorithm is not sensitive to the exact placement and number of points on the path as long as the path described by those points is the same. Also, the algorithms is not sensitive to scaling and translation of the input path.

The website allows you to specify a 'symbol name' for each class of paths. This way you can keep track of which path classes belongs to which symbol. For instance, you could have one path class for the 'z' starting at the top left and the 'z' starting at the bottom left and set the symbol name of both of these path classes to 'z'.

## Workflow

The workflow for training the algorithm using the [website](https://phlippflap.github.io/hand-drawn-path-matcher-training/) looks like the following

1. **Create project:** Go to the website and choose 'Create new empty project' or 'Load default project' (after waiting for Pyodide to load).
2. **Add path classes:** Use the menu on the left to create the path classes (also called sequence classes) you want.
3. **Add positive training examples**: Click on each of them and click on the button 'Add new' to add some paths by hand (draw in the canvas, repeat). If you drew a wrong path, you can use the 'Remove' button to remove it. If you start drawing the next path, the previous path is automatically stored. You can also remove paths later when clicking on the 'Edit' button on top of the 'Add new' button.
4. **Add negative training examples:** Click on the 'Negatives' button on the left to add negative training examples. These should be paths that should not be classified as any of your path classes. It is crucial to have a considerable amount of negative training examples for the algorithm. However, you can always add more training examples later or when fine-tuning.
5. **Training:** Switch the mode of the page to 'Training Mode' using the button at the top of the page. Then click on 'Train all'. You can retrain at any time.
6. **Fine-tuning:** Now you can test the algorithm by clicking on any of your path classes on the left and clicking on 'Fine-tune'. A canvas will appear on which you can draw paths. The website will tell you how the path was classified and you can add the path as positive or negative training example if you want and potentially retrain. This way you can iteratively enhance the algorithm.
7. **Saving:** You can at any time download the current state of the project as JSON (including training parameters when you trained at least once) by using the download button at the top right. You can then later upload the project again when loading the page. If you want to start from scratch or load a project from a JSON file, just reload the page (WARNING: Any unsaved progress will be lost).

In general, the algorithm handles paths with straight lines and sharp edges better than curvy paths, so these should need less training examples. If your paths are very long or complicated it could be required to adapt the "maxWeakLearnerCount" or "targetPointCount" parameters of the algorithm which you can do by editing them in the project JSON file.

## How the algorithm works

The training and evaluation algorithms are inspired by the [Viola-Jones Face detection algorithm](https://en.wikipedia.org/wiki/Viola%E2%80%93Jones_object_detection_framework).
Similar to the Viola-Jones Face detection algorithm it uses cascading Ada-boost to combine a list multiple weak learners to a strong learner. 

### Normalization

First, all paths are brought to a 'normalized from' by applying the following steps:

- **Equi-spaceout:** A fixed number of points is distributed on the path such that those points all have equal distance to their neighboring points (measured along the path). Those points are then taken as the new path. This way the algorithm is not sensitive to the number of points in the path and to how fast the path was drawn (faster drawing yields less points when using a mouse).
The number of points distributed is controlled by the "targetPointCount" parameter and is 20 by default. It is not a problem to change this parameter in an existing project.
- **Translation and Scaling:** The center of mass of the new path is then moved to (0,0) by translating the points. Additionally, the points are scaled by the inverse of the length of the path such that the path has length 1. This way algorithm is not sensitive to scaling and translation of the path.

### Decimation

A single decimation step removes the most "unimportant" point in the path: It removes the point which spans the smallest angle, so the point whose incident path segments have the smallest angle deviation. The decimated version of a path with $x$ points is then the path to which the decimation step was applied to until $x$ points were left.
For each path, all decimated versions are stored up to the point where the path consists of a single line (2 points).

### Strong Learner

A single strong learner is used to classify a single path class: It iterates over its list of weak learners. As soon as one weak learner rejects, the strong learner reject as well (it is evaluated to not be part of the path class). If all weak learners accept, the strong learner accepts as well.

### Weak Learner

A weak learner decides if a given path is accepted or not depending on the following parameters:
- decimation level
- start index
- end index
- 2D position vector (also called center of mass)
- radius

The weak learner computes the vector $v$ from the point on the path with index *start index* to the point on the path with index *end index* of the decimated version of the path with *decimation level* many points.
If the distance of $v$ to the *position* is within *radius*, the weak learner accepts. Otherwise, it rejects.
It is called weak learner because it is not particularly good at classifying correctly but better than chance.

### Training

A single strong learner used to classify a path class is trained as follows:
It first generates all possible combinations of decimation level, start index and end index and initializes a weak learner for each of them. 
The parameters 2D position and radius are learned from the positive training examples: 
- The 2D position is chosen to be the center of mass of all distance vectors computed from start index, end index and decimation level like $v$ before.
- The radius is chosen to be minimal such that all positive training examples are accepted. This also means that positive training examples will never get rejected by the classifier.

The best weak learner is then chosen as the weak learner which rejects most negative training examples. This is also the reason why it is important to have many negative training examples.
The chosen weak learner is than added to the list of weak learners of the strong learner. Also, the negative training examples that were "ruled out" by the chosen weak learner are excluded in the following iterations.
The whole process is then repeated until no more negative examples are left but at most as often as the value of the parameter "maxWeakLearnerCount" which is 10 by default. 
It is not a problem to change this parameter in an existing project if needed.
If, for instance, the paths in the path class are sequences of $n$ connected straight lines, this parameter should be chosen to be at least $n$.


## Project structure

The python code for training and evaluating is located in [python/](python/). Since Pyodide loads the training and evaluation scripts from single .txt files located in [src/scripts/](src/scripts/), the relevant parts of the python code are combined to training and evaluation scripts located in [python/combined/](python/combined/). The code in the .txt files is then an exact copy of the code in those python files. 

The Zustand stores are located in [src/stores/](/src/stores).


## Contributing

If you want to contribute to this project, it is probably best to make a new issue. Currently I am the only contributor of this project but I welcome anyone that is interested. If you have a feature request or found a bug, please also create an issue for that.
