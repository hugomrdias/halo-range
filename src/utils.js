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
    var grad = 'linear-gradient(90deg,' + colorLower + ' ' + gradValue + '%,' + colorUpper + ' ' + (gradValue + 1) + '%)';
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
