'use strict';

var utils = require('./utils');
var assign = require('lodash.assign');
var debounce = require('lodash.debounce');
var defaults = {
    values: null,
    webkitFill: {
        active: false,
        colorLower: '#3f51b5',
        colorUpper: 'rgba(0, 0, 0, 0.26)',
        colorUpperActive: 'rgba(0, 0, 0, 0.38)'
    },
    thumbWidth: 16,
    delay: 2000,
    selectors: {
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
    this.input = this.element.querySelector(this.selectors.input);
    this.tooltip = this.element.querySelector(this.selectors.tooltip);
    this.values = null;
    this.timer = null;
    this.style = utils.insertSheet('Range');

    this.element.addEventListener('touchstart', this);
    this.element.addEventListener('touchend', this);
    this.input.addEventListener('input', this);
    this.input.addEventListener('blur', this);

    this.onResize = debounce(function() {
        if (this.tooltip) {
            this.tooltip.innerHTML = this.value();
            utils.translateTooltip(this.input, this.tooltip, this.options.thumbWidth);
        }
    }, 300).bind(this);
    window.addEventListener('resize', this.onResize, false);

    if (this.options.values) {
        this.setValues(this.options.values);
    }

    this.onInput();
}

module.exports = Range;

Range.prototype.destroy = function() {
    window.removeEventListener('resize', this.onResize, false);
    this.element.removeEventListener('touchstart', this);
    this.element.removeEventListener('touchend', this);
    this.input.removeEventListener('input', this);
    this.input.removeEventListener('blur', this);
    this.style.parentNode.removeChild(this.style);
    window.clearInterval(this.timer);
    this.timer = null;
    this.values = null;
    return this;
};

Range.prototype.setValues = function(values) {
    this.values = values;
    this.input.setAttribute('min', 0);
    this.input.setAttribute('max', this.values.length - 1);
    this.input.setAttribute('step', 1);
    this.input.setAttribute('value', 0);

    return this;
};

Range.prototype.setValue = function(value) {
    this.input.value = value;
    utils.simulateEvent(this.input, 'input');
    return this;
};

Range.prototype.disable = function() {
    this.input.disabled = true;
    if (this.timer) {
        this.pause();
    }
};

Range.prototype.enable = function() {
    this.input.disabled = false;
};

Range.prototype.isEnabled = function() {
    return !this.input.disabled;
};

Range.prototype.value = function(position) {
    var index = position || this.input.value;

    return this.values ? this.values[index] : this.input.value;
};

Range.prototype.next = function() {
    var nextValue = parseInt(this.input.value, 10) + parseInt(this.input.getAttribute('step'), 10);

    if (!this.isEnabled()) {
        return this;
    }

    if (nextValue <= parseInt(this.input.getAttribute('max'), 10)) {
        this.setValue(nextValue);
    } else {
        this.pause();
    }
    return this;
};

Range.prototype.play = function() {
    if (this.timer) {
        this.pause();
    }

    if (this.isEnabled()) {
        if (parseInt(this.input.getAttribute('max'), 10) === parseInt(this.input.value, 10)) {
            this.input.focus();
            this.setValue(this.input.getAttribute('min'));
            this.timer = window.setInterval(this.next.bind(this), this.options.delay);
            return this;
        }

        this.input.focus();
        this.next();
        this.timer = window.setInterval(this.next.bind(this), this.options.delay);
    }

    return this;
};

Range.prototype.pause = function() {
    this.input.blur();
    window.clearInterval(this.timer);
    this.timer = null;
    return this;
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

    if (utils.prefix.lowercase === 'webkit' && this.options.webkitFill.active) {
        this.style.textContent = utils.calculateWebkitFill(
            this.input,
            this.options.selectors.input,
            this.options.classes.active,
            this.options.webkitFill.colorLower,
            this.options.webkitFill.colorUpper,
            this.options.webkitFill.colorUpperActive
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
