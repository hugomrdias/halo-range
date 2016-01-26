(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = require('./src/range');


},{"./src/range":2}],2:[function(require,module,exports){
'use strict';

var utils = require('./utils');

function Range(element, options) {
    if (!(this instanceof Range)) {
        return new Range(element, options);
    }

    this.options = options || {};
    this.element = element;
    this.tooltip = this.options.tooltip || utils.findOutput(this.element);
    this.colorLower = this.options.colorLower || '#5082e0';
    this.colorUpper = this.options.colorUpper || '#cccccc';
    this.thumbWidth = this.options.thumbWidth || 16;
    this.style = utils.insertSheet('test');

    this.element.addEventListener('input', this);
    this.element.addEventListener('touchstart', this);
    this.element.addEventListener('touchend', this);
    this.element.addEventListener('blur', this);
    this.onInput();
}

module.exports = Range;

Range.prototype.handleEvent = function(e) {
    switch (e.type) {
        case 'input':
            this.onInput(e);
            break;
        case 'touchstart':
            this.onTouchStart(e);
            break;
        case 'touchend':
            this.onTouchEnd(e);
            break;
        case 'blur':
            this.onBlur(e);
            break;
        default:
            break;
    }
};

Range.prototype.onTouchStart = function() {
    this.element.classList.add('Range--active');
};

Range.prototype.onTouchEnd = function() {
    // this.element.blur();
    // this.element.focus();
    this.element.classList.remove('Range--active');
};

Range.prototype.onInput = function() {
    // utils.clearRules(this.sheet);
    if (utils.prefix.lowercase === 'webkit') {
        // try {
        //     this.sheet.sheet.insertRule(utils.calculateWebkitFill(this.element, '.Range'), 0);
        // } catch (e) {
        //     return null;
        // }
        this.style.textContent = utils.calculateWebkitFill(this.element, '.Range', this.colorLower, this.colorUpper);
    }
    utils.updateTooltip(this.element, this.tooltip, this.thumbWidth);

    if (this.element.value === this.element.getAttribute('min')) {
        this.element.classList.add('Range--initial');
    } else {
        this.element.classList.remove('Range--initial');
    }
};

Range.prototype.onBlur = function() {
    this.element.classList.remove('Range--active');
};

},{"./utils":3}],3:[function(require,module,exports){
'use strict';
var Utils = {};

Utils.prefix = (function() {
    var styles = window.getComputedStyle(document.documentElement, '');
    var pre = (Array.prototype.slice
        .call(styles)
        .join('')
        .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1];
    var dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

    return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1)
    };
})();

Utils.insertSheet = function insertSheet(id) {
    var style = document.createElement('style');

    style.id = id;

    // Add a media (and/or media query) here if you'd like!
    // style.setAttribute("media", "screen")
    // style.setAttribute("media", "only screen and (max-width : 1024px)")

    // WebKit hack :(
    style.appendChild(document.createTextNode(''));

    // Add the <style> element to the page
    document.head.appendChild(style);

    return style;
};

Utils.addCssRule = function addCSSRule(style, selector, rules, index) {
    var sheet = style.sheet;

    if ('insertRule' in sheet) {
        sheet.insertRule(selector + '{' + rules + '}', index);
    } else if ('addRule' in sheet) {
        sheet.addRule(selector, rules, index);
    }
};

Utils.clearRules = function clearRules(style) {
    var i;
    var sheet = style.sheet;

    if (sheet.cssRules.length > 0) {
        for (i = sheet.cssRules.length - 1; i >= 0; i--) {
            sheet.deleteRule(0);
        }
    }
};

Utils.calculateWebkitFill = function calculateWebkitFill(element, selector, colorLower, colorUpper) {
    var gradValue = Math.round((element.value / element.getAttribute('max') * 1) * 100);
    var grad = 'linear-gradient(90deg,'+colorLower+' ' + gradValue + '%,'+ colorUpper+' ' + (gradValue + 1) + '%)';
    var styleString = '';

    styleString += selector + '::-webkit-slider-runnable-track {background: ' + grad + ';} ';

    return styleString;
};

Utils.findOutput = function findOutput(elem) {
    var siblings = elem.parentNode.childNodes;
    var i;
    var outputTag;
    var sibling;

    for (i = 0; i < siblings.length; i++) {
        sibling = siblings[i];
        if (sibling.id === elem.id && (sibling.nodeName === 'OUTPUT')) {
            outputTag = sibling;
        }
    }

    return outputTag;
};

