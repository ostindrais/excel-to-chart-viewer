
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
import * as chart from './chart';
import * as dragdrop from './dragdrop';


// now setup the drag & drop listeners
const dropArea = document.getElementById('drop-area');

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, dragdrop.preventDefaults, false);
});

;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, dragdrop.highlight, false);
});

;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, dragdrop.unhighlight, false)
})
dropArea.addEventListener('drop', dragdrop.handleDrop, false);

// make the initial chart
chart.makeChart();
