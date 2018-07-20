var FileServices = angular.module('FileServices', ['ngResource', 'ApiCommunicationServices']);


FileServices.service('FileService', ['$rootScope', '$timeout', 'BlockDataRest', 'SegmentDataRest', 'AnalogSignalDataRest',

    function($rootScope, $timeout, BlockDataRest, SegmentDataRest, AnalogSignalDataRest) {
        var fake_data = {
            block: [{
                description: "a fake block",
                file_origin: "comming from nowhere",
                name: 'fake block 1',
                segments: [{
                    name: "segment 1",
                    description: "a first fake segment",
                    file_origin: "nowhere",
                    nb_analog_signals: 3,
                    nb_spiketrains: 2,
                    spiketrains: [],
                    analogsignals: []
                }, {
                    name: "segment 2",
                    description: "a second fake segment",
                    file_origin: "nowhere",
                    nb_analog_signals: 1,
                    nb_spiketrains: 2,
                    spiketrains: [],
                    analogsignals: []
                }, {
                    name: "segment 3",
                    description: "a third fake segment",
                    file_origin: "nowhere",
                    nb_analog_signals: 5,
                    nb_spiketrains: 1,
                    spiketrains: [],
                    analogsignals: []
                }]
            }]
        }
        var fake_seg = [{
                name: "segment 1",
                description: "a first fake segment",
                file_origin: "nowhere",
                nb_analog_signals: 3,
                nb_spiketrains: 2,
                spiketrains: [
                    { id: 1 },
                    { id: 2 },
                ],
                analogsignals: [
                    { id: 1 },
                    { id: 2 },
                    { id: 3 },
                ]
            },
            {
                name: "segment 2",
                description: "a second fake segment",
                file_origin: "nowhere",
                nb_analog_signals: 1,
                nb_spiketrains: 2,
                spiketrains: [
                    { id: 1 }
                ],
                analogsignals: [
                    { id: 1 },
                    { id: 2 },
                ]
            }, {
                name: "segment 3",
                description: "a third fake segment",
                file_origin: "nowhere",
                nb_analog_signals: 5,
                nb_spiketrains: 1,
                spiketrains: [
                    { id: 1 },
                ],
                analogsignals: [
                    { id: 1 },
                    { id: 2 },
                    { id: 2 },
                    { id: 2 },
                    { id: 5 },
                ]
            }
        ]

        var fake_signal = [{
                signal_id: 1,
                values: [

                ]
            },
            {
                signal_id: 2
            },
            {
                signal_id: 3
            }
        ]
        var fileName = undefined;
        var fileUrl = undefined;
        var data = undefined;

        var setService = function(filename) {
            ////set the service if a filename is given /// TODO: check if necessary to add promises in each function 
            return new Promise(function(resolve, reject) {
                setFileName(filename);
                var url = getUrlFromCollab();
                setFileUrl(url);

                if (data == undefined) {
                    getBlockData().then(function(temp_data) {
                        // data = fake_data //temp_data;
                        data = temp_data;
                        resolve(temp_data); ///temp_data
                    })
                } else {
                    console.log('data already loaded')
                    resolve(data)
                }
            })
        }

        var loadSegment = function(segment_id) {
            return new Promise(function(resolve, reject) {
                if (data.block[0].segments[segment_id].analogsignals[0] == undefined) {
                    getSegmentData(segment_id).then(function(segment_data) {
                        data.block[0].segments[segment_id] = segment_data;
                        $rootScope.$broadcast('data_updated');
                        resolve(segment_data)
                    })
                } else {
                    resolve(data.block[0].segments[segment_id])
                }
            })
        }


        var loadAnalogSignal = function(segment_id, signal_id) {
            return new Promise(function(resolve, reject) {
                if (data.block[0].segments[segment_id].analogsignals[signal_id].values == undefined) {
                    getAnalogSignalData(segment_id, signal_id).then(function(signal_data) {
                        data.block[0].segments[segment_id].analogsignals[signal_id] = signal_data;
                        $rootScope.$broadcast('data_updated');
                        resolve(signal_data)
                    })
                } else {
                    resolve(data.block[0].segments[segment_id].analogsignals[signal_id])
                }
            })
        }

        var getUrlFromCollab = function() {
            //TODO WITH COLLAB 
            //for now we just get the file stored in the folder. 
            return ""; //will hav to fill with correct url
        }

        var getBlockData = function() {
            ///get block information from the api 
            return new Promise(function(resolve, reject) {
                var temp_data = BlockDataRest.get({ url: fileUrl });
                temp_data.$promise.then(function(data) {

                    // resolve(fake_data); //resolve(data);
                    resolve(data);
                });
            })
        }

        var getSegmentData = function(segment_id) {
            ///get segment information from the api 
            return new Promise(function(resolve, reject) {
                var temp_data = SegmentDataRest.get({ segment_id: segment_id });
                temp_data.$promise.then(function(segment_data) {
                    resolve(segment_data);
                });
            })
        }

        var getAnalogSignalData = function(segment_id, signal_id) {
                ///get analogsignam information from the api 
                return new Promise(function(resolve, reject) {
                    var temp_data = AnalogSignalDataRest.get({ segment_id: segment_id, analog_signal_id: signal_id });
                    temp_data.$promise.then(function(signal_data) {
                        //resolve(fake_signal[signal_id]);
                        resolve(signal_data);
                    });
                })
            }
            //sets 
        var setFileName = function(name) {
            fileName = name;
        }

        var setFileUrl = function(url) {
            fileUrl = url;
        }
        var setData = function(data) {
                data = data;
            }
            //gets
        var getFileName = function() {
            return fileName
        }

        var getFileUrl = function() {
            return fileUrl;
        }

        var getData = function() {
            return data;
        }

        var get_navigation_data = function() {

            return {}
        }

        return {
            setService: setService,
            // GetStoredDataOrsetService: GetStoredDataOrsetService,
            getUrlFromCollab: getUrlFromCollab,
            loadSegment: loadSegment,
            // loadBlock: loadBlock,
            loadAnalogSignal: loadAnalogSignal,

            //sets
            setFileName: setFileName,
            setFileUrl: setFileUrl,
            setData: setData,
            //gets
            getFileName: getFileName,
            getFileUrl: getFileUrl,
            getData: getData,
            get_navigation_data: get_navigation_data,
        }
    }
])