Utils.updateTooltip = function updateTooltip(input, output, thumbWidth) {
    var width = input.offsetWidth;
    var offset = output.offsetWidth / 2 - thumbWidth / 2;
    var newPoint = (input.value - input.getAttribute('min')) / (input.getAttribute('max') - input.getAttribute('min'));
    var newPlace;

    if (newPoint < 0) {
        newPlace = 0;
    } else if (newPoint > 1) {
        newPlace = width;
    } else {
        newPlace = width * newPoint - (offset + (thumbWidth * newPoint));
    }

    output.style.left = newPlace + 'px';
    output.textContent = input.value;
};

module.exports = Utils;

},{}],4:[function(require,module,exports){
'use strict';

var range = require('..');

range(document.querySelector('.Range'));

},{"..":1}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiaW5kZXguanMiLCJzcmMvcmFuZ2UuanMiLCJzcmMvdXRpbHMuanMiLCJ0ZXN0L3NjcmlwdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9zcmMvcmFuZ2UnKTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIFJhbmdlKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmFuZ2UpKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmFuZ2UoZWxlbWVudCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMudG9vbHRpcCA9IHRoaXMub3B0aW9ucy50b29sdGlwIHx8IHV0aWxzLmZpbmRPdXRwdXQodGhpcy5lbGVtZW50KTtcbiAgICB0aGlzLmNvbG9yTG93ZXIgPSB0aGlzLm9wdGlvbnMuY29sb3JMb3dlciB8fCAnIzUwODJlMCc7XG4gICAgdGhpcy5jb2xvclVwcGVyID0gdGhpcy5vcHRpb25zLmNvbG9yVXBwZXIgfHwgJyNjY2NjY2MnO1xuICAgIHRoaXMudGh1bWJXaWR0aCA9IHRoaXMub3B0aW9ucy50aHVtYldpZHRoIHx8IDE2O1xuICAgIHRoaXMuc3R5bGUgPSB1dGlscy5pbnNlcnRTaGVldCgndGVzdCcpO1xuXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcyk7XG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzKTtcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzKTtcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMpO1xuICAgIHRoaXMub25JbnB1dCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmdlO1xuXG5SYW5nZS5wcm90b3R5cGUuaGFuZGxlRXZlbnQgPSBmdW5jdGlvbihlKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnaW5wdXQnOlxuICAgICAgICAgICAgdGhpcy5vbklucHV0KGUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RvdWNoc3RhcnQnOlxuICAgICAgICAgICAgdGhpcy5vblRvdWNoU3RhcnQoZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndG91Y2hlbmQnOlxuICAgICAgICAgICAgdGhpcy5vblRvdWNoRW5kKGUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2JsdXInOlxuICAgICAgICAgICAgdGhpcy5vbkJsdXIoZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn07XG5cblJhbmdlLnByb3RvdHlwZS5vblRvdWNoU3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnUmFuZ2UtLWFjdGl2ZScpO1xufTtcblxuUmFuZ2UucHJvdG90eXBlLm9uVG91Y2hFbmQgPSBmdW5jdGlvbigpIHtcbiAgICAvLyB0aGlzLmVsZW1lbnQuYmx1cigpO1xuICAgIC8vIHRoaXMuZWxlbWVudC5mb2N1cygpO1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdSYW5nZS0tYWN0aXZlJyk7XG59O1xuXG5SYW5nZS5wcm90b3R5cGUub25JbnB1dCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIHV0aWxzLmNsZWFyUnVsZXModGhpcy5zaGVldCk7XG4gICAgaWYgKHV0aWxzLnByZWZpeC5sb3dlcmNhc2UgPT09ICd3ZWJraXQnKSB7XG4gICAgICAgIC8vIHRyeSB7XG4gICAgICAgIC8vICAgICB0aGlzLnNoZWV0LnNoZWV0Lmluc2VydFJ1bGUodXRpbHMuY2FsY3VsYXRlV2Via2l0RmlsbCh0aGlzLmVsZW1lbnQsICcuUmFuZ2UnKSwgMCk7XG4gICAgICAgIC8vIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gICAgIHJldHVybiBudWxsO1xuICAgICAgICAvLyB9XG4gICAgICAgIHRoaXMuc3R5bGUudGV4dENvbnRlbnQgPSB1dGlscy5jYWxjdWxhdGVXZWJraXRGaWxsKHRoaXMuZWxlbWVudCwgJy5SYW5nZScsIHRoaXMuY29sb3JMb3dlciwgdGhpcy5jb2xvclVwcGVyKTtcbiAgICB9XG4gICAgdXRpbHMudXBkYXRlVG9vbHRpcCh0aGlzLmVsZW1lbnQsIHRoaXMudG9vbHRpcCwgdGhpcy50aHVtYldpZHRoKTtcblxuICAgIGlmICh0aGlzLmVsZW1lbnQudmFsdWUgPT09IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ21pbicpKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdSYW5nZS0taW5pdGlhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdSYW5nZS0taW5pdGlhbCcpO1xuICAgIH1cbn07XG5cblJhbmdlLnByb3RvdHlwZS5vbkJsdXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnUmFuZ2UtLWFjdGl2ZScpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBVdGlscyA9IHt9O1xuXG5VdGlscy5wcmVmaXggPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJycpO1xuICAgIHZhciBwcmUgPSAoQXJyYXkucHJvdG90eXBlLnNsaWNlXG4gICAgICAgIC5jYWxsKHN0eWxlcylcbiAgICAgICAgLmpvaW4oJycpXG4gICAgICAgIC5tYXRjaCgvLShtb3p8d2Via2l0fG1zKS0vKSB8fCAoc3R5bGVzLk9MaW5rID09PSAnJyAmJiBbJycsICdvJ10pXG4gICAgKVsxXTtcbiAgICB2YXIgZG9tID0gKCdXZWJLaXR8TW96fE1TfE8nKS5tYXRjaChuZXcgUmVnRXhwKCcoJyArIHByZSArICcpJywgJ2knKSlbMV07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkb206IGRvbSxcbiAgICAgICAgbG93ZXJjYXNlOiBwcmUsXG4gICAgICAgIGNzczogJy0nICsgcHJlICsgJy0nLFxuICAgICAgICBqczogcHJlWzBdLnRvVXBwZXJDYXNlKCkgKyBwcmUuc3Vic3RyKDEpXG4gICAgfTtcbn0pKCk7XG5cblV0aWxzLmluc2VydFNoZWV0ID0gZnVuY3Rpb24gaW5zZXJ0U2hlZXQoaWQpIHtcbiAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG4gICAgc3R5bGUuaWQgPSBpZDtcblxuICAgIC8vIEFkZCBhIG1lZGlhIChhbmQvb3IgbWVkaWEgcXVlcnkpIGhlcmUgaWYgeW91J2QgbGlrZSFcbiAgICAvLyBzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBcInNjcmVlblwiKVxuICAgIC8vIHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIFwib25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGggOiAxMDI0cHgpXCIpXG5cbiAgICAvLyBXZWJLaXQgaGFjayA6KFxuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSk7XG5cbiAgICAvLyBBZGQgdGhlIDxzdHlsZT4gZWxlbWVudCB0byB0aGUgcGFnZVxuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXG4gICAgcmV0dXJuIHN0eWxlO1xufTtcblxuVXRpbHMuYWRkQ3NzUnVsZSA9IGZ1bmN0aW9uIGFkZENTU1J1bGUoc3R5bGUsIHNlbGVjdG9yLCBydWxlcywgaW5kZXgpIHtcbiAgICB2YXIgc2hlZXQgPSBzdHlsZS5zaGVldDtcblxuICAgIGlmICgnaW5zZXJ0UnVsZScgaW4gc2hlZXQpIHtcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvciArICd7JyArIHJ1bGVzICsgJ30nLCBpbmRleCk7XG4gICAgfSBlbHNlIGlmICgnYWRkUnVsZScgaW4gc2hlZXQpIHtcbiAgICAgICAgc2hlZXQuYWRkUnVsZShzZWxlY3RvciwgcnVsZXMsIGluZGV4KTtcbiAgICB9XG59O1xuXG5VdGlscy5jbGVhclJ1bGVzID0gZnVuY3Rpb24gY2xlYXJSdWxlcyhzdHlsZSkge1xuICAgIHZhciBpO1xuICAgIHZhciBzaGVldCA9IHN0eWxlLnNoZWV0O1xuXG4gICAgaWYgKHNoZWV0LmNzc1J1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yIChpID0gc2hlZXQuY3NzUnVsZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHNoZWV0LmRlbGV0ZVJ1bGUoMCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5VdGlscy5jYWxjdWxhdGVXZWJraXRGaWxsID0gZnVuY3Rpb24gY2FsY3VsYXRlV2Via2l0RmlsbChlbGVtZW50LCBzZWxlY3RvciwgY29sb3JMb3dlciwgY29sb3JVcHBlcikge1xuICAgIHZhciBncmFkVmFsdWUgPSBNYXRoLnJvdW5kKChlbGVtZW50LnZhbHVlIC8gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ21heCcpICogMSkgKiAxMDApO1xuICAgIHZhciBncmFkID0gJ2xpbmVhci1ncmFkaWVudCg5MGRlZywnK2NvbG9yTG93ZXIrJyAnICsgZ3JhZFZhbHVlICsgJyUsJysgY29sb3JVcHBlcisnICcgKyAoZ3JhZFZhbHVlICsgMSkgKyAnJSknO1xuICAgIHZhciBzdHlsZVN0cmluZyA9ICcnO1xuXG4gICAgc3R5bGVTdHJpbmcgKz0gc2VsZWN0b3IgKyAnOjotd2Via2l0LXNsaWRlci1ydW5uYWJsZS10cmFjayB7YmFja2dyb3VuZDogJyArIGdyYWQgKyAnO30gJztcblxuICAgIHJldHVybiBzdHlsZVN0cmluZztcbn07XG5cblV0aWxzLmZpbmRPdXRwdXQgPSBmdW5jdGlvbiBmaW5kT3V0cHV0KGVsZW0pIHtcbiAgICB2YXIgc2libGluZ3MgPSBlbGVtLnBhcmVudE5vZGUuY2hpbGROb2RlcztcbiAgICB2YXIgaTtcbiAgICB2YXIgb3V0cHV0VGFnO1xuICAgIHZhciBzaWJsaW5nO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHNpYmxpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHNpYmxpbmcgPSBzaWJsaW5nc1tpXTtcbiAgICAgICAgaWYgKHNpYmxpbmcuaWQgPT09IGVsZW0uaWQgJiYgKHNpYmxpbmcubm9kZU5hbWUgPT09ICdPVVRQVVQnKSkge1xuICAgICAgICAgICAgb3V0cHV0VGFnID0gc2libGluZztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXRUYWc7XG59O1xuXG5VdGlscy51cGRhdGVUb29sdGlwID0gZnVuY3Rpb24gdXBkYXRlVG9vbHRpcChpbnB1dCwgb3V0cHV0LCB0aHVtYldpZHRoKSB7XG4gICAgdmFyIHdpZHRoID0gaW5wdXQub2Zmc2V0V2lkdGg7XG4gICAgdmFyIG9mZnNldCA9IG91dHB1dC5vZmZzZXRXaWR0aCAvIDIgLSB0aHVtYldpZHRoIC8gMjtcbiAgICB2YXIgbmV3UG9pbnQgPSAoaW5wdXQudmFsdWUgLSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpKSAvIChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpIC0gaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSk7XG4gICAgdmFyIG5ld1BsYWNlO1xuXG4gICAgaWYgKG5ld1BvaW50IDwgMCkge1xuICAgICAgICBuZXdQbGFjZSA9IDA7XG4gICAgfSBlbHNlIGlmIChuZXdQb2ludCA+IDEpIHtcbiAgICAgICAgbmV3UGxhY2UgPSB3aWR0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBuZXdQbGFjZSA9IHdpZHRoICogbmV3UG9pbnQgLSAob2Zmc2V0ICsgKHRodW1iV2lkdGggKiBuZXdQb2ludCkpO1xuICAgIH1cblxuICAgIG91dHB1dC5zdHlsZS5sZWZ0ID0gbmV3UGxhY2UgKyAncHgnO1xuICAgIG91dHB1dC50ZXh0Q29udGVudCA9IGlucHV0LnZhbHVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBVdGlscztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJhbmdlID0gcmVxdWlyZSgnLi4nKTtcblxucmFuZ2UoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLlJhbmdlJykpO1xuIl19
