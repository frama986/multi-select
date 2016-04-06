# multi-select-js
###Simple pure javascript multiselect

Transforms HTML multiple select elements into multiselect with checkboxes.

#####Usage
* Import the needed files into yours HTML page
```
	<script src="multiSelect.js"></script>
	<link rel="STYLESHEET" type="text/css" href="mSelectStyle.css">
```
* Edit the *msArrow* CSS class by setting the right image path to reach arrow_11x13.png image.
* Use the provided function in your code. You can modify the output passing parameters as js object.
```
	multiSelectTrasnform(parameters);
```
* It is also possible set the localized text, simply by changing the strings into *messageResources* object.

#####The option parameters
The default parameters are
```
	{
        'selector'   : 'select[multiple].multiSelect',
        'container'  : document,
        'print'      : 'value',
		'allButton'  : true,
        'hRatio'     : 1,
        'height'     : null,
        'width'      : null,
		'optsWidth'  : null
    };
```	

* **selector** string selector used to find the select elements.
* **container** the container where to look for the select elements.
* **print** wich element of select print. Possible value are: *value*, *text* or *mix*.
* **allButton** set to *true* to add a button for the selection of all options. 
* **hRatio** changes the height of the multiselect.
* **height** the height in pixel of the multiselect (default is the original select's height).
* **width** the width in pixel of the multiselect (default is the select's width).
* **optsWidth** determines the width of the options container. If its value is a *number* defines the width in pixel, if its value is set to *auto* the min width is set to the value of select's width, if its value is *null* the width is set to the value of select's width.