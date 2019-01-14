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
                                          bbpOidcSession, $http, NexusURL) {
    var vm = this;

    var nexusBaseUrl = NexusURL.get();
    var Datasets = KGResource(nexusBaseUrl + "data/minds/core/dataset/v1.0.0");
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
                for (let trace of traces) {
                    Experiments.get(trace.data.wasGeneratedBy["@id"]).then(
                        // todo: add caching to KGResource
                        function(expt) {
                            trace.experiment = expt;
                            trace.method = expt.data["prov:used"]["@type"];
                            if (trace.method.includes("nsg:PatchedCell")) {
                                dataset.patch_electrode_traces.push(trace);
                            } else {
                                dataset.sharp_electrode_traces.push(trace);
                            }
                        },
                        error
                    );
                }
                dataset.dataLoaded = true;
            },
            error
        );
    };

    Datasets.query(
        {
            "@context": {
                "schema": "http://schema.org/",
                "minds": "https://schema.hbp.eu/"
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
                if (dataset.data["https://schema.hbp.eu/license"]) {
                    if (dataset.data["https://schema.hbp.eu/license"]["@id"].startsWith("http")) {
                        $http.get(dataset.data["https://schema.hbp.eu/license"]["@id"]).then(
                            function(response) {
                                var license_name = response.data["http://schema.org/name"];
                                dataset.license = license_map[license_name];
                                dataset.license.name = license_name;
                            },
                            error
                        );
                    }
                };
                if (dataset.data["https://schema.hbp.eu/owners"]) {
                    if (Array.isArray(dataset.data["https://schema.hbp.eu/owners"])) {
                        dataset.custodians = [];
                        for (let owner of dataset.data["https://schema.hbp.eu/owners"]) {
                            $http.get(owner["@id"]).then(
                                function(response) {
                                    dataset.custodians.push(response.data["http://schema.org/name"]);
                                },
                                error
                            );
                        }
                    } else if (dataset.data["https://schema.hbp.eu/owners"].hasOwnProperty("@list")) {
                        dataset.custodians = [];
                        for (let owner of dataset.data["https://schema.hbp.eu/owners"]["@list"]) {
                            $http.get(owner["@id"]).then(
                                function(response) {
                                    dataset.custodians.push(response.data["http://schema.org/name"]);
                                },
                                error
                            );
                        }
                    } else {
                        $http.get(dataset.data["https://schema.hbp.eu/owners"]["@id"]).then(
                            function(response) {
                                dataset.custodians = response.data["http://schema.org/name"];
                            },
                            error
                        );
                    }   
                }
                dataset.patch_electrode_traces = [];
                dataset.sharp_electrode_traces = [];
                dataset.dataLoaded = false;
                if (dataset.data["http://schema.org/description"]) {
                    dataset.hasLongDescription = (dataset.data["http://schema.org/description"].length > 500);
                } else {
                    dataset.hasLongDescription = false;
                }
                vm.collapseDescription(dataset);
            }
            vm.datasets = datasets;
            console.log(datasets);
        },
        error
    ).catch(console.error);

    vm.expandDescription = function(dataset) {
        dataset.descriptionLimit = undefined;
    }
    vm.collapseDescription = function(dataset) {
        dataset.descriptionLimit = 500;
    }
    vm.expandData = function(dataset) {
        if (!dataset.dataLoaded) {
            getTraces(dataset);
        }
        dataset.dataExpanded = true;
    }
    vm.collapseData = function(dataset) {
        dataset.dataExpanded = false;
    }

});