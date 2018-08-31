import * as dragdrop from './dragdrop';

// colors are taken from https://sashat.me/2017/01/11/list-of-20-simple-distinct-colors/
var colorOptions = [
    '#e6194b',
    '#f58231',
    '#ffe119',
    '#bcf60c',
    '#3cb44b',
    '#46f0f0',
    '#4363d8',
    '#911eb4',
    '#f032e6'
];
var theHelp = Chart.helpers;
const arraySum = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue);
var chartObject = {};

export function makeChart() {
    var ctx = document.getElementById('canvas-chart').getContext('2d');
    let createdChart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'pie',

        // The data for our dataset
        data: {
            labels: ["Data", "CSS", "HTML", "Laravel", "Javascript", "ChartJS", "A2 Hosting", "Module/Webpack Intro", "XLS Parsing"],
            datasets: [{
                backgroundColor: colorOptions,
                borderColor: '#000000',
                borderWidth: 0,
                data: [0, 10, 5, 2, 20, 30, 45, 20, 10],
            }]
        },

        // Configuration options go here
        options: {
            title: {
                display: true,
                text: "Time Sinks on This Project"
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var thisLabel = data.labels[tooltipItem.index] || '';
                        var thisValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        var totalValue = data.datasets[tooltipItem.datasetIndex].data.reduce(arraySum);
                        var percentage = (thisValue / totalValue) * 100;
                        return thisLabel + ': ' + thisValue + ' (' + percentage.toFixed(2) + '%)';
                    }
                }
            },
            legend: {
                display: true,
                labels: {
                    generateLabels: function (chart) {
                        var data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map(function (label, i) {
                                var meta = chart.getDatasetMeta(0);
                                var ds = data.datasets[0];
                                var arc = meta.data[i];
                                var custom = arc && arc.custom || {};
                                var getValueAtIndexOrDefault = theHelp.getValueAtIndexOrDefault;
                                var arcOpts = chart.options.elements.arc;
                                var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
                                var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
                                var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);
                                var thisValue = ds.data[i];
                                var totalValue = ds.data.reduce(arraySum);
                                var percentage = (thisValue / totalValue) * 100;

                                return {
                                    // And finally : 
                                    text: label + " " + percentage.toFixed(2) + '%',
                                    fillStyle: fill,
                                    strokeStyle: stroke,
                                    lineWidth: bw,
                                    hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                                    index: i
                                };
                            });
                        }
                        return [];
                    }
                }
            }
        }
    });
    chartObject = createdChart;
    return createdChart;
}


export function makeChartFromData(chartTitle, data) {
    let dataLabels = [];
    let dataValues = [];
    let errors = [];
    data.some(dataRow => {
        if (typeof dataRow["Name "] === 'undefined') {
            errors.push("Column 'Name ' is missing");
        }
        if (typeof dataRow.Count === 'undefined') {
            errors.push("Column 'Count' is missing");
        }
        if (errors.length > 0) {
            return true;
        }
        dataLabels.push(dataRow["Name "]);
        dataValues.push(dataRow.Count);
    });
    if (errors.length > 0) {
        dragdrop.showErrors(errors);
        return;
    }
    let dataSet = chartObject.data.datasets.pop();
    dataSet.data = dataValues;
    chartObject.data.datasets.push(dataSet);
    chartObject.config.options.title.text = chartTitle;
    chartObject.data.labels = dataLabels;
    chartObject.update();
};
