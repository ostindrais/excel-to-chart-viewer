import * as chart from './chart';

const dropArea = document.getElementById('drop-area');
/*
Taken from https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
*/
var rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
export function handleFiles(files) {
    var f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var data = e.target.result;
        if (!rABS) data = new Uint8Array(data);
        var workbook = XLSX.read(data, { type: rABS ? 'binary' : 'array' });
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
            showErrors(errors);
            return;
        }
        // Get the chart title
        var worksheet = workbook.Sheets['title'];
        var worksheetTitle = worksheet['A1'] ? worksheet['A1'].v : 'Graph';

        // now get the data
        worksheet = workbook.Sheets['data'];
        var dataAsJson = XLSX.utils.sheet_to_json(worksheet);
        chart.makeChartFromData(worksheetTitle, dataAsJson);
    };
    if (rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
}

export function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

export function highlight(e) {
    dropArea.classList.add('highlight')
}

export function unhighlight(e) {
    dropArea.classList.remove('highlight')
}

export function handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files

    handleFiles(files)
}

export function showErrors(errorMessages) {
    alert(errorMessages.join("\n"));
}
