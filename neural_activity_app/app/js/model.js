var ApiCommunicationServices = angular.module('ApiCommunicationServices', ['ngResource', 'ngCookies', 'btorfs.multiselect']);

// ApiCommunicationServices.factory('ScientificModelRest', ['$resource',
//     function($resource) {
//         return $resource('models/:uuid', { id: '@eUuid' }, {
//             get: { method: 'GET', params: { format: 'json', app_id: 'app_id', web_app: 'True' }, isArray: false },
//             post: { method: 'POST', params: { format: 'json', app_id: 'app_id', web_app: 'True' }, headers: { 'Content-Type': 'application/json' } },
//             put: { method: 'PUT', params: { format: 'json', app_id: 'app_id', web_app: 'True' }, headers: { 'Content-Type': 'application/json' } }
//         });
//     }
// ]);
