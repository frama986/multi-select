/**
 * Main function
 **/
function multiSelectTrasnform(_params) {
    
    var returns = new Array();
    
    var defaultParams = {
        'selector' : 'select[multiple].multiSelect',
        'container' : document,
        'print' : 'value', // value, text, mix
        'hRatio' : 1,
        'height' : null,
        'width' : null
    };
    
    var params = extend(defaultParams, _params);
    
    var ms = params.container.querySelectorAll(params.selector);
    if(ms == null || ms.length == 0)
        return returns;
    
    for(var i = 0; i < ms.length; ++i) {
        var el = ms[i];
        
        var optContainerSize = el.size;
        el.size = 1;
        var id = el.id || Math.floor((Math.random() * 1000) + 1);
        var parent = el.parentElement;
        var options = el.querySelectorAll('option');
        var msWidth = params.width || el.clientWidth;
        var msHeight = params.height || el.clientHeight;
        var containerH = el.clientHeight;
        var msMargin = el.style.margin;
        var msPadding = el.style.padding;
        var msName = el.name;
        
        // Hide and disable select element
        el.style.display = 'none';
        el.disabled = true;
        
        // Main container
        var mainContainer = document.createElement('div');
        mainContainer.className = 'msMainContainer';
        mainContainer.id = 'multiSelect_' + id;
        if(msMargin != null && msMargin != '')
            mainContainer.style.margin = msMargin;
        parent.insertBefore(mainContainer, el);
        
        // Container
        var msContainer = document.createElement('div');
        msContainer.className = 'msContainer';
        msContainer.style.width = msWidth + 'px';
        msContainer.style.height = (msHeight * params.hRatio)+ 'px';
        cloneFont(el, msContainer);
        msContainer.innerText = 'Selezionare un\'opzione';
        
        mainContainer.appendChild(msContainer);
        
        // Options container
        var optionsContainer = document.createElement('div');
        optionsContainer.className = 'msOptionsContainer hidden';
        optionsContainer.style.width = (msWidth + 4) + 'px';
        cloneFont(el, optionsContainer);
        for(var j = 0; j < options.length; ++j) {
            // Option element
            var optContainer = document.createElement('div');
            optContainer.className = 'msOption';
            // Checkbox
            var option = document.createElement('input');
            option.type = 'checkbox';
            option.className = 'msCheckbox';
            option.value = options[j].value;
            if(msName != null && msName != '')
                option.name = msName;
            if(hasAttribute(options[j], 'selected')) {
                option.checked = true;
            }
            
            var label = document.createElement('label');
            label.className = 'msLabel';
            label.appendChild(option);
            label.appendChild(document.createTextNode(options[j].text))
            optContainer.appendChild(label);
            
            optionsContainer.appendChild(optContainer);
            
            bindFunction(optContainer, 'click', function(event) {
                selectOption.call(this, params.print);
            });
        }
        
        mainContainer.appendChild(optionsContainer);
        
        bindFunction(msContainer, 'click', msToggle);
        
        setSelected(msContainer, optionsContainer, params.print);
        
        returns.push(mainContainer);
    }
    bindFunction(params.container, 'click', outBoundEvent);
    
    return returns;
}

/**
 * Toggle checkbox container
 */
function msToggle(event) {
    var msContainer = this;
    var parent = msContainer.parentElement;
    var optionsContainer = parent.querySelector('div.msOptionsContainer');
    
    if(hasClass(optionsContainer, 'hidden')) {
        closeAllMs();
        removeClass(optionsContainer, 'hidden');
        
        if(hasSpace(msContainer, optionsContainer)) {
            optionsContainer.style.top = 
                (msContainer.offsetTop + msContainer.offsetHeight) + 'px';
            optionsContainer.style.left = msContainer.offsetLeft + 'px';
        }
        else {
            optionsContainer.style.top = 
                (msContainer.offsetTop - optionsContainer.offsetHeight) + 'px';
            optionsContainer.style.left = msContainer.offsetLeft + 'px';
        }
    }
    else {
        optionsContainer.className += ' hidden';
    }
}

/**
 * Close all checkbox containers
 */
function closeAllMs() {
    var ms = document.querySelectorAll('div.msOptionsContainer');
    if(ms == null && ms.length < 0)
        return;
    for(var i = 0; i < ms.length; ++i) {
        if(!hasClass(ms[i], 'hidden'))
            ms[i].className += ' hidden';
    }
}

/**
 * Event handler triggered when you click outside of multiselect's elements.
 * Close all checkbox container
 */
function outBoundEvent(event) {
    var target = event.target || event.srcElement;
    var i = 0; // default iterations' number to avoid unnecessary work
    do {
        if(hasClass(target, 'msMainContainer'))
            return;
        target = target.parentElement;
        ++i;
    } while(target != null && i < 10)
    closeAllMs();
}

/**
 * Option selection handler
 */
function selectOption(print) {
    var optionsContainer = this.parentElement;
    var msContainer = 
        optionsContainer.parentElement.querySelector('div.msContainer');
    setSelected(msContainer, optionsContainer, print);
}

/**
 * Set the selected options into the container
 */
function setSelected(msContainer, optionsContainer, print) {
    var opts = optionsContainer.querySelectorAll('input[type=checkbox]');
    var arr = new Array();
    msContainer.innerText = '';
    for(var i = 0; i < opts.length; ++i) {
        if(opts[i].checked) {
            if(print == 'value')
                arr.push(opts[i].value);
            else if(print == 'text')
                arr.push(opts[i].parentElement.innerText);
            else if(print == 'mix')
                arr.push(opts[i].value + ' - ' + opts[i].parentElement.innerText);
        }
    }
    if(arr.length > 0)
        msContainer.innerText = arr.join(', ');
    else
        msContainer.innerText = 'Selezionare un\'opzione';
}

/**
 * Check if the checkbox container has enough space from the bottom of the page
 */
function hasSpace(msContainer, optionsContainer) {
    var intViewportHeight = window.innerHeight || document.documentElement.clientHeight;
    var rect = msContainer.getBoundingClientRect();
    var dim = rect.bottom + optionsContainer.offsetHeight;
    
    if(intViewportHeight > dim)
        return true;
    return false;
}

/**
 * Bind the handler to the element for the desired event
 */
function bindFunction(el, event, handler) {
    if(document.attachEvent)
        el.attachEvent('on'+event, function(e){ handler.call(el, e) });
    else if(document.addEventListener)
        el.addEventListener(event, handler);
}

/**
 * Copy font from the source element to the destination element
 */
function cloneFont(src, dst) {
    var computedStyle =
    (window.getComputedStyle)? window.getComputedStyle(src) : src.currentStyle;
    dst.style.fontStyle = computedStyle.fontStyle;
    dst.style.fontSize = computedStyle.fontSize;
    dst.style.fontFamily = computedStyle.fontFamily;
    dst.style.fontWeight = computedStyle.fontWeight;
}

/**
 * Merge two object in a third one
 */
function extend(def, par) {
    var obj = {};
    for(var p in def) {
        if(par.hasOwnProperty(p))
            obj[p] = par[p];
        else
            obj[p] = def[p];
    }
    return obj;
}

/**
 * Remove the css class
 */
function removeClass(el, cls) {
    el.className = el.className.replace(
        new RegExp('(\\s|^)'+cls+'(\\s|$)'), ' ');
}

/**
 * Check the presence of the css class
 */
function hasClass(el, cls) {
     return el.className.match(
         new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

/**
 * Check if an element has the desired attribute
 */
function hasAttribute(el, attr) {
  return (el.hasAttribute(attr) 
      || el.getAttribute(attr) != null 
      && el.getAttribute(attr) != '' );
}

/**
 * Check if the array already contains a specific item
 */
function arrayContains(arr, k) {
    var res = -1;
    
    for(var i = 0; i < arr.length; ++i) {
        if(arr[i] == k)
            res = i;
    }
    return res;
}