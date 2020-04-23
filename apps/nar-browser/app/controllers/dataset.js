/*

Copyright 2019 CNRS

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


.controller('DatasetController', function($location, $rootScope, KGResource, KGQResource,
                                           bbpOidcSession, $http, NexusURL, PathHandler) {
    var vm = this;

    var nexusBaseUrl = NexusURL.get();
    var kgQueryBaseUrl = "https://kg.humanbrainproject.eu/query/"
    var Datasets = KGQResource(kgQueryBaseUrl + "minds/core/dataset/v1.0.0/narBrowser");

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
        },
        "Creative Commons Attribution-NonCommercial 4.0 International": {
            icon: "https://i.creativecommons.org/l/by-nc/4.0/88x31.png",
            link: "https://creativecommons.org/licenses/by-nc/4.0/"
        },
        "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International": {
            icon: "https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png",
            link: "https://creativecommons.org/licenses/by-nc-nd/4.0/"
        },
        "Creative Commons Attribution 4.0 International": {
            icon: "https://i.creativecommons.org/l/by/4.0/88x31.png",
            link: "https://creativecommons.org/licenses/by/4.0/"
        }
    }

    Datasets.query().then(
        function(datasets) {
            for (let dataset of datasets) {
                //console.log(dataset);
                if (dataset.license) {
                    var license_name = dataset.license[0];  // assume only  one license
                    dataset.license = license_map[license_name] || {};
                    dataset.license.name = license_name;
                };
                if (dataset.description) {
                    dataset.hasLongDescription = (dataset.description.length > 500);
                } else {
                    dataset.hasLongDescription = false;
                }
                if (dataset.wasGeneratedBy) {
                    for (let expt of dataset.wasGeneratedBy) {
                        expt.path_info = PathHandler.extract_path_from_uri(expt["@id"]);
                        expt.uuid = expt.path_info.uuid;
                        if (!expt.name) {
                            expt.name = "Experiment #" + expt.uuid;
                        }
                        // to do: also extract type (patch or sharp)
                    }
                }
                vm.collapseDescription(dataset);
                vm.expandData(dataset);
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
        dataset.dataExpanded = true;
    }
    vm.collapseData = function(dataset) {
        dataset.dataExpanded = false;
    }

});