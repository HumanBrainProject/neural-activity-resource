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
ApiCommunicationServices.factory('BlockDataRest', ['$resource',
    function($resource) {
        return $resource('blockdata/', { id: '@eUuid' }, {
            get: { method: 'GET', params: { format: 'json' }, isArray: false },
        })
    }
]);

ApiCommunicationServices.factory('SegmentDataRest', ['$resource',
    function($resource) {
        return $resource('segmentdata/', { id: '@eUuid' }, {
            get: { method: 'GET', params: { format: 'json' }, isArray: false },
        })
    }
]);

ApiCommunicationServices.factory('AnalogSignalDataRest', ['$resource',
    function($resource) {
        return $resource('analogsignaldata/', { id: '@eUuid' }, {
            get: { method: 'GET', params: { format: 'json' }, isArray: false },
        })
    }
]);

ApiCommunicationServices.factory('CollabIDRest', ['$resource',
    function($resource) {
        return $resource('collabid/:uuid', { id: '@eUuid' }, {
            get: { method: 'GET', params: { format: 'json' }, isArray: false },
        })
    }
]);

ApiCommunicationServices.factory('AppIDRest', ['$resource',
    function($resource) {
        return $resource('appid/:uuid', { id: '@eUuid' }, {
            get: { method: 'GET', params: { format: 'json' }, isArray: false },
        })
    }
]);