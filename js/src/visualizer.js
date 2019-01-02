

angular.module('neo-visualizer', ['ng', 'ngResource', 'nvd3'])

.controller('MainCtrl', function($scope, BlockData, SegmentData, AnalogSignalData, Graphics) {
    console.log($scope.source);
    if (!$scope.height) {
        $scope.height = 600;
    }
    $scope.block = null;
    $scope.showAnnotations = false;
    $scope.label = $scope.source.substring($scope.source.lastIndexOf('/') + 1);
    console.log($scope.label);

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

    $scope.switchSegment = function() {
        $scope.signal = null;
        if ($scope.block.segments[$scope.currentSegmentId].analogsignals[0] == undefined) {
            console.log("Fetching data for segment #" + $scope.currentSegmentId);
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
        if ($scope.segment.analogsignals[$scope.currentAnalogSignalId].values == undefined) {
            console.log("Fetching data for analog signal #" + $scope.currentAnalogSignalId + " in segment #" + $scope.currentSegmentId);
            AnalogSignalData.get({url: $scope.source,
                                  segment_id: $scope.currentSegmentId,
                                  analog_signal_id: $scope.currentAnalogSignalId,
                                  type: $scope.iotype
                                 }).$promise.then(
                function(data) {
                    $scope.signal = data;
                    $scope.signal.id = $scope.currentAnalogSignalId;
                    $scope.block.segments[$scope.currentSegmentId].analogsignals[$scope.currentAnalogSignalId] = $scope.signal;
                    console.log(data);
                    Graphics.initGraph($scope.signal).then(function(graph_data) {
                        $scope.graph_data = graph_data;
                        $scope.options = Graphics.getOptions("View of analogsignal", "", "", graph_data.values, $scope.signal, $scope.height)
                        $scope.$apply();
                    });
                },
                function(err) {
                    console.log("Error in getting signal");
                    console.log(err);
                }
            );
        } else {
            console.log("Switching to cached signal #" + $scope.currentAnalogSignalId + " in segment #" + $scope.currentSegmentId);
            $scope.signal = $scope.block.segments[$scope.currentSegmentId].analogsignals[$scope.currentAnalogSignalId];
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


        //utilitary functions
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
        templateUrl: '/src/visualizer.tpl.html',
        scope: { source: '@', height: '@', iotype: '@' },
        controller: 'MainCtrl'
    }
});
