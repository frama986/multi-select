# multi-select-js
###Simple pure javascript multiselect

Transforms HTML multiple select elements into multiselect with checkboxes.

#####Usage
* Import the needed files into yours HTML page
```
	<script src="multiSelect.js"></script>
	<link rel="STYLESHEET" type="text/css" href="mSelectStyle.css">
```
* Use the provided function in your code. You can modify the output passing a parameters object.
```
	multiSelectTrasnform(parameters);
```

#####The option parameters
The default parameters are
```
	{
        'selector' : 'select[multiple].multiSelect',
        'container' : document,
        'print' : 'value',
        'hRatio' : 1,
        'height' : null,
        'width' : null
    };
```	

* **selector** string selector used to find the select elements.
* **container** the container where to look for the select elements.
* **print** wich element of select print. Possible value are: *value*, *text* or *mix*.
* **hRatio** modify the height of the multiselect.
* **height** the height of the multiselect (default is the original select's height).
* **width** the width of the multiselect (default is the select's width).
