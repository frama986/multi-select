/**
 * Localization of messages
 */
var messageResources = {'all':'Seleziona tutto', 'select':'Selezionare le opzioni', 'select.title':'Selezionare una o più opzioni dall\'elenco a discesa'};
function $__(key) {
    var ret = messageResources[key] || key;
    return ret;
}

/**
 * Main function
 **/
function multiSelectTrasnform(_params) {
    
    var returns = new Array();
    
    var defaultParams = {
        'selector'   : 'select[multiple].multiSelect',
        'container'  : document,
        'print'      : 'value', // value, text, mix
        'allButton'  : true,
        'hRatio'     : 1,
        'height'     : null,
        'width'      : null,
        'optsWidth'  : null
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
        msContainer.tabIndex = el.tabIndex || 0;
        
        // Text of selected elements
        var msText = document.createElement('div');
        msText.className = 'msText';
        cloneFont(el, msText);
        msText.innerText = $__('select');
        
        if(params.hRatio > 1) {
           msText.style.whiteSpace = 'normal';
        }
        
        // Arrow image
        var msArrow = document.createElement('div');
        msArrow.className = 'msArrow msArrowDown';
        
        msContainer.appendChild(msArrow);
        msContainer.appendChild(msText);
        mainContainer.appendChild(msContainer);
        
        // Options container
        var optionsContainer = document.createElement('div');
        optionsContainer.className = 'msOptionsContainer hidden';
        if(params.optsWidth != null) {
            if(params.optsWidth == 'auto')
                optionsContainer.style.minWidth = msWidth + 'px';
            else if(!isNaN(params.optsWidth))
                optionsContainer.style.width = params.optsWidth + 'px';
        }
        else
            optionsContainer.style.width = msWidth + 'px';
        cloneFont(el, optionsContainer);
        
        // All Button
        if(params.allButton) {
            var btnContainer = document.createElement('div');
            btnContainer.className = 'msOption';
            var allBtn = document.createElement('button');
            allBtn.innerText = $__('all');
            allBtn.className = 'allButton';
            
            btnContainer.appendChild(allBtn);
            optionsContainer.appendChild(btnContainer);
            
            bindFunction(allBtn, 'click', selectAll(mainContainer, params));
        }
        
        // Options element
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
            if(options[j].title != null)
                label.title = options[j].title;
            
            label.appendChild(option);
            label.appendChild(document.createTextNode(options[j].text))
            optContainer.appendChild(label);
            
            optionsContainer.appendChild(optContainer);
            
            bindFunction(optContainer, 'click', function(e) {
                selectOption.call(this, params);
            });
        }
        
        mainContainer.appendChild(optionsContainer);
        
        bindFunction(msContainer, 'click', msToggle);
        
        bindFunction(msContainer, 'keydown', function(e){
            var code = e.keyCode;
            var el = this;
            if(code == 32 || code == 13)
                msToggle.call(el, e);
        });
        
        setSelected(msText, optionsContainer, params);
        
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
    var msArrow = msContainer.querySelector('div.msArrow');
    var parent = msContainer.parentElement;
    var optionsContainer = parent.querySelector('div.msOptionsContainer');
    
    if(hasClass(optionsContainer, 'hidden')) {
        closeAllMs();
        openOptionsContainer(msContainer, optionsContainer);
    }
    else {
        closeOptionsContainer(optionsContainer);
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
            closeOptionsContainer(ms[i]);
    }
}

/**
 * Open options container
 */
function openOptionsContainer(msContainer, optionsContainer) {
    var msArrow = msContainer.querySelector('div.msArrow');
    
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
    optionsContainer.scrollTop = 0;
    setArrowUp(msArrow);
}

/**
 * Close options container
 */
function closeOptionsContainer(optionsContainer) {
    var parent = optionsContainer.parentElement;
    var msArrow = parent.querySelector('div.msArrow');
    
    addClass(optionsContainer,'hidden');
    setArrowDown(msArrow);
}

/**
 * Set arrow up
 */
function setArrowUp(msArrow) {
    removeClass(msArrow, 'msArrowDown');
    addClass(msArrow, 'msArrowUp');
}

/**
 * Set arrow down
 */
function setArrowDown(msArrow) {
    removeClass(msArrow, 'msArrowUp');
    addClass(msArrow, 'msArrowDown');
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
function selectOption(params) {
    var optionsContainer = this.parentElement;
    var msText = 
        optionsContainer.parentElement.querySelector('div.msContainer div.msText');
    setSelected(msText, optionsContainer, params);
}

/**
 * Set the selected options into the container
 */
function setSelected(msText, optionsContainer, params) {
    var opts = optionsContainer.querySelectorAll('input[type=checkbox]');
    var arr = new Array();
    var title = new Array();
    var print = params.print;
    msText.innerText = '';
    for(var i = 0; i < opts.length; ++i) {
        if(opts[i].checked) {
            if(print == 'value')
                arr.push(opts[i].value);
            else if(print == 'text')
                arr.push(opts[i].parentElement.innerText);
            else if(print == 'mix')
                arr.push(opts[i].value + ' - ' + opts[i].parentElement.innerText);
            title.push(opts[i].parentElement.innerText);
        }
    }
    
    if(arr.length > 0) {
        msText.innerText = 
            trimToPixel(
                arr.join(', ')
                , (msText.clientWidth * params.hRatio), msText.style.font);
        msText.title = title.join(', ');
    }
    else {
        msText.innerText = $__('select');
        msText.title = $__('select.title');
    }
}

/**
 *
 */
function selectAll(mainContainer, params) {
    
    return function() {
        
        var optionsContainer = mainContainer.querySelector('div.msOptionsContainer');
        var options = mainContainer.querySelectorAll('.msOption input[type=checkbox]');
        var msText = mainContainer.querySelector('div.msText');
        var i;
        
        if(options.length == 0)
            return;
        
        // All checked?
        for(i = 0; i < options.length; ++i) {
            if(!options[i].checked)
                break;
        }
        if(options.length == i){ // unselect all
            for(i = 0; i < options.length; ++i)
                options[i].checked = false;
        }
        else { // select All
            for(i = 0; i < options.length; ++i)
                options[i].checked = true;
        }
        setSelected(msText, optionsContainer, params);
    };
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
    
    var fnt = computedStyle.fontStyle + " " 
            + computedStyle.fontVariant + " "
            + computedStyle.fontWeight + " "
            + computedStyle.fontSize + " "
            + computedStyle.fontFamily;
    
    if(dst != null)
        dst.style.font = fnt;
    
    return fnt;
}

/**
 * Calculate the visual length in pixel of a string
 */
function textLenght(msg, fnt) {
    var tmp = document.createElement('span');
    tmp.style.position = 'absolute';
    tmp.style.visibility = 'hidden';
    tmp.style.whiteSpace = 'nowrap';
    if(fnt != null)
        tmp.style.font = fnt;
    tmp.innerText = msg;
    document.body.appendChild(tmp);
    var size = tmp.clientWidth;
    document.body.removeChild(tmp);
    return size;
}

/**
 * Trucate the string at a desired length expressed in pixel.
 */
function trimToPixel(str, len, fnt) {
    var tmp = str;
    var trimmed = str;
    len -= 3;
    
    if(textLenght(tmp, fnt) > len) {
        trimmed +=  '...';
        while(textLenght(trimmed, fnt) > len) {
            tmp = tmp.substring(0, tmp.length-1);
            trimmed = tmp + '...';
        }
    }
    
    return trimmed;
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
 * Add css class
 */
function addClass(el, cls) {
    if(hasClass(el, cls))
        return;
    el.className += ' ' + cls;
}

/**
 * Remove css class
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