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


.controller('HomeController', function($location, $rootScope, KGResourceCount, bbpOidcSession, $http, nexusBaseUrl) {
    var vm = this;

    var error = function(response) {
        console.log("ERROR: ", response);
    };

    console.log(nexusBaseUrl);

    // controller actions to login and logout
    vm.handleLogin = function() {bbpOidcSession.login();}
    vm.handleLogout = function() {bbpOidcSession.logout();}

    // check that we have a valid token, otherwise log in.
    $http.get("https://services.humanbrainproject.eu/idm/v1/api/user/me",
              {"Authorization": "Bearer " + bbpOidcSession.token()}).then(
        function(response) {
            console.log(response.data.displayName);
        },
        function(err) {
            console.log(err);
            console.log("Logging in");
            bbpOidcSession.login();
        });

    var Experiments = KGResourceCount(nexusBaseUrl + "data/neuralactivity/electrophysiology/stimulusexperiment/v0.1.0/");
    Experiments.count().then(
        function(count) {
            //console.log(count);
            vm.experiment_count = count;
        },
        error
    );

});