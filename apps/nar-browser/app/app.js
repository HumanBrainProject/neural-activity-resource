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

(function() {
  'use strict';

  window.bbpConfig =  {
      api: {
          user: {
              v0: "https://services.humanbrainproject.eu/oidc/v0/api",
              v1: "https://services.humanbrainproject.eu/idm/v1/api"
          }
      },
      auth: {
          url: "https://services.humanbrainproject.eu/oidc",
          clientId: "395947a2-16b5-4e04-9180-93088459a7f2"
      },
      oidc: {
        debug: false
      }
  }

  angular.module('nar', [
    'bbpOidcClient',
    'ui.router',
    'ngMaterial',
    'ngSanitize',
    'clb-identity',
    'neo-visualizer'
  ])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: '/app/templates/home.tpl.html',
        controller: 'HomeController as app'
      })
      .state('patch-clamp-list', {
        url: '/patch-clamp',
        component: 'patchclamplistcomponent'
      })
      .state('patch-clamp-instance', {
        url: '/patch-clamp/{instanceId}',
        component: 'patchclampcomponent'
      })
      .state('sharp-electrode-list', {
        url: '/sharp-electrode',
        component: 'sharpelectrodelistcomponent'
      })
      .state('sharp-electrode-instance', {
        url: '/sharp-electrode/{instanceId}',
        component: 'sharpelectrodecomponent'
      })
      .state('mea', {
        url: '/mea',
        templateUrl: '/app/templates/mea.tpl.html',
        controller: 'MEAController as app'
      })
      .state('two-photon', {
        url: '/two-photon',
        templateUrl: '/app/templates/two-photon.tpl.html',
        controller: 'TwoPhotonController as app'
      })
      .state('EEG', {
        url: '/eeg',
        templateUrl: '/app/templates/eeg.tpl.html',
        controller: 'EEGController as app'
      })
      .state('MEG-list', {
        url: '/meg',
        component: 'meglistcomponent'
      })
      .state('meg-instance', {
        url: '/meg/{instanceId}',
        component: 'megcomponent'
      })
      .state('fMRI', {
        url: '/fMRI',
        templateUrl: '/app/templates/fMRI.tpl.html',
        controller: 'FMRIController as app'
      })
      .state('datasets', {
        url: '/datasets',
        templateUrl: '/app/templates/datasets.tpl.html',
        controller: 'DatasetController as app'
      })
    $urlRouterProvider.otherwise("/");
  })
  .config(function(bbpOidcSessionProvider) {
    // set to true if missing token should automatically redirect to login page.
    bbpOidcSessionProvider.alwaysPromptLogin(true)
    // set to true if the app should ensure a valid token is present before displaying the page.
    bbpOidcSessionProvider.ensureToken(true)
  })
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('teal')
      .accentPalette('orange');
  })
})();