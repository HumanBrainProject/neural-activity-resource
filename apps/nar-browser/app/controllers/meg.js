/*

Copyright 2020 CNRS

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


.controller('MEGListController', function($location, $rootScope, KGResource, bbpOidcSession, $http, NexusURL) {
    var vm = this;
    var nexusBaseUrl = NexusURL.get();

    var error = function(response) {
        console.log("ERROR: ", response);
    };

    var config = {
        Authorization: "Bearer " + bbpOidcSession.token()
    };

    var Experiments = KGResource(nexusBaseUrl + "data/neuralactivity/electrophysiology/megexperiment/v0.1.0/");

    Experiments.query().then(
        function(experiments) {
            vm.experiments = experiments;
            console.log(experiments[0]);
        },
        error
    );

})

.controller('MEGController', function(KGResource, bbpOidcSession, $http, $stateParams, NexusURL) {
    var vm = this;
    var nexusBaseUrl = NexusURL.get();

    var error = function(response) {
        console.log("ERROR: ", response);
    };

    var config = {
        Authorization: "Bearer " + bbpOidcSession.token()
    };

    var selectExperiment = function(experiment) {
        vm.experiment = null;  // trying to blank fields
        vm.device = null;
    	vm.task = null;
    	vm.sensors = null;
        vm.digitized_head_points_coordinates = null;
    	vm.head_localization_coils_coordinates = null;
        vm.people = [];
        vm.protocol = null;
        vm.subject = null;
        vm.traces = [];
        vm.data_files = [];
        build_metadata(experiment);
    };

    vm.asList = function(obj) {
        if (Array.isArray(obj)) {
            return obj;
        } else {
            return [obj];
        }
    };

    var build_metadata = function(experiment) {
        var name = experiment.get_label();
        vm.experiment = experiment.data;
        console.log(vm.experiment);
        //vm.stimulus_experiment.name = vm.stimulus_experiment['schema:name'];
        vm.experiment.name = name;
        //console.log(vm.stimulus_experiment['schema:name']);

        vm.experiment.stimulus = {
            //name: vm.stimulus_experiment["nsg:stimulus"]["nsg:stimulusType"]["rdfs:label"]
        };

        $http.get(vm.experiment["prov:used"]["@id"], config).then(
            function(response) {
                vm.device = response.data;
                console.log(vm.device);
                // Field("placement_activity", ("electrophysiology.ElectrodePlacementActivity", "electrophysiology.ElectrodeImplantationActivity"), "^prov:generated", reverse="device"),
            }, error
        );

        $http.get(vm.experiment.sensors["@id"], config).then(
            function(response) {
                vm.sensors = response.data;
                console.log(vm.sensors);
                // Field("placement_activity", ("electrophysiology.ElectrodePlacementActivity", "electrophysiology.ElectrodeImplantationActivity"), "^prov:generated", reverse="device"),
            }, error
        );

        $http.get(vm.experiment.wasAssociatedWith["@id"], config).then(
            function(response) {
                vm.people = vm.asList(response.data);
                console.log(vm.people);
            }, error
        );

        var Tasks = KGResource(nexusBaseUrl + "data/neuralactivity/electrophysiology/task/v0.1.0");
        Tasks.query({
            "@context": {
                "prov": "http://www.w3.org/ns/prov#",
            },
            "filter": {
                "path": "prov:wasInformedBy",
                "op": "in",
                "value": vm.experiment["@id"]
            }
        }).then(
            function(task) {
                vm.task = task.data;
                console.log(vm.task);
                // Field("name", basestring, "name", required=True),
                // Field("description", basestring, "description", required=True),
                // Field("experiment", "electrophysiology.MEGExperiment", "wasInformedBy"),
                // Field("cogatlasid", Distribution, "distribution"),
                // Field("cogpoid", Distribution, "distribution")
            },
            error
        );

        // Field("digitized_head_points_coordinates", MEGObject, "digitizedHeadPointsCoordinates"),
    	// Field("head_localization_coils_coordinates", MEGObject, "headLocalizationCoilsCoordinates"),
        // Field("protocol", Protocol, "hadProtocol")
        var MultiTraces = KGResource(nexusBaseUrl + "data/neuralactivity/electrophysiology/multitrace");
        MultiTraces.query(
            {
                "@context": {
                    "prov": "http://www.w3.org/ns/prov#",
                },
                "filter": {
                    "path": "prov:wasGeneratedBy",
                    "op": "eq",
                    "value": vm.experiment["@id"]
                }
            }
        ).then(
            function(multitraces) {
                vm.multitraces = multitraces;

                if (multitraces.length > 0) {
                    console.log(vm.multitraces[0].data);
                    //console.log(vm.traces[0].data.distribution[0].downloadURL);
                    var minds_dataset_id = vm.multitraces[0].data.partOf["@id"];
                    $http.get(minds_dataset_id).then(
                        function(response) {
                            vm.minds_dataset = response.data;
                        },
                        error
                    );
                } else {
                    console.log("Found no multitraces associated with " + vm.stimulus_experiment["@id"]);
                }

                // get a list of the data file(s) containing the traces
                var data_files = new Set();

                for (let trace of vm.multitraces) {
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

        // Field("channel_names", basestring, "channelName", required=True, multiple=True),
        // Field("data_unit", basestring, "dataUnit", required=True,
        //       multiple=True),  # add type for units, to allow checking?
        // Field("time_step", QuantitativeValue, "timeStep", required=True),
        // Field("channel_type", ChannelType, "ChannelType"),
        // Field("sweeps", int, "sweep", multiple=True, required=True),
        // Field("channel_type", basestring, "channelType"),
        // Field("holding_potential", QuantitativeValue, "targetHoldingPotential"),
    	// Field("sampling_frequency", QuantitativeValue, "samplingFrequency"),
    	// Field("power_line_frequency", QuantitativeValue, "powerLineFrequency")

    }

    console.log($stateParams.instanceId);
    var Experiments = KGResource(nexusBaseUrl + "data/neuralactivity/electrophysiology/megexperiment/v0.1.0");
    Experiments.get_by_uuid($stateParams.instanceId).then(
        function(expt) {
            selectExperiment(expt);
        },
        error
    )

})

.component('meglistcomponent', {
    templateUrl: '/app/templates/meg-list.tpl.html',
    controller: 'MEGListController',
    controllerAs: 'app',
})
.component('megcomponent', {
    templateUrl: '/app/templates/meg.tpl.html',
    controller: 'MEGController',
    controllerAs: 'app',
});