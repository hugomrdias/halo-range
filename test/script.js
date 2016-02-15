'use strict';

var range = window.Range;

var rangeA = range(document.getElementById('range-js'), {
    webkitFill: {
        active: true,
        colorLower: '#3f51b5',
        colorUpper: 'rgba(0, 0, 0, 0.26)',
        colorUpperActive: 'rgba(0, 0, 0, 0.38)'
    },
    selectors: {
        input: '#input-js',
        tooltip: '#range-js > .Range-tooltip'
    }
});

document.querySelector('#play').addEventListener('click', function() {
    rangeA.play();
});

document.querySelector('#pause').addEventListener('click', function() {
    rangeA.pause();
});

document.querySelector('#enable').addEventListener('click', function() {
    rangeA.enable();
});

document.querySelector('#disable').addEventListener('click', function() {
    rangeA.disable();
});

var rangeH = range(document.getElementById('range-h'), {
    values: ['ddd', '0', 13, '<small>sss</small>', 100],
    webkitFill: {
        active: true,
        colorLower: '#3f51b5',
        colorUpper: 'rgba(0, 0, 0, 0.26)',
        colorUpperActive: 'rgba(0, 0, 0, 0.38)'
    },
    selectors: {
        input: '#input-h',
        tooltip: '#range-h > .Range-tooltip'
    }
});

document.querySelector('#destroy').addEventListener('click', function() {
    rangeH.destroy();
});
