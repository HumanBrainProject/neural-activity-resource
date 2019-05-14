

angular.module('neo-visualizer', ['ng', 'ngResource', 'nvd3'])

.controller('MainCtrl', function($scope, BlockData, SegmentData, AnalogSignalData, Graphics, $q) {
    var cache = [];
    $scope.segmentCheck = false;
    $scope.blockCheck = false;
    $scope.segmentSignals = null;
    $scope.blockSignals = null;
    $scope.channelSignals = null;

    var getMultiLineOptions = function() {
        options = {
                    chart: {
                        type: 'lineWithFocusChart',
                        useVoronoi: false,
                        height: 450,
                        margin : {
                            top: 20,
                            right: 20,
                            bottom: 60,
                            left: 40
                        },
                        duration: 50,
                        xAxis: {
                            axisLabel: 'X Axis',
                            tickFormat: function(d){
                                return d3.format(',.f')(d);
                            }
                        },
                        x2Axis: {
                            tickFormat: function(d){
                                return d3.format(',.f')(d);
                            }
                        },
                        yAxis: {
                            axisLabel: 'Y Axis',
                            tickFormat: function(d){
                                return d3.format(',.f')(d);
                            },
                            rotateYLabel: false
                        },
                        y2Axis: {
                            tickFormat: function(d){
                                return d3.format(',.f')(d);
                            }
                        }
                    }
                };
        return options;
    };

    $scope.showMultiChannelSignal = function()
    {
        $scope.channelSignals = true;
        $scope.channel_options = getMultiLineOptions();
        AnalogSignalData.get({url: $scope.source,
                                      segment_id: $scope.currentSegmentId,
                                      analog_signal_id: $scope.currentAnalogSignalId,
                                      type: $scope.iotype
                                     }).$promise.then(
            function(data) {
                $scope.signal = data;
                $scope.signal.id = $scope.currentAnalogSignalId;
                if ($scope.segment.analogsignals.length > 0) {
                    $scope.block.segments[$scope.currentSegmentId].analogsignals[$scope.currentAnalogSignalId] = $scope.signal;
                    }
                else if ($scope.segment.irregularlysampledsignals.length > 0) {
                    $scope.block.segments[$scope.currentSegmentId].irregularlysampledsignals[$scope.currentAnalogSignalId] = $scope.signal;
                }
                console.log("** channel size " + data.values.length);
                var graph_data = [];
                data.values.forEach(
                    function(value, j) {
                        var t_start = data.times[0];
                        var xy_data = value.map(
                            function(val, i){
                                return {x: 1000 * (data.times[i] - t_start), y: val};
                            }
                        );
                        graph_data.push({
                            key: "Channel " + j,
                            values: xy_data
                        });
                    }
                );
                $scope.channel_data = graph_data;
            }
        ).finally(function () {
            $scope.dataLoading = false;
          });
    };

    $scope.showSelectedSignals = function(id)
    {
        $scope.dataLoading = true;
        console.log("Signal id: " + id);
        $scope.block_options = getMultiLineOptions();

            var sig_promises = [];

            $scope.block.segments.forEach(
                function(seg, i) {
                    var sigdata = AnalogSignalData.get({url: $scope.source,
                                    segment_id: i,
                                    analog_signal_id: id,
                                    type: $scope.iotype
                                    });
                    sigdata.id = id;
                    sig_promises.push(sigdata.$promise);
                    }
                );

            $q.all(sig_promises).then(
                function(signals) {
                    console.log("* SIGNALS count " + signals.length);
                    var graph_data = [];
                    signals.forEach(
                        function(signal, j) {
                            var t_start = signal.times[0];
                            var xy_data = signal.values.map(
                                function(val, i){
                                    return {x: 1000 * (signal.times[i] - t_start), y: val};
                                }
                            );
                            graph_data.push({
                                key: "Segment " + j,
                                values: xy_data
                            });
                        }
                    );
                    $scope.block_data = graph_data;
                },
                function(error) {
                    console.log(error);
                }
            ).finally(function () {
                $scope.dataLoading = false;
                });
    }

    $scope.showBlockSignals = function(name)
    {
        if (name == true) {
            $scope.blockSignals = true;
            $scope.signal = null;
            $scope.segmentSignals = null;
            }
        else {
            $scope.blockSignals = null;
            $scope.dataLoading = false;
        }
        $scope.currentAnalogSignalId = null
    };

    $scope.showSegmentSignals = function(name)
    {
        if (name == true) {
            $scope.signal = null;
            $scope.blockSignals = null;
            $scope.dataLoading = true;
            $scope.segmentSignals = true;
            $scope.segment_options = getMultiLineOptions();
            var promises = [];

            $scope.segment.analogsignals.forEach(
                function(sig, i) {
                    var sigdata = AnalogSignalData.get({url: $scope.source,
                                    segment_id: $scope.currentSegmentId,
                                    analog_signal_id: i,
                                    type: $scope.iotype
                                    });
                    sigdata.id = i;
                    promises.push(sigdata.$promise);
                    }
                );

            $q.all(promises).then(
                function(signals) {
                    console.log("SIGNALS count " + signals.length);
                    var graph_data = [];
                    signals.forEach(
                        function(signal, j) {
                            var t_start = signal.times[0];
                            var xy_data = signal.values.map(
                                function(val, i){
                                    return {x: 1000 * (signal.times[i] - t_start), y: val};
                                }
                            );
                            graph_data.push({
                                key: "Signal " + j,
                                values: xy_data
                            });
                        }
                    );
                    $scope.segment_data = graph_data;
                },
                function(error) {
                    console.log(error);
                }
            ).finally(function () {
                $scope.dataLoading = false;
              });
        }

        else {
            $scope.dataLoading = false;
            $scope.segmentSignals = null;
        }
        $scope.currentAnalogSignalId = null

    };

    console.log($scope.source);
    if (!$scope.height) {
        $scope.height = 600;
    }
    $scope.block = null;
    $scope.showAnnotations = false;

    var init = function() {
        console.log("Loading data from " + $scope.source);
        $scope.block = null;
        $scope.segment = null;
        $scope.label = $scope.source.substring($scope.source.lastIndexOf('/') + 1);
        BlockData.get({url: $scope.source, type: $scope.iotype }).$promise.then(
            function(data) {
                $scope.error = null;
                $scope.block = data.block[0];
                console.log(data.block[0]);
                $scope.currentSegmentId = "0";
                $scope.switchSegment();
            },
            function(err) {
                console.log("Error in getting block");
                $scope.error = err;
            }
        );
    }

    $scope.$watch("source", function() {
        init();
    });

    $scope.switchSegment = function() {
        $scope.signal = null;
        $scope.segmentSignals = null;
        $scope.segmentCheck = false;
        if ($scope.block.segments[$scope.currentSegmentId].analogsignals[0] == undefined) {
            console.log("Fetching data for segment #" + $scope.currentSegmentId + " in file " + $scope.source);
            cache[$scope.currentSegmentId] = [];
            SegmentData.get({url: $scope.source,
                             segment_id: $scope.currentSegmentId,
                             type: $scope.iotype
                            }).$promise.then(
                function(data) {
                    $scope.segment = data;
                    $scope.block.segments[$scope.currentSegmentId] = $scope.segment;
                    console.log(data);
                    console.log($scope.segment.analogsignals);
                    //$scope.switchAnalogSignal();
                },
                function(err) {
                    console.log("Error in getting segment");
                    console.log(err);
                }
            );
        } else {
            console.log("Switching to cached segment #" + $scope.currentSegmentId);
            $scope.segment = $scope.block.segments[$scope.currentSegmentId];
        }
        $scope.currentAnalogSignalId = null;
    }

    $scope.switchAnalogSignal = function() {
        $scope.dataLoading = true;
        $scope.segmentSignals = null;
        $scope.segmentCheck = false;
        if (($scope.segment.analogsignals.length > 0 && $scope.segment.analogsignals[$scope.currentAnalogSignalId].values == undefined) ||
            ($scope.segment.irregularlysampledsignals.length > 0 && $scope.segment.irregularlysampledsignals[$scope.currentAnalogSignalId].values == undefined)) {
            console.log("Fetching data for analog signal #" + $scope.currentAnalogSignalId + " in segment #" + $scope.currentSegmentId + " in file " + $scope.source);
            cache[$scope.currentSegmentId][$scope.currentAnalogSignalId] = [];
            if ($scope.block.channels == 'multi'){
                console.log("Signal has multiple channels");
                $scope.showMultiChannelSignal();
            }
            else {
                AnalogSignalData.get({url: $scope.source,
                                      segment_id: $scope.currentSegmentId,
                                      analog_signal_id: $scope.currentAnalogSignalId,
                                      type: $scope.iotype
                                     }).$promise.then(
                    function(data) {
                        $scope.signal = data;
                        $scope.signal.id = $scope.currentAnalogSignalId;
                        if ($scope.segment.analogsignals.length > 0) {
                            $scope.block.segments[$scope.currentSegmentId].analogsignals[$scope.currentAnalogSignalId] = $scope.signal;
                            }
                        else if ($scope.segment.irregularlysampledsignals.length > 0) {
                            $scope.block.segments[$scope.currentSegmentId].irregularlysampledsignals[$scope.currentAnalogSignalId] = $scope.signal;
                        }
                        console.log(data);
                        Graphics.initGraph($scope.signal).then(function(graph_data) {
                            $scope.graph_data = graph_data;
                            $scope.options = Graphics.getOptions("View of analogsignal", "", "", graph_data.values, $scope.signal, $scope.height)
                            $scope.$apply();
                            cache[$scope.currentSegmentId][$scope.currentAnalogSignalId]['graph'] = graph_data;
                            cache[$scope.currentSegmentId][$scope.currentAnalogSignalId]['options'] = $scope.options;
                        });
                    },
                    function(err) {
                        console.log("Error in getting signal");
                        console.log(err);
                    }
                ).finally(function () {
                     $scope.dataLoading = false;
                    });
            }

        } else {
            console.log("Switching to cached signal #" + $scope.currentAnalogSignalId + " in segment #" + $scope.currentSegmentId);
            if ($scope.segment.analogsignals.length > 0) {
                $scope.signal = $scope.block.segments[$scope.currentSegmentId].analogsignals[$scope.currentAnalogSignalId];
                }
            else if ($scope.segment.irregularlysampledsignals.length > 0) {
                $scope.signal = $scope.block.segments[$scope.currentSegmentId].irregularlysampledsignals[$scope.currentAnalogSignalId];
            }
            $scope.graph_data = cache[$scope.currentSegmentId][$scope.currentAnalogSignalId]['graph'];
            $scope.options = cache[$scope.currentSegmentId][$scope.currentAnalogSignalId]['options'];
            $scope.dataLoading = false;
        }
    }

    $scope.getSignalLabel = function(signal) {
        var label = "Signal #" + signal.id;
        if (signal.name) {
            label += " (" + signal.name + ")";
        }
        return label
    }
})


