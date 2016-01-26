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
