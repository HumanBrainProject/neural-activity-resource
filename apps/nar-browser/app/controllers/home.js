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


.controller('HomeController', function($location, $rootScope, KGResourceCount,
                                       $http, bbpOidcSession, NexusURL, clbUser) {
    var vm = this;

    var error = function(response) {
        console.log("ERROR: ", response);
    };

    var nexusBaseUrl = NexusURL.get();
    console.log(nexusBaseUrl);
    // console.log(bbpOidcSession.token());

    // // controller actions to login and logout
    // vm.handleLogin = function() {bbpOidcSession.login();}
    // vm.handleLogout = function() {bbpOidcSession.logout();}

    // // check that we have a valid token, otherwise log in.
    // clbUser.getCurrentUser().then(
    //     function(user) {
    //         console.log(user);
    //     },
    //     function(err) {
    //         console.log(err);
    //         console.log("Logging in");
    //         bbpOidcSession.login();
    //     });

    vm.experiment_count = {};
    //var Experiments = KGResourceCount(nexusBaseUrl + "data/neuralactivity/electrophysiology/stimulusexperiment/v0.1.0/");
    var Experiments = KGResourceCount(nexusBaseUrl + "data/neuralactivity/electrophysiology/stimulusexperiment/");
    var context = {
        "nsg": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/",
        "prov": "http://www.w3.org/ns/prov#",
        "rdf": 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
    };
    Experiments.count({
        "filter": {
            'path': 'prov:used / rdf:type',
            'op': 'eq',
            'value': "nsg:PatchedCell"
        },
        "@context": context
    }).then(
        function(count) {
            //console.log(count);
            vm.experiment_count["patchClamp"] = count;
        },
        error
    );
    Experiments.count({
        "filter": {
            'path': 'prov:used / rdf:type',
            'op': 'eq',
            'value': "nsg:IntraCellularSharpElectrodeRecordedCell"
        },
        "@context": context
    }).then(
        function(count) {
            //console.log(count);
            vm.experiment_count["intraSharp"] = count;
        },
        error
    );

});