/*

Copyright 2018, 2019 CNRS

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


.controller('TopBarController', function($state, bbpOidcSession, clbUser, NexusURL, KGScope) {
    var vm = this;
    vm.showIntegration = false;
    vm.canAccessIntegration = false;
    vm.showUnreleased = false;
    vm.canAccessUnreleased = false;

    clbUser.isGroupMember("nexus-neuralactivity").then(
        function(response) {
            vm.canAccessIntegration = response;
            vm.canAccessUnreleased = response;
        },
        function(err) {
            bbpOidcSession.login();
        });

    vm.switch = function() {
        if (vm.showIntegration) {
            NexusURL.set('https://nexus-int.humanbrainproject.org/v0/');
        } else {
            NexusURL.set('https://nexus.humanbrainproject.org/v0/');
        };
        if (vm.showUnreleased) {
            KGScope.set("INFERRED");
        } else {
            kKScope.set("RELEASED");
        };
        $state.reload();
        console.log("switching");
    }
});