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
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js"></script>
@endsection