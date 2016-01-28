'use strict';

var utils = require('./utils');
var assign = require('lodash.assign');
var defaults = {
    values: null,
    tooltip: null,
    input: null,
    colorLower: '#5082e0',
    colorUpper: '#cccccc',
    thumbWidth: 16,
    delay: 2000,
    selectors: {
        container: '.Range',
        input: '.Range-input',
        tooltip: '.Range-tooltip'
    },
    classes: {
        initial: 'Range--initial',
        active: 'Range--active'
    }
};

function Range(element, options) {
    if (!(this instanceof Range)) {
        return new Range(element, options);
    }

    this.element = element;
    this.options = assign({}, defaults, options);
    this.classes = this.options.classes;
    this.selectors = this.options.selectors;
    this.input = this.options.input || this.element.querySelector(this.selectors.input);
    this.tooltip = this.options.tooltip || this.element.querySelector(this.selectors.tooltip);
    this.values = this.options.values;
    this.timer = null;
    this.style = utils.insertSheet('Range');

    this.element.addEventListener('input', this);
    this.element.addEventListener('touchstart', this);
    this.element.addEventListener('touchend', this);
    this.element.addEventListener('blur', this);

    if (this.tooltip) {
        this.tooltip.innerHTML = this.value();
        utils.translateTooltip(this.input, this.tooltip, this.options.thumbWidth);
    }

    if (this.values) {
        this.processValues();
    }
}

module.exports = Range;

Range.prototype.processValues = function() {
    this.input.setAttribute('min', 0);
    this.input.setAttribute('max', this.values.length - 1);
    this.input.setAttribute('step', 1);
    this.input.setAttribute('value', 0);
};

Range.prototype.value = function() {
    return this.values ? this.values[this.input.value] : this.input.value;
};

Range.prototype.next = function() {
    var nextValue = parseInt(this.input.value, 10) + parseInt(this.input.getAttribute('step'), 10);

    if (nextValue <= parseInt(this.input.getAttribute('max'), 10)) {
        this.input.value = nextValue;
        utils.simulateEvent(this.input, 'input');
    } else {
        this.input.blur();
        window.clearInterval(this.timer);
    }
    return this;
};

Range.prototype.play = function() {
    this.input.focus();
    this.next();
    this.timer = window.setInterval(this.next.bind(this), this.options.delay);
};

Range.prototype.pause = function() {
    this.input.blur();
    window.clearInterval(this.timer);
};

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
    this.element.classList.add(this.options.classes.active);
};

Range.prototype.onTouchEnd = function() {
    this.element.classList.remove(this.options.classes.active);
};

Range.prototype.onInput = function() {
    this.input.setAttribute('data-value', this.value());

    if (utils.prefix.lowercase === 'webkit') {
        this.style.textContent = utils.calculateWebkitFill(
            this.input,
            this.options.selectors.input,
            this.options.colorLower,
            this.options.colorUpper
        );
    }

    if (this.tooltip) {
        this.tooltip.innerHTML = this.value();
        utils.translateTooltip(this.input, this.tooltip, this.options.thumbWidth);
    }

    if (this.input.value === this.input.getAttribute('min')) {
        this.element.classList.add(this.options.classes.initial);
    } else {
        this.element.classList.remove(this.options.classes.initial);
    }
};

Range.prototype.onBlur = function() {
    this.element.classList.remove(this.options.classes.active);
};
