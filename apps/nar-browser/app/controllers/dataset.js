/*

Copyright 2018 CNRS

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

Author: Andrew P. Davison, UNIC, CNRS

*/


'use strict';

angular.module('nar')


.controller('DatasetController', function($location, $rootScope, KGResource, 
                                          bbpOidcSession, $http, nexusBaseUrl) {
    var vm = this;
    var Datasets = KGResource(nexusBaseUrl + "data/minds/core/dataset/v0.0.4");
    var Traces = KGResource(nexusBaseUrl + "data/neuralactivity/electrophysiology/trace/v0.1.0");
    var Experiments = KGResource(nexusBaseUrl + "data/neuralactivity/electrophysiology/stimulusexperiment/v0.1.0");

    var error = function(response) {
        console.log("ERROR: ", response);
    };

    var config = {
        Authorization: "Bearer " + bbpOidcSession.token()
    };
    
    var license_map = {
        "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International": {
            icon: "https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png",
            link: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
        }
    }

    var getTraces = function(dataset) {
        var traces = Traces.query({
            "@context": {
                "nsg": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/"
            },
            "filter": {
                "path": "nsg:partOf",
                "op": "eq",
                "value": dataset.id
            }
        }).then(
            function(traces) {
                //console.log(traces);
                for (let trace of traces) {
                    Experiments.get(trace.data.wasGeneratedBy["@id"]).then(
                        // todo: add caching to KGResource
                        function(expt) {
                            trace.experiment = expt;
                        },
                        error
                    );
                }
                dataset.traces = traces;
            },
            error
        );
    };

    vm.hello = function() {
        return "Hello";
    }

    Datasets.query(
        {
            "@context": {
                "schema": "http://schema.org/",
                "minds": "http://hbp.eu/minds#"
            },
            "filter": {
                "path": "minds:specimen_group / minds:subjects / minds:samples / minds:methods / schema:name",
                "op": "in",
                "value": ["Electrophysiology recording",
                          "Voltage clamp recording",
                          "Single electrode recording",
                          "functional magnetic resonance imaging"]
            }
        }
    ).then(
        function(datasets) {
            for (let dataset of datasets) {
                dataset.traces = [];
                getTraces(dataset);
                $http.get(dataset.data["http://hbp.eu/minds#license"]["@id"]).then(
                    function(response) {
                        var license_name = response.data["http://schema.org/name"];
                        dataset.license = license_map[license_name];
                        dataset.license.name = license_name;
                    },
                    error
                );
            }
            vm.datasets = datasets;
            console.log(datasets);
        },
        error
    );

});