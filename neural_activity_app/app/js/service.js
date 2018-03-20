var ContextServices = angular.module('ContextServices', ['ngResource', 'ApiCommunicationServices']);

ContextServices.service('Context', ['$rootScope', '$location', 'CollabIDRest', 'AppIDRest',
    function($rootScope, $location, CollabIDRest, AppIDRest) {

        var goToFileView = function() {
            alert('working')
            $location.path("/home/file-view");
        }

        var ctx;
        var state_type = undefined;
        var state = undefined;
        var external = undefined;
        var collabID = undefined;
        var appID = undefined;
        var serviceSet = false;


        var getCurrentLocationSearch = function() {
            return window.location.search;
        }
        var setService = function() {
            return new Promise(function(resolve, reject) {

                if (serviceSet == false) {
                    // _getState();
                    var location = getCurrentLocationSearch();
                    temp_state = location.split("&")[1];


                    if (temp_state != undefined && temp_state != "ctxstate=") {
                        temp_state2 = temp_state.split("%2C")[0];
                        temp_state2 = temp_state2.substring(9);
                        state_type = temp_state2.split(".")[0]
                        state = temp_state2.split(".")[1]

                        if (temp_state.split("%2C")[1] != undefined) {
                            external = temp_state.split("%2C")[1];
                        }
                    }

                    // _getCtx();
                    if (ctx == undefined) {
                        ctx = window.location.search.split("&")[0].substring(5);
                    }

                    // getCollabID();
                    if (collabID == undefined || collabID == "") {
                        var collab_request = CollabIDRest.get({ ctx: ctx }); //.collab_id;
                        collab_request.$promise.then(function() {
                            collabID = collab_request.collab_id
                        });
                    }

                    // getAppID();
                    if (appID == undefined || appID == "") {
                        var app_request = AppIDRest.get({ ctx: ctx }); //.collab_id;
                        app_request.$promise.then(function() {
                            appID = app_request.app_id
                        });
                    }

                    if (app_request == undefined) {
                        if (collab_request == undefined) {
                            serviceSet = true;
                            resolve();
                        } else {
                            collab_request.$promise.then(function() {
                                serviceSet = true;
                                resolve();
                            });
                        }
                    } else {
                        app_request.$promise.then(function() {

                            if (collab_request == undefined) {
                                serviceSet = true;
                                resolve();

                            } else {
                                collab_request.$promise.then(function() {
                                    serviceSet = true;
                                    resolve();
                                });
                            }
                        });
                    }

                } else {
                    resolve();
                }

            });
        };

        var setState = function(id) {
            state = id;
        };


        var getExternal = function() {
            return external;
        }

        var getState = function() {
            return state;
        };

        var getStateType = function() {
            return state_type;
        }

        var getCtx = function() {
            return ctx;
        };

        var setCtx = function(context) {
            ctx = context;
        }

        var getCollabID = function() {
            return collabID;
        };

        var getAppID = function() {
            return appID;
        };

        var getServiceSet = function() {
            return serviceSet;
        }

        var sendState = function(type, id) {
            state_type = type;
            window.parent.postMessage({
                eventName: 'workspace.context',

                data: {
                    state: type + '.' + id
                }
            }, 'https://collab.humanbrainproject.eu/');
        };


        var clearState = function() {

            window.parent.postMessage({
                eventName: 'workspace.context',

                data: {
                    state: ''
                }
            }, 'https://collab.humanbrainproject.eu/');

            state = "";
            state_type = undefined;


            setTimeout(function() {
                // window.location.href = "ctx=" + getCtx() + "&ctxstate=";
                window.location.hash = "ctx=" + getCtx() + "&ctxstate=";
                // console.log(window.location.hash);

                // window.location.search = "ctx=" + getCtx() + "&ctxstate=";


            }, 300);

        };

        var clearExternal = function() {
            sendState(state_type, state);
            // window.location.search = "ctx=" + getCtx() + "&ctxstate="+state_type+"."+state;
            window.location.search = "ctx=" + getCtx() + "&ctxstate=";
        };

        return {
            setService: setService,
            setCtx: setCtx,
            getCtx: getCtx,
            getCollabID: getCollabID,
            getAppID: getAppID,
            getState: getState,
            getServiceSet: getServiceSet,
            sendState: sendState,
            clearState: clearState,
            clearExternal: clearExternal,
            setState: setState,
            getExternal: getExternal,
            getStateType: getStateType,
            getCurrentLocationSearch: getCurrentLocationSearch,
            goToFileView: goToFileView,
        }
    }
]);




var FileServices = angular.module('FileServices', ['ngResource', 'ApiCommunicationServices']);

// FileServices.factory('dataShare', function($rootScope, $timeout) {
//     var service = {};
//     service.data = false;
//     this.data = [];
//     service.sendData = function(data) {
//         this.data = data;
//         $timeout(function() {
//             $rootScope.$broadcast('data_shared');
//         }, 100);
//     };
//     service.getData = function() {
//         return this.data;
//     };
//     return service;
// });

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
                        data = fake_data //temp_data;
                        resolve(fake_data); ///temp_data
                    })
                } else {
                    // $timeout(function() {
                    //     $rootScope.$broadcast('data_shared');
                    // }, 100);
                    console.log('data already loaded')
                    resolve(data)
                }
            })
        }

        // var loadBlock = function(block_id) {
        //     return new Promise(function(resolve, reject) {

        //         getBlockData(block_id).then(function(block_data) {

        //             if (data == undefined) {
        //                 // getBlockData().then(function(temp_data) {
        //                 //     data = fake_data //temp_data;
        //                 //     resolve(fake_data); ///temp_data
        //                 // })
        //                 resolve(segment_data)
        //             } else {
        //                 console.log("data alrady loaded so")
        //                 data.block[block_id].segments[segment_id] = segment_data;
        //                 console.log(data.block[block_id].segments[segment_id])
        //                 $rootScope.$broadcast('data_updated');
        //                 console.log('data updated')
        //                 resolve(segment_data)
        //             }
        //         })
        //     })
        // }

        var loadSegment = function(block_id, segment_id) {
            return new Promise(function(resolve, reject) {

                getSegmentData(block_id, segment_id).then(function(segment_data) {

                    if (data == undefined) {
                        // getBlockData().then(function(temp_data) {
                        //     data = fake_data //temp_data;
                        //     resolve(fake_data); ///temp_data
                        // })
                        resolve(segment_data)
                    } else {
                        console.log("data alrady loaded so")
                        data.block[block_id].segments[segment_id] = segment_data;
                        console.log(data.block[block_id].segments[segment_id])
                        $rootScope.$broadcast('data_updated');
                        console.log('data updated')
                        resolve(segment_data)
                    }
                })
            })
        }

        var loadAnalogSignal = function(block_id, segment_id, signal_id) {
            return new Promise(function(resolve, reject) {

                getAnalogSignalData(block_id, segment_id, signal_id).then(function(signal_data) {

                    if (data == undefined) {
                        // getBlockData().then(function(temp_data) {
                        //     data = fake_data //temp_data;
                        //     resolve(fake_data); ///temp_data
                        // })
                        resolve(signal_data)
                    } else {
                        console.log("data alrady loaded so")
                        data.block[block_id].segments[segment_id].analogsignals[signal_id] = signal_data;
                        $rootScope.$broadcast('data_updated');
                        resolve(signal_data)
                    }
                })
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

                    resolve(fake_data); //resolve(data);
                });
            })
        }

        var getSegmentData = function(block_id, segment_id) {
            ///get segment information from the api 
            return new Promise(function(resolve, reject) {
                var temp_data = SegmentDataRest.get({ block_id: block_id, segment_id: segment_id });
                temp_data.$promise.then(function(segment_data) {
                    resolve(fake_seg[segment_id]);
                });
            })
        }

        var getAnalogSignalData = function(block_id, segment_id, signal_id) {
                ///get analogsignam information from the api 
                return new Promise(function(resolve, reject) {
                    var temp_data = AnalogSignalDataRest.get({ block_id: block_id, segment_id: segment_id, analog_signal_id: signal_id });
                    temp_data.$promise.then(function(signal_data) {
                        resolve(fake_signal[signal_id]);
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


var GraphicsServices = angular.module('GraphicsServices', ['ngResource', 'btorfs.multiselect', 'ApiCommunicationServices', 'ParametersConfigurationServices', 'ContextServices']);

GraphicsServices.factory('Graphics', ['$rootScope', 'Context', 'ValidationResultRest',
    function($rootScope, Context, ValidationResultRest) {

        //graphs functions 
        var get_lines_options = function(title, subtitle, Yaxislabel, caption, results_data, type, graph_key, abscissa_value) {

            var yminymax = _get_min_max_yvalues(results_data);
            var xminxmax = _get_min_max_xvalues(abscissa_value);

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
                        axisLabel: 'Version',
                        tickValues: xminxmax.range,
                        // tickValues: function(d) {
                        //     return d3.format('.02f')(d);
                        // },
                        ticks: xminxmax.range.length,

                        tickFormat: function(d) {
                            for (var a in abscissa_value) {
                                if (abscissa_value[a] == d) {
                                    return a;
                                }
                            }
                            //return d3.time.format('%d-%m-%y')(new Date(d))
                        },
                    },

                    yAxis: {
                        axisLabel: Yaxislabel,
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
                        chart.lines.dispatch.on('elementClick', function(e) {
                            var list_of_results_id = [];
                            var i = 0;
                            for (i; i < e.length; i++) {
                                var j = 0;
                                for (j; j < e[i].series.values.length; j++) {
                                    if (e[i].series.values[j].x == e[i].point.x) {
                                        list_of_results_id.push({ id_line: e[i].series.values[j].id, id_result: e[i].series.values[j].id_test_result });
                                    }
                                }
                            }
                            focus(list_of_results_id, results_data, type, graph_key);
                        });
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

        var focus = function(list_id_couple, results_data, type, graph_key) {
            var list_data = [];
            var i = 0;
            for (i; i < list_id_couple.length; i++) {
                data = find_result_in_data(list_id_couple[i], results_data, type);
                data.line_id = list_id_couple[i].id_line;
                list_data.push(data);
            }
            $rootScope.$broadcast('data_focussed:updated', list_data, graph_key);
        };

        var find_result_in_data = function(id_couple, results_data, type) {
            var result_to_return = undefined;
            var id_line = id_couple.id_line;
            var id_result = id_couple.id_result;

            if (type == 'model') {
                //find the correct result in datablock
                for (var i in results_data) {
                    for (var j in results_data[i]) {
                        if (id_result == results_data[i][j].id) {
                            result_to_return = results_data[i][j];
                        };
                    }
                };
                return result_to_return;
            };
            if (type == 'test') {
                for (var i in results_data) {
                    for (var j in results_data[i]) {
                        for (var k in results_data[i][j].result) {
                            if (id_result == results_data[i][j].result[k].id) {
                                var result_to_return = results_data[i][j].result[k];
                                result_to_return.additional_data = results_data[i][j].additional_data;
                            };
                        };
                    }
                };
                return result_to_return;
            };
        };

        var getUpdatedGraph = function(data, list_ids) {
            var newdata = [];
            for (var i in data) {
                for (var j in list_ids) {
                    if (data[i].key == list_ids[j]) {
                        newdata.push(data[i]);
                    }
                }
            }
            return newdata;
        }

        //tests graphs

        var TestGraph_getRawData = function(test_versions) {
            return new Promise(function(resolve, reject) {
                var test_id = test_versions.test_codes[0].test_definition_id;
                var get_raw_data = ValidationResultRest.get({ app_id: Context.getAppID(), test_id: test_id, order: 'model_instance' });
                get_raw_data.$promise.then(function(raw_data) {
                    resolve(raw_data);
                });
            });
        };

        var TestGraph_initTestGraph = function(test_versions, raw_data) {
            return new Promise(function(resolve, reject) {
                var graph_values = [];
                var list_line_ids = [];
                var results = [];
                var abscissa_values = [];

                var colors; //color array for the graph

                abscissa_values = TestGraph_getAbscissaValues(test_versions); //abscissa array for graphs


                colors = _get_color_array(raw_data.model_instances);

                for (var instance in raw_data.model_instances) {

                    var model_id = raw_data.model_instances[instance].model_id;

                    var line_id = TestGraph_getLineId(raw_data.model_instances[instance])

                    list_line_ids.push(line_id)
                        //manage data for graph
                    graph_values.push(TestGraph_manageDataForTestGraph(raw_data.model_instances[instance].test_codes, raw_data.model_instances[instance].timestamp, line_id, model_id, instance, abscissa_values, colors[instance]));
                    results.push(TestGraph__manageDataForResultsTab(raw_data.model_instances[instance]))
                }
                var latest_model_instances_line_id = TestGraph_getLatestVersionModel(graph_values, list_line_ids);
                resolve({ 'values': graph_values, 'results': results, 'list_ids': list_line_ids, 'abs_info': abscissa_values, 'latest_model_instances_line_id': latest_model_instances_line_id });
            });

        }

        var TestGraph_getLatestVersionModel = function(values, list_ids) {
            var latest_version_of_models = [];
            var models_array = [];

            for (var i in values) {
                if (models_array[values[i].model_id] == undefined) {
                    models_array[values[i].model_id] = [];
                    if (list_ids.includes(values[i].key)) {
                        models_array[values[i].model_id].push(values[i]);
                    }

                } else {
                    if (list_ids.includes(values[i].key)) {
                        models_array[values[i].model_id].push(values[i]);
                    }
                }
            }

            for (var model in models_array) {
                models_array[model].sort(_sort_results_by_timestamp_desc);
                latest_version_of_models.push({ 'latest_line_id': models_array[model][0].key, 'latest_timestamp': models_array[model][0].timestamp })
            }
            return latest_version_of_models;
        }

        var TestGraph_getAbscissaValues = function(test_versions) {
            var abscissa_value = new Object();

            for (var tv in test_versions.test_codes) {
                var version_name = test_versions.test_codes[tv].version;
                abscissa_value[version_name] = parseInt(tv);
            }
            return abscissa_value;
        }

        var TestGraph_getLineId = function(instance) {
            var line_id;
            if (instance.model_alias && instance.model_alias !== null && instance.model_alias !== '' && instance.model_alias !== "None") {
                line_id = instance.model_alias + ' ( ' + instance.version + ' )';
            } else {
                line_id = instance.model_id.substring(0, 8) + '... ( ' + instance.version + ' )';
            }
            return line_id;
        }

        var TestGraph__manageDataForResultsTab = function(instance) {
            var results = new Array();
            for (var c in instance.test_codes) {
                var additional_data = {
                    "model_name": instance.model_name,
                    "model_id": instance.model_id,
                    "model_instance": instance.version,
                    "test_code": instance.test_codes[c].version
                }

                var res = new Array();
                for (var r in instance.test_codes[c].results) {
                    res.push(instance.test_codes[c].results[r]);
                }
                results.push({ "result": res.sort(_sort_results_by_timestamp_desc), "additional_data": additional_data });
            }
            return results;
        }

        var TestGraph_manageDataForTestGraph = function(data, timestamp, line_id, model_id, instance_id, abscissa_value, color) {
            var values_temp = [];
            for (var c in data) {
                for (var r in data[c].results) {
                    var temp = {
                        x: abscissa_value[data[c].version],
                        y: data[c].results[r].score,
                        label: data[c].version,
                        id: line_id,
                        id_test_result: data[c].results[r].id,
                    };
                    values_temp.push(temp);
                };
            };
            //sort datas by test code abscissa value

            var data_to_return = {
                values: values_temp.sort(_sort_results_by_x), //values - represents the array of {x,y} data points
                key: line_id, //key  - the name of the series.
                id: instance_id,
                color: "#" + color, //_pickRandomColor(), //color - optional: choose your own line color.
                model_id: model_id,
                timestamp: timestamp,
            };
            return (data_to_return);
        }

        var TestGraph_reorganizeRawDataForResultTable = function(model_instances, code_versions) {
            var organized_data = new Object();
            organized_data.model_instances = [];

            for (var model_instance in model_instances) {
                var instance = new Object();

                var model_id = model_instances[model_instance].model_id;
                var line_id = TestGraph_getLineId(model_instances[model_instance]);

                instance.timestamp = model_instances[model_instance].timestamp;
                instance.id = model_instance;
                instance.model_id = model_instances[model_instance].model_id;
                instance.model_name = model_instances[model_instance].model_name;
                instance.line_id = line_id;
                instance.test_instances = [];

                for (var c in code_versions) {
                    instance.test_instances.push(code_versions[c]);
                }

                for (var test_instance in model_instances[model_instance].test_codes) {
                    var code = new Object();
                    code.version = model_instances[model_instance].test_codes[test_instance].version;
                    code.timestamp = model_instances[model_instance].test_codes[test_instance].timestamp;

                    code.results = [];
                    for (var result in model_instances[model_instance].test_codes[test_instance].results) {
                        //only keep the first five significant score figures 
                        var res = model_instances[model_instance].test_codes[test_instance].results[result];
                        res.score = res.score.toPrecision(5);
                        code.results.push(res);
                    }
                    //order results by timestamp
                    code.results = code.results.sort(_sort_results_by_timestamp_desc);

                    for (var i in instance.test_instances) {
                        if (instance.test_instances[i].version == code.version) {
                            instance.test_instances[i] = code;
                        }
                    }
                }

                //order test_instances by timestamp
                instance.last_result_timestamp = TestGraph_getLastResultTimestamp(instance.test_instances);
                instance.test_instances = instance.test_instances.sort(_sort_results_by_timestamp_asc);
                organized_data.model_instances.push(instance);
            }
            //sort model instances by last result timestamp

            organized_data.model_instances = organized_data.model_instances.sort(_sort_by_last_result_timestamp_desc)

            return organized_data;
        };

        var TestGraph_getLastResultTimestamp = function(codes) {
            var newest_timestamp = undefined;
            for (var code in codes) {
                if (codes[code].results) {
                    var id_first = Object.keys(codes[code].results);
                    var timestamp = codes[code].results[id_first[0]].timestamp;
                    if (newest_timestamp == undefined || (newest_timestamp && timestamp > newest_timestamp)) {
                        newest_timestamp = timestamp;
                    }
                }
            }
            return newest_timestamp;
        }

        // var TestGraph_getMoreRecentVersionsGraphValues = function(list_version_ids, test_versions, raw_data) {
        //     return new Promise(function(resolve, reject) {
        //         var graph_values = [];
        //         var abscissa_values = [];

        //         var colors; //color array for the graph

        //         abscissa_values = TestGraph_getAbscissaValues(test_versions); //abscissa array for graphs

        //         raw_data.$promise.then(function() {
        //             colors = _get_color_array(raw_data.model_instances);
        //             for (var instance in raw_data.model_instances) {

        //                 if (list_version_ids.includes(instance)) {
        //                     var model_id = raw_data.model_instances[instance].model_id;
        //                     var line_id = TestGraph_getLineId(raw_data.model_instances[instance])

        //                     //manage data for graph
        //                     graph_values.push(TestGraph_manageDataForTestGraph(raw_data.model_instances[instance].test_codes, line_id, model_id, instance, abscissa_values, colors[instance]));
        //                 }
        //             }
        //             resolve(graph_values);
        //         });
        //     });
        // }


        // Model detail graphs
        var ModelGraph_getRawData = function(model_id, score_type_array) {
            return new Promise(function(resolve, reject) {
                var get_raw_data = ValidationResultRest.get({ app_id: Context.getAppID(), model_id: model_id, order: 'score_type' });
                get_raw_data.$promise.then(function(raw_data) {
                    // var data = _rearrange_raw_data_in_score_type_array(raw_data)
                    resolve(raw_data);
                })
            })
        };


        var ModelGraph_init_Graphs = function(model_instances, raw_data) {
            return new Promise(function(resolve, reject) {

                var abscissa_value = [];

                var single_graphs_datas = [];

                for (var sc_t in raw_data.score_type) {
                    abscissa_value = ModelGraph_getAbscissaValues(model_instances);

                    single_graphs_datas.push({ score_type: sc_t, values: ModelGraph_init_single_ModelGraphs(raw_data.score_type[sc_t], abscissa_value, sc_t) });
                }

                var all_graphs_values = ModelGraph_get_all_graph_values(single_graphs_datas);

                resolve({ 'values': all_graphs_values, 'single_graphs_data': single_graphs_datas })

            });
        }

        var ModelGraph_getAbscissaValues = function(model_instances) {
            var abscissa_value = new Object();
            for (var mi in model_instances.instances) {
                var version_name = model_instances.instances[mi].version;
                abscissa_value[version_name] = parseInt(mi);
            }
            return abscissa_value;
        }

        var ModelGraph_init_single_ModelGraphs = function(raw_data, abscissa_value, score_type) {

            var graph_values = [];
            var list_line_ids = [];
            var results = [];

            var colors; //color array for the graph

            colors = _get_color_array(raw_data.test_codes)

            for (var code in raw_data.test_codes) {

                var line_id = ModelGraph_getLineId(raw_data.test_codes[code]);
                var test_id = raw_data.test_codes[code].test_id;
                list_line_ids.push(line_id);
                raw_data.test_codes[code].line_id = line_id;
                graph_values.push(ModelGraph_manageDataForGraph(raw_data.test_codes[code].timestamp, raw_data.test_codes[code].model_instances, line_id, test_id, score_type, abscissa_value, colors[code]));
                results.push(ModelGraph_manageDataForResultsTab(raw_data.test_codes[code]))
            }

            var latest_test_versions_line_id = ModelGraph_get_latest_version_test(graph_values, list_line_ids);

            return ({ 'values': graph_values, 'results': results, 'list_ids': list_line_ids, 'abs_info': abscissa_value, 'latest_test_versions_line_id': latest_test_versions_line_id });
        }

        var ModelGraph_get_all_graph_values = function(single_graphs_data) {
            all_values = [];

            for (var i in single_graphs_data) {
                for (var j in single_graphs_data[i].values.values) {
                    all_values.push(single_graphs_data[i].values.values[j]);
                }
            }

            return all_values
        }

        var ModelGraph_get_latest_version_test = function(values, list_ids) {

            var latest_version_of_tests = [];
            var tests_array = [];

            for (var i in values) {
                if (tests_array[values[i].test_id] == undefined) {
                    tests_array[values[i].test_id] = [];
                    if (list_ids.includes(values[i].key)) {
                        tests_array[values[i].test_id].push(values[i]);
                    }

                } else {
                    if (list_ids.includes(values[i].key)) {
                        tests_array[values[i].test_id].push(values[i]);
                    }
                }
            }

            for (var test in tests_array) {
                tests_array[test].sort(_sort_by_last_result_timestamp_desc);
                latest_version_of_tests.push({ 'latest_line_id': tests_array[test][0].key, 'latest_timestamp': tests_array[test][0].timestamp })
            }

            return latest_version_of_tests;
        }

        var ModelGraph_getLineId = function(code) {
            var line_id;
            if (code.test_alias && code.test_alias != null && code.test_alias != '' && code.test_alias != 'None') {
                line_id = code.test_alias + ' ( ' + code.version + ' )';
            } else {
                line_id = code.test_id + ' ( ' + code.version + ' )';
            }
            return line_id;
        }

        var ModelGraph_manageDataForResultsTab = function(code) {
            var results = [];
            for (var v in code.model_instances) {
                var keys = Object.keys(code.model_instances[v].results);
                for (var k in keys) {
                    results.push(code.model_instances[v].results[keys[k]]);
                }
            }
            return results;
        }

        var ModelGraph_manageDataForGraph = function(timestamp, data, line_id, test_id, score_type, abscissa_value, color) {
            var values_temp = [];

            for (var v in data) {
                for (var r in data[v].results) {
                    var temp = {
                        x: abscissa_value[data[v].version],
                        y: data[v].results[r].score,
                        label: data[v].version,
                        id: line_id,
                        id_test_result: data[v].results[r].id,
                    };
                    values_temp.push(temp);
                };
            };
            var data_to_return = {
                values: values_temp.sort(_sort_results_by_x), //values - represents the array of {x,y} data points
                key: line_id, //key  - the name of the series.
                color: "#" + color,
                test_id: test_id,
                test_score_type: score_type,
                timestamp: timestamp,
            };
            return data_to_return;
        }
        var ModelGraphs_reorganizeRawDataForResultTable = function(raw_data, model_instances) {
            var organized_data = new Object();
            organized_data.test_codes = [];

            for (score_type in raw_data.score_type) {
                for (test_code in raw_data.score_type[score_type].test_codes) {
                    var code = new Object();

                    code.timestamp = raw_data.score_type[score_type].test_codes[test_code].timestamp;

                    code.id = test_code;
                    code.test_id = raw_data.score_type[score_type].test_codes[test_code].test_id;
                    code.test_name = raw_data.score_type[score_type].test_codes[test_code].test_name;

                    code.line_id = raw_data.score_type[score_type].test_codes[test_code].line_id;
                    code.model_instances = [];

                    for (var i in model_instances) {
                        code.model_instances.push(model_instances[i]);
                    }

                    for (var model_instance in raw_data.score_type[score_type].test_codes[test_code].model_instances) {
                        var instance = new Object();
                        instance.version = raw_data.score_type[score_type].test_codes[test_code].model_instances[model_instance].version;
                        instance.timestamp = raw_data.score_type[score_type].test_codes[test_code].model_instances[model_instance].timestamp;

                        instance.results = [];
                        for (var result in raw_data.score_type[score_type].test_codes[test_code].model_instances[model_instance].results) {
                            //only keep the first five significant score figures 
                            var res = raw_data.score_type[score_type].test_codes[test_code].model_instances[model_instance].results[result];
                            res.score = res.score.toPrecision(5);
                            instance.results.push(res);
                        }
                        //order results by timestamp
                        instance.results = instance.results.sort(_sort_results_by_timestamp_desc);
                        for (var j in code.model_instances) {
                            if (code.model_instances[j].version == instance.version) {
                                code.model_instances[j] = instance;
                            }
                        }
                        // code.model_instances.push(instance);
                    }
                    //order test_instances by timestamp
                    code.last_result_timestamp = TestGraph_getLastResultTimestamp(code.model_instances);
                    code.model_instances = code.model_instances.sort(_sort_results_by_timestamp_asc);
                    organized_data.test_codes.push(code);
                }
                //sort model instances by last result timestamp
                organized_data.test_codes = organized_data.test_codes.sort(_sort_by_last_result_timestamp_desc)

            }
            return organized_data;
        };

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

        var _sort_results_by_timestamp_desc = function(a, b) {
            return new Date(b.timestamp) - new Date(a.timestamp);
        }
        var _sort_results_by_timestamp_asc = function(a, b) {
            return new Date(a.timestamp) - new Date(b.timestamp);
        }

        var _sort_by_last_result_timestamp_desc = function(a, b) {
            return new Date(b.last_result_timestamp) - new Date(a.last_result_timestamp);
        }

        function _sort_results_by_x(a, b) {
            return a.x - b.x
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

        var _get_min_max_yvalues = function(results_data) {
            if (results_data[0]) {
                var minY = undefined;
                var maxY = undefined;

                var all_scores = [];
                //get all score value
                var i = 0;
                var k = 0;
                for (i; i < results_data.length; i++) {
                    for (k; k < results_data[i].length; k++) {
                        if (results_data[i][k].result != undefined) {
                            for (var j in results_data[i][k].result) {

                                all_scores.push(results_data[i][k].result[j].score);
                            }
                        } else {

                            if (results_data[i][k].score) {

                                all_scores.push(results_data[i][k].score);
                            }
                        }
                    }
                }
                //define min and max value as a purcentage of min and max scores
                minY = Math.min.apply(Math, all_scores);
                maxY = Math.max.apply(Math, all_scores);
                minY = minY - 0.10 * minY;
                maxY = maxY + 0.10 * maxY;
                return [minY, maxY];
            } else {
                return [null, null];
            }
        }

        var _get_min_max_xvalues = function(abscissa_value) {
            var minX = undefined;
            var maxX = undefined;
            var all_abscissa_values = [];
            //get all score value
            for (var i in abscissa_value) {
                all_abscissa_values.push(abscissa_value[i]);
            }

            minX = Math.min.apply(Math, all_abscissa_values);
            maxX = Math.max.apply(Math, all_abscissa_values);

            return { value: [minX, maxX], range: all_abscissa_values.sort() };
        }

        return {
            get_lines_options: get_lines_options,
            find_result_in_data: find_result_in_data,
            focus: focus,
            getUpdatedGraph: getUpdatedGraph,
            _get_min_max_yvalues: _get_min_max_yvalues,
            _get_min_max_xvalues: _get_min_max_xvalues,
            _sort_by_last_result_timestamp_desc: _sort_by_last_result_timestamp_desc,
            _sort_results_by_timestamp_desc: _sort_results_by_timestamp_desc,
            _sort_results_by_timestamp_asc: _sort_results_by_timestamp_asc,
            _sort_results_by_x: _sort_results_by_x,
            _get_color_array: _get_color_array,

            TestGraph_getRawData: TestGraph_getRawData,
            TestGraph_getAbscissaValues: TestGraph_getAbscissaValues,
            TestGraph_getLineId: TestGraph_getLineId,
            TestGraph_manageDataForTestGraph: TestGraph_manageDataForTestGraph,
            TestGraph__manageDataForResultsTab: TestGraph__manageDataForResultsTab,
            TestGraph_getLatestVersionModel: TestGraph_getLatestVersionModel,
            TestGraph_getLastResultTimestamp: TestGraph_getLastResultTimestamp,
            TestGraph_reorganizeRawDataForResultTable: TestGraph_reorganizeRawDataForResultTable,
            TestGraph_initTestGraph: TestGraph_initTestGraph,

            ModelGraph_getRawData: ModelGraph_getRawData,
            ModelGraph_getAbscissaValues: ModelGraph_getAbscissaValues,
            ModelGraph_getLineId: ModelGraph_getLineId,
            ModelGraph_manageDataForResultsTab: ModelGraph_manageDataForResultsTab,
            ModelGraph_manageDataForGraph: ModelGraph_manageDataForGraph,
            ModelGraph_get_latest_version_test: ModelGraph_get_latest_version_test,
            ModelGraph_init_single_ModelGraphs: ModelGraph_init_single_ModelGraphs,
            ModelGraph_get_all_graph_values: ModelGraph_get_all_graph_values,
            ModelGraph_init_Graphs: ModelGraph_init_Graphs,
            ModelGraphs_reorganizeRawDataForResultTable: ModelGraphs_reorganizeRawDataForResultTable,
        };

    }
]);