var GraphicsServices = angular.module('GraphicsServices', ['ngResource', 'ApiCommunicationServices']);

GraphicsServices.factory('Graphics', ['$rootScope',
    function($rootScope) {

        //graphs functions 
        var getOptions = function(title, subtitle, caption, graph_data, raw_data) {

            var yminymax = _get_min_max_values(raw_data.values);

            var xminxmax = _get_min_max_values(raw_data.times);

            options = {
                chart: {
                    type: 'lineChart',
                    height: 450,
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: 55
                    },
                    x: function(d) { return d.x; },
                    y: function(d) { return d.y; },
                    useInteractiveGuideline: true,
                    dispatch: {
                        stateChange: function(e) { console.log("stateChange"); },
                        changeState: function(e) { console.log("changeState"); },
                        tooltipShow: function(e) { console.log("tooltipShow"); },
                        tooltipHide: function(e) { console.log("tooltipHide"); },
                    },
                    xAxis: {
                        axisLabel: raw_data.times_dimensionality,
                    },

                    yAxis: {
                        axisLabel: raw_data.values_units,
                        showMaxMin: false,
                        tickFormat: function(d) {
                            return d3.format('.02f')(d);
                        },
                        axisLabelDistance: -10,
                    },

                    xDomain: xminxmax.value,
                    xRange: null,
                    yDomain: yminymax,
                    yRange: null,
                    tooltips: true,
                    callback: function(chart) {

                    }
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
                }
            };

            return options;


        }

        // var focus = function(list_id_couple, results_data) {
        //     // var list_data = [];
        //     // var i = 0;
        //     // for (i; i < list_id_couple.length; i++) {
        //     //     data = find_result_in_data(list_id_couple[i], results_data, type);
        //     //     data.line_id = list_id_couple[i].id_line;
        //     //     list_data.push(data);
        //     // }
        //     // $rootScope.$broadcast('data_focussed:updated', list_data, graph_key);
        // };

        // var find_result_in_data = function(id_couple, results_data, type) {
        //     var result_to_return = undefined;
        //     var id_line = id_couple.id_line;
        //     var id_result = id_couple.id_result;

        //     if (type == 'model') {
        //         //find the correct result in datablock
        //         for (var i in results_data) {
        //             for (var j in results_data[i]) {
        //                 if (id_result == results_data[i][j].id) {
        //                     result_to_return = results_data[i][j];
        //                 };
        //             }
        //         };
        //         return result_to_return;
        //     };
        //     if (type == 'test') {
        //         for (var i in results_data) {
        //             for (var j in results_data[i]) {
        //                 for (var k in results_data[i][j].result) {
        //                     if (id_result == results_data[i][j].result[k].id) {
        //                         var result_to_return = results_data[i][j].result[k];
        //                         result_to_return.additional_data = results_data[i][j].additional_data;
        //                     };
        //                 };
        //             }
        //         };
        //         return result_to_return;
        //     };
        // };

        // var getUpdatedGraph = function(data, list_ids) {
        //     var newdata = [];
        //     for (var i in data) {
        //         for (var j in list_ids) {
        //             if (data[i].key == list_ids[j]) {
        //                 newdata.push(data[i]);
        //             }
        //         }
        //     }
        //     return newdata;
        // }

        //tests graphs

        var initGraph = function(raw_data) {
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
                    key: "analogsignal", //key  - the name of the series.
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
            // find_result_in_data: find_result_in_data,
            // focus: focus,
            // getUpdatedGraph: getUpdatedGraph,
            _get_min_max_values: _get_min_max_values,

            initGraph: initGraph,
            get_graph_values: get_graph_values,
            // TestGraph_getRawData: TestGraph_getRawData,
            // TestGraph_getAbscissaValues: TestGraph_getAbscissaValues,
            // TestGraph_getLineId: TestGraph_getLineId,
            // TestGraph_manageDataForTestGraph: TestGraph_manageDataForTestGraph,
            // TestGraph__manageDataForResultsTab: TestGraph__manageDataForResultsTab,
            // TestGraph_getLatestVersionModel: TestGraph_getLatestVersionModel,
            // TestGraph_getLastResultTimestamp: TestGraph_getLastResultTimestamp,
            // TestGraph_reorganizeRawDataForResultTable: TestGraph_reorganizeRawDataForResultTable,
            // TestGraph_initTestGraph: TestGraph_initTestGraph,

        };

    }
]);