.factory('Graphics', function($rootScope) {

        //graphs functions
        var getOptions = function(title, subtitle, caption, graph_data, raw_data, height) {

            var yminymax = _get_min_max_values(raw_data.values);

            var xminxmax = _get_min_max_values(raw_data.times);

            if (!height) {
                height = 600
            }

            options = {
                chart: {
                    type: 'lineWithFocusChart',
                    height: height,
                    margin: {
                        top: 100,
                        right: 100,
                        bottom: 50,
                        left: 100
                    },
                    duration: 700,
                    x: function(d) { return d.x; },
                    y: function(d) { return d.y; },
                    y2: function(d) { return d.y; },
                    useInteractiveGuideline: true,
                    dispatch: {
                        stateChange: function(e) { console.log("stateChange"); },
                        changeState: function(e) { console.log("changeState"); },
                        tooltipShow: function(e) { console.log("tooltipShow"); },
                        tooltipHide: function(e) { console.log("tooltipHide"); },
                    },
                    xAxis: {
                        axisLabel: raw_data.times_dimensionality,
                        axisLabelDistance: 10,
                        tickFormat: function(d) {
                            return d3.format('.03g')(d.toPrecision(5));
                        },
                    },
                    x2Axis: {
                        axisLabel: raw_data.times_dimensionality,
                        tickFormat: function(d) {
                            return d3.format('.02g')(d.toPrecision(5));
                        },
                    },

                    yAxis: {
                        axisLabel: raw_data.values_units,
                        showMaxMin: false,
                        tickFormat: function(d) {
                            return d3.format('.02f')(d.toPrecision(5));
                        },
                        rotateYLabel: true,
                        axisLabelDistance: 20,
                        css: {
                            'text-align': 'center',
                            'margin': '10px 13px 10px 7px'
                        }
                    },
                    y2Axis: {
                        showMaxMin: false,
                        tickValues: null,
                    },
                    // xDomain: xminxmax.value,
                    xRange: null,
                    // yDomain: yminymax,
                    yRange: null,
                    tooltips: true,
                    interpolate: 'linear',
                    interactive: true,
                    interactiveUpdateDelay: 10,
                    focusEnable: true,
                    focusShowAxisX: true,
                    focusShowAxisY: true,
                    callback: function(chart) {}
                },

                title: {
                    enable: false,
                    text: ""
                },
                subtitle: {
                    enable: false,
                    text: "", //subtitle,
                    css: {
                        'text-align': 'center',
                        'margin': '10px 13px 0px 7px'
                    }
                },
                caption: {
                    enable: false,
                    html: caption,
                    css: {
                        'text-align': 'justify',
                        'margin': '10px 13px 0px 7px'
                    }
                },

            };

            return options;


        }

        //tests graphs

        var initGraph = function(raw_data) {
            console.log("initGraph");
            return new Promise(function(resolve, reject) {

                var data = []
                get_graph_values(raw_data).then(function(data_graph) {
                    data.push(data_graph)
                })
                resolve({ 'values': data });
            });
        }

        var get_graph_values = function(raw_data) {
            return new Promise(function(resolve, reject) {
                var values_temp = new Array()
                for (var a in raw_data.values) {
                    var temp = {
                        x: raw_data.times[a],
                        y: raw_data.values[a],
                    };
                    values_temp.push(temp)
                }

                var data_to_return = {
                    values: values_temp, //values - represents the array of {x,y} data points
                    key: "Channel #0", //key  - the name of the series.
                    color: '#ff7f0e'
                };
                resolve(data_to_return);
            })
        }


        //utility functions
        var _get_color_array = function(data_row) {
            list_ids = [];
            for (var i in data_row) {
                list_ids.push(i);
            }

            var colorMap = palette('tol-rainbow', list_ids.length);

            var res = new Object();
            for (var j in list_ids) {
                res[list_ids[j]] = colorMap[j];
            }
            return res;
        }

        var _pickRandomColor = function() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            var i = 0;
            for (i; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };

        var _get_min_max_values = function(array) {
            if (array != undefined) {
                var min_value = arrayMin(array);
                var max_value = arrayMax(array);
                min_value = min_value - 0.1 * Math.abs(min_value);
                max_value = max_value + 0.1 * Math.abs(max_value);
                return [min_value, max_value];
            } else {
                return [null, null];
            }
        }

        function arrayMin(arr) {
            return arr.reduce(function(p, v) {
                return (p < v ? p : v);
            });
        }

        function arrayMax(arr) {
            return arr.reduce(function(p, v) {
                return (p > v ? p : v);
            });
        }
        return {
            getOptions: getOptions,
            _get_min_max_values: _get_min_max_values,

            initGraph: initGraph,
            get_graph_values: get_graph_values
        };

    }
)


