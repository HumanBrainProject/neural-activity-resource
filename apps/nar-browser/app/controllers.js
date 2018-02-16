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

//.controller('DefaultController', function($location, $rootScope, bbpOidcSession, $http) {
.controller('DefaultController', function($location, $rootScope, KGResource, $http) {
    var vm = this;
    var base_url = "https://nexus-int.humanbrainproject.org/v0/";

    vm.hello = "World"; 

    var error = function(response) {
        console.log("ERROR: ", response);
    };


    console.log("LOCATION: " + $location.url());

    // controller actions to login and logout
    //vm.handleLogin = function() {bbpOidcSession.login();}
    //vm.handleLogout = function() {bbpOidcSession.logout();}

    //console.log(bbpOidcSession.token());

    // $http.get("https://services.humanbrainproject.eu/idm/v1/api/user/me",
    //           {"Authorization": "Bearer " + bbpOidcSession.token()}).then(
    //     function(response) {
    //         console.log(response.data.displayName);
    //     },
    //     error);

    var config = {
        //Authorization: "Bearer " + bbpOidcSession.token()
    };

    // get the stimulus experiment
    $http.get('https://nexus-int.humanbrainproject.org/v0/data/bbp/electrophysiology/stimulusexperiment/v0.1.0/7ccced68-37a7-4fb6-8180-53e9ea985753', config).then(
        function(response) {
            vm.stimulus_experiment = response.data;
            vm.stimulus_experiment.name = vm.stimulus_experiment['schema:name'];
            //console.log(vm.stimulus_experiment['schema:name']);

            vm.stimulus_experiment.stimulus = {
                name: vm.stimulus_experiment["nsg:stimulus"]["nsg:stimulusType"]["rdfs:label"]
            };

            // get the patched cell
            //console.log(vm.stimulus_experiment["prov:used"][0]["@id"]);
            $http.get(vm.stimulus_experiment["prov:used"][0]["@id"], config).then(
                function(response) {
                    vm.patched_cell = response.data;
                    //console.log(vm.patched_cell);

                    // get the patched cell collection of which the cell is a part
                    var PatchedCellCollection = KGResource(base_url + "data/bbp/experiment/patchedcellcollection/v0.1.0");
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
                            var PatchedSlices = KGResource(base_url + "data/bbp/experiment/patchedslice/v0.1.0");
                            PatchedSlices.query(
                                {
                                    "@context": {
                                        "dcterms": "http://purl.org/dc/terms/",
                                    },
                                    "filter": {
                                        "path": "dcterms:hasPart",
                                        "op": "in",
                                        "value": patched_cell_collections[0].data["@id"]
                                    }
                                }
                            ).then(
                                function(patched_slices) {
                                    //console.log(patched_slices[0].data);
                                    vm.patched_slice = patched_slices[0].data;

                                    // get patchclamp activity
                                    var PatchClampActivities = KGResource(base_url + "data/bbp/experiment/wholecellpatchclamp/v0.1.0");
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
                                            var BrainSlicingActivities = KGResource(base_url + "data/bbp/experiment/brainslicing/v0.1.0");
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
            var Traces = KGResource(base_url + "data/bbp/electrophysiology/trace/v0.1.0");
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

                    // todo: get a list of the data file(s) containing the traces
                },
                error
            );
        },
        error);

});