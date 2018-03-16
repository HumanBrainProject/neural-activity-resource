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
              v0: "https://services.humanbrainproject.eu/oidc/v0/api"
          }
      },
      auth: {
          url: "https://services.humanbrainproject.eu/oidc",
          clientId: "395947a2-16b5-4e04-9180-93088459a7f2"
      }
  }

  angular.module('nar', [
    'bbpOidcClient',
    //'ui.router',
    'ngMaterial'
  ])
  //.config(function($urlRouterProvider) {
  //  $urlRouterProvider.otherwise("/");
  //})
  .config(function(bbpOidcSessionProvider) {
    // set to true if missing token should automatically redirect to login page.
    bbpOidcSessionProvider.alwaysPromptLogin(true)
    // set to true if the app should ensure a valid token is present before displaying the page.
    bbpOidcSessionProvider.ensureToken(true)
  })
})();