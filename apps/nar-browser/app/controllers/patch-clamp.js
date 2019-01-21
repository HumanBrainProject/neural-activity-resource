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

.controller('PatchClampListController', function(KGResource, bbpOidcSession, $http, NexusURL) {      
    var vm = this;
    var nexusBaseUrl = NexusURL.get();

    var error = function(response) {
        console.log("ERROR: ", response);
    };

    // // controller actions to login and logout
    // vm.handleLogin = function() {bbpOidcSession.login();}
    // vm.handleLogout = function() {bbpOidcSession.logout();}

    var config = {
        Authorization: "Bearer " + bbpOidcSession.token()
    };

    var Experiments = KGResource(nexusBaseUrl + "data/neuralactivity/electrophysiology/stimulusexperiment/v0.1.0/");
    Experiments.query().then(
        function(experiments) {
            vm.experiments = experiments;
            console.log(experiments[0]);
        },
        error
    );
})


.controller('PatchClampController', function(KGResource, bbpOidcSession, $http, $stateParams, NexusURL, $scope, URLService) {     
    var vm = this;
    var nexusBaseUrl = NexusURL.get();

    var error = function(response) {
        console.log("ERROR: ", response);
    };

    // // controller actions to login and logout
    // vm.handleLogin = function() {bbpOidcSession.login();}
    // vm.handleLogout = function() {bbpOidcSession.logout();}

    //console.log(bbpOidcSession.token());

    // $http.get("https://services.humanbrainproject.eu/idm/v1/api/user/me",
    //           {"Authorization": "Bearer " + bbpOidcSession.token()}).then(
    //     function(response) {
    //         console.log(response.data.displayName);
    //     },
    //     error);

    var config = {
        Authorization: "Bearer " + bbpOidcSession.token()
    };

    var selectExperiment = function(experiment) {
        vm.stimulus_experiment = null;  // trying to blank fields
        vm.patched_cell = null;
        vm.patching_activity = null;
        vm.slice = null;
        vm.slicing_activity = null;
        vm.subject = null;
        vm.traces = [];
        vm.data_files = [];
        build_metadata(experiment);
    };

    vm.validURL = function(url) {
        if (url.startsWith('http')) {
            return true;
        } else {
            return false;
        }
    };

    $scope.openVisualizer = function(url) {
        var element = document.createElement("object");
        element.setAttribute('type', "text/html");
        element.setAttribute('width', "1200px");
        element.setAttribute('height', "500px");
        element.setAttribute('scrolling', "yes");
        element.setAttribute('data', URLService.src.$$state.value + '?url=' + url);
        document.getElementById('visDiv').appendChild(element);
    };

    vm.relativePath = function(url) {
        if (url.startsWith('http')) {
            var link = document.createElement("a");
            link.href = url;
            console.log(url);
            return link.pathname.split('/').slice(3).join("/");
        } else {
            return url;
        }
    };

    var build_metadata = function(stimulus_experiment) {
        var name = stimulus_experiment.get_label();
        vm.stimulus_experiment = stimulus_experiment.data;
        //vm.stimulus_experiment.name = vm.stimulus_experiment['schema:name'];
        vm.stimulus_experiment.name = name;
        //console.log(vm.stimulus_experiment['schema:name']);

        vm.stimulus_experiment.stimulus = {
            name: vm.stimulus_experiment["nsg:stimulus"]["nsg:stimulusType"]["rdfs:label"]
        };

        // get the patched cell
        //console.log(vm.stimulus_experiment["prov:used"][0]["@id"]);
        $http.get(vm.stimulus_experiment["prov:used"]["@id"], config).then(
            function(response) {
                vm.patched_cell = response.data;
                //console.log(vm.patched_cell);

                // get the patched cell collection of which the cell is a part
                var PatchedCellCollection = KGResource(nexusBaseUrl + "data/neuralactivity/experiment/patchedcellcollection/v0.1.0");
                PatchedCellCollection.query(
                    {
                        "@context": {
                            "prov": "http://www.w3.org/ns/prov#",
                        },
                        "filter": {
                            "path": "prov:hadMember",
                            "op": "in",
                            "value": vm.patched_cell["@id"]
                        }
                    }
                ).then(
                    function(patched_cell_collections) {
                        //console.log(patched_cell_collections[0].data);

                        // get the slice in which the cell was patched
                        var PatchedSlices = KGResource(nexusBaseUrl + "data/neuralactivity/experiment/patchedslice/v0.1.0");
                        PatchedSlices.query(
                            {
                                "@context": {
                                    "nsg": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/",
                                },
                                "filter": {
                                    "path": "nsg:hasPart",
                                    "op": "in",
                                    "value": patched_cell_collections[0].data["@id"]
                                }
                            }
                        ).then(
                            function(patched_slices) {
                                //console.log(patched_slices[0].data);
                                vm.patched_slice = patched_slices[0].data;

                                // get patchclamp activity
                                var PatchClampActivities = KGResource(nexusBaseUrl + "data/neuralactivity/experiment/wholecellpatchclamp/v0.1.0");
                                PatchClampActivities.query(
                                    {
                                        "@context": {
                                            "prov": "http://www.w3.org/ns/prov#",
                                        },
                                        "filter": {
                                            "path": "prov:generated",
                                            "op": "in",
                                            "value": vm.patched_slice["@id"]
                                        }
                                    }
                                ).then(
                                    function(patch_clamp_activities) {
                                        vm.patching_activity = patch_clamp_activities[0].data;

                                        // get list of people involved in performing the patch clamp recording
                                        vm.patching_activity.people = [];
                                        for (let person_uri of vm.patching_activity.wasAssociatedWith) {
                                            $http.get(person_uri["@id"]).then(
                                                function(response) {
                                                    vm.patching_activity.people.push(response.data);
                                                    // todo: get affiliations
                                                },
                                                error
                                            );
                                        }
                                        //console.log(vm.patching_activity.people);

                                    },
                                    error
                                );

                                // get the slice that was patched
                                $http.get(vm.patched_slice.wasRevisionOf["@id"]).then(
                                    function(response) {
                                        vm.slice = response.data;

                                        // get the slicing activity
                                        var BrainSlicingActivities = KGResource(nexusBaseUrl + "data/neuralactivity/experiment/brainslicing/v0.1.0");
                                        BrainSlicingActivities.query(
                                            {
                                                "@context": {
                                                    "prov": "http://www.w3.org/ns/prov#",
                                                },
                                                "filter": {
                                                    "path": "prov:generated",
                                                    "op": "in",
                                                    "value": vm.slice["@id"]
                                                }
                                            }
                                        ).then(
                                            function(brain_slicing_activities) {
                                                vm.slicing_activity = brain_slicing_activities[0].data;

                                                // get list of people involved in slicing
                                                vm.slicing_activity.people = [];
                                                for (let person_uri of vm.slicing_activity.wasAssociatedWith) {
                                                    $http.get(person_uri["@id"]).then(
                                                        function(response) {
                                                            vm.slicing_activity.people.push(response.data);
                                                            // todo: get affiliations
                                                        },
                                                        error
                                                    );
                                                }
                                            },
                                            error
                                        );

                                        // get the subject
                                        $http.get(vm.slice.wasDerivedFrom["@id"]).then(
                                            function(response) {
                                                vm.subject = response.data;
                                            },
                                            error
                                        );
                                    },
                                    error
                                );
                            },
                            error
                        );
                    }, 
                    error     
                );
            },
            error);
    
        // get the recorded traces
        var Traces = KGResource(nexusBaseUrl + "data/neuralactivity/electrophysiology/trace/v0.1.0");
        Traces.query(
            {
                "@context": {
                    "prov": "http://www.w3.org/ns/prov#",
                },
                "filter": {
                    "path": "prov:wasGeneratedBy",
                    "op": "eq",
                    "value": vm.stimulus_experiment["@id"]
                }
            }
        ).then(
            function(traces) {
                vm.traces = traces;

                if (traces.length > 0) {
                    console.log(vm.traces[0].data);
                    //console.log(vm.traces[0].data.distribution[0].downloadURL);
                } else {
                    console.log("Found no traces associated with " + vm.stimulus_experiment["@id"]);
                }
                // get a list of the data file(s) containing the traces
                var data_files = new Set();
                for (let trace of vm.traces) {
                    if (Array.isArray(trace.data.distribution)) {
                        data_files.add(trace.data.distribution[0].downloadURL);
                    } else {
                        data_files.add(trace.data.distribution.downloadURL);
                    }
                    $http.get(trace.data.qualifiedGeneration["@id"]).then(
                        function(response) {
                            trace.tracegen = response.data;
                        },
                        error
                    )
                }
                vm.data_files = Array.from(data_files);
                console.log(vm.data_files);
            },
            error
        );
    }

    console.log($stateParams.instanceId);
    var Experiments = KGResource(nexusBaseUrl + "data/neuralactivity/electrophysiology/stimulusexperiment/v0.1.0");
    Experiments.get_by_uuid($stateParams.instanceId).then(
        function(expt) {
            selectExperiment(expt);
        },
        error
    )
})

.component('patchclamplistcomponent', {
    templateUrl: '/app/templates/patch-clamp-list.tpl.html',
    controller: 'PatchClampListController',
    controllerAs: 'app',
})
.component('patchclampcomponent', {
    templateUrl: '/app/templates/patch-clamp.tpl.html',
    controller: 'PatchClampController',
    controllerAs: 'app',
});