.directive("visualizerView", function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        //templateUrl: '/src/visualizer.tpl.html',
        template: `
            <div>
            <style>
                .loader {
                  border: 16px solid #f3f3f3;
                  border-radius: 50%;
                  border-top: 16px solid #3498db;
                  width: 50px;
                  height: 50px;
                  -webkit-animation: spin 2s linear infinite; /* Safari */
                  animation: spin 2s linear infinite;
                }
                /* Safari */
                @-webkit-keyframes spin {
                  0% { -webkit-transform: rotate(0deg); }
                  100% { -webkit-transform: rotate(360deg); }
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
            </style>
            <div ng-show="!error" class="panel panel-default">
                <div class="panel-heading">
                    <p>
                    <button type="button" class="btn btn-link" ng-click="showAnnotations = !showAnnotations"><span class="glyphicon glyphicon-info-sign"></span></button>
                    {{label}}
                    <a type="button" class="btn" href="{{source}}"><span class="glyphicon glyphicon-download-alt"></span></a>
                    </p>
                    <div ng-show="showAnnotations">
                        <small>
                        <table class="table table-striped table-condensed">
                            <tr><td>Source:</td><td>{{source}}</td></tr>
                            <tr><td>Name:</td><td>{{block.name}}</td></tr>
                            <tr><td>File origin:</td><td>{{block.file_origin}}</td></tr>
                            <tr><td>Recording date:</td><td>{{block.rec_datetime}}</td></tr>
                            <tr><td>Segments:</td><td>{{block.segments.length}}</td></tr>
                        </table>
                        </small>
                    </div>
                    <form class="form-inline">
                    <div ng-show="segment.consistency" >Segment <b>#{{currentSegmentId}}</b> is consistent<br/>
                        <label>Show all signals on the same axes:
                            <input type="checkbox" ng-model="segmentCheck" ng-change="showSegmentSignals(segmentCheck)" >
                        </label>
                    </div>
                    <div ng-show="block.consistency">Block is consistent<br/>
                        <label>Show signals from all segments on the same axes:
                            <input type="checkbox" ng-model="blockCheck" ng-change="showBlockSignals(blockCheck)">
                        </label>
                    </div>
                    <div ng-show="!blockSignals">
                        <select class="form-control" ng-change="switchSegment()" ng-model="currentSegmentId">
                            <option ng-repeat="segment in block.segments" value="{{$index}}">
                                Segment #{{$index}}
                            </option>
                        </select>
                        <!--<p>{{segment.name}}</p>
                        <p>Contains {{segment.analogsignals.length}} analog signals</p>-->
                        <select class="form-control" ng-show="segment" ng-change="switchAnalogSignal()" ng-model="currentAnalogSignalId">
                            <option value="">--- Please select signal ---</option> <!-- not selected / blank option -->
                            <option ng-show="segment.analogsignals" ng-repeat="signal in segment.analogsignals" value="{{$index}}">
                                Signal #{{$index}} <span ng-show="signal.name">({{signal.name}})</span>
                            </option>
                            <option ng-show="segment.irregularlysampledsignals" ng-repeat="signal in segment.irregularlysampledsignals" value="{{$index}}">
                                Signal #{{$index}} <span ng-show="signal.name">({{signal.name}})</span>
                            </option>
                        </select>
                    </div>
                    <div ng-show="blockSignals">
                        <select class="form-control" ng-show="segment" ng-change="showSelectedSignals(SignalId)" ng-model="SignalId">
                            <option value="">--- Please select signal ---</option> <!-- not selected / blank option -->
                            <option ng-repeat="signal in segment.analogsignals" value="{{$index}}">Signal #{{$index}}</option>
                        </select>
                    </div>
                    </form>
                </div>
                <div ng-if="dataLoading" class="loader"></div>
                <div class="panel-body" ng-show="signal && !dataLoading">
                    <nvd3 options="options" data=graph_data.values id=''></nvd3>
                </div>
                <div ng-show="segmentSignals">
                    <nvd3 options="segment_options" data="segment_data"></nvd3>
                </div>
                <div ng-show="blockSignals">
                    <nvd3 options="block_options" data="block_data"></nvd3>
                </div>
                <div ng-show="channelSignals">
                    <nvd3 options="channel_options" data="channel_data"></nvd3>
                </div>
            </div>
            <div ng-show="error" class="panel panel-error">
                <div class="panel-heading">
                    <p>Error</p>
                </div>
                <div class="panel-body">
                    {{error}}
                </div>
            </div>
            </div>
        `,
        scope: { source: '@', height: '@', iotype: '@', block: '@' },
        controller: 'MainCtrl'
    }
})

.controller("URLFormController", function($scope) {
    $scope.dataFileURL = "";
});
