# multi-select-js
###Simple pure javascript multiselect

Transforms HTML multiple select elements into select with checkboxes.

#####Usage
* Import the needed files into yours HTML page

	<script src="multiSelect.js"></script>
	<link rel="STYLESHEET" type="text/css" href="mSelectStyle.css">
	
* Use the function

	multiSelectTrasnform(parameters);
	

* Default parameters

	{
        'selector' : 'select[multiple].multiSelect',
        'container' : document,
        'print' : 'value', // value, text, mix
        'hRatio' : 1,
        'height' : null,
        'width' : null
    };
	
