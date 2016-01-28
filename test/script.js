'use strict';

var range = window.Range;

var r1 = range(document.querySelector('.Range'), {
    values: ['aaaa', '1', '<i>aaaaaaa</i>', '<i>b</i>', '<i>c</i>', '<i>daaaaaaa</i>', '<i>z</i>']
});

document.querySelector('#play').addEventListener('click', function() {
    r1.play();
});

document.querySelector('#pause').addEventListener('click', function() {
    r1.pause();
});

document.querySelector('.Range').addEventListener('input', function() {
    // console.log('input')
});

document.querySelector('.Range').addEventListener('change', function() {
    // console.log('change')
});
