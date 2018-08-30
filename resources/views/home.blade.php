@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div id="drop-area">
                    <form class="upload-form">
                        <p>Upload an Excel spreadsheet with the file dialog or by dragging and dropping onto the dashed region</p>
                        <input type="file" id="file-upload" accept="xls,xlsx,csv" onchange="handleFiles(this.files)">
                        <label class="button" for="file-upload">Select an Excel spreadsheet</label>
                    </form>
                </div>
                <div id="canvas-container">
                    <canvas id="canvas-chart"></canvas>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js"></script>
<script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>
<script type="text/javascript">
/*
    Taken from https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
*/
var rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
var dataLabels = new Array;
var dataValues = new Array;
var colorOptions = [
    '#ffa726',
    '#cddc39',
    '#81d4fa',
    '#e040fb',
    '#a1887f',
    '#e91e63',
    '#a1887f',
    '#ffc107',
    '#009688'
];
const arraySum = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue);

function makeChart() {
    var ctx = document.getElementById('canvas-chart').getContext('2d');
    let createdChart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: ["Data", "Label", "Start", "Rolling", "Laravel", "ChartJS", "jQuery", "Javascript", "Filler"],
        datasets: [{
            backgroundColor: colorOptions,
            borderColor: '#000000',
            borderWidth: 0,
            data: [0, 10, 5, 2, 20, 30, 45, 29, 10],
        }]
    },

    // Configuration options go here
    options: {
        title: {
            display: true,
            text: "Excel Data"
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
        }
    }
    });
    return createdChart;
}

const chartObject = makeChart();

function handleFiles(files) {
  var f = files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var data = e.target.result;
    if(!rABS) data = new Uint8Array(data);
    var workbook = XLSX.read(data, {type: rABS ? 'binary' : 'array'});
    // workbook should have a sheet named title
    var firstSheetName = workbook.SheetNames[0];
    var errors = new Array;
    if (firstSheetName != 'title') {
        errors.push("First worksheet must be named 'title'");
    }
    var secondSheetName = workbook.SheetNames[1];
    if (secondSheetName != 'data') {
        errors.push("Second worksheet must be named 'data'");
    }
    if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
    }
    // Get the chart title
    var worksheet = workbook.Sheets['title'];
    var worksheetTitle = worksheet['A1'] ? worksheet['A1'].v : 'Graph';

    // now get the data
    var worksheet = workbook.Sheets['data'];
    var dataAsJson = XLSX.utils.sheet_to_json(worksheet);
    console.log(XLSX.utils.sheet_to_html(worksheet, {
        id: 'xls-data',
        header: '',
        footer: ''
    }));
    makeChartFromData(chartObject, worksheetTitle, dataAsJson);
  };
  if(rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
}

function preventDefaults (e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('highlight')
}

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}

function makeChartFromData(chartObject, chartTitle, data) {
    let dataLabels = [];
    let dataValues = [];
    data.forEach(dataRow => {
        dataLabels.push(dataRow["Name "]);
        dataValues.push(dataRow.Count);
    });
    let dataSet = chartObject.data.datasets.pop();
    dataSet.data = dataValues;
    chartObject.data.datasets.push(dataSet);
    chartObject.config.options.title.text = chartTitle;
    chartObject.data.labels = dataLabels;
    chartObject.update();
};

const dropArea = document.getElementById('drop-area');

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
dropArea.addEventListener(eventName, preventDefaults, false);
});

;['dragenter', 'dragover'].forEach(eventName => {
dropArea.addEventListener(eventName, highlight, false);
});

;['dragleave', 'drop'].forEach(eventName => {
dropArea.addEventListener(eventName, unhighlight, false)
})
dropArea.addEventListener('drop', handleDrop, false);

</script>
@endsection