var ApiCommunicationServices = angular.module('ApiCommunicationServices', ['ngResource', 'ngCookies']);

//ApiCommunicationServices.value('baseURL', 'https://localhost:8000/');
ApiCommunicationServices.value('baseURL', 'https://neo-viewer.brainsimulation.eu/');

ApiCommunicationServices.factory('BlockDataRest', ['$resource', 'baseURL',
    function($resource, baseURL) {
        return $resource(baseURL + 'blockdata/', { id: '@eUuid' }, {
            get: { method: 'GET', params: { format: 'json' }, isArray: false },
        })
    }
]);

ApiCommunicationServices.factory('SegmentDataRest', ['$resource', 'baseURL',
    function($resource, baseURL) {
        return $resource(baseURL + 'segmentdata/', { id: '@eUuid' }, {
            get: { method: 'GET', params: { format: 'json' }, isArray: false },
        })
    }
]);

ApiCommunicationServices.factory('AnalogSignalDataRest', ['$resource', 'baseURL',
    function($resource, baseURL) {
        return $resource(baseURL + 'analogsignaldata/', { id: '@eUuid' }, {
            get: { method: 'GET', params: { format: 'json' }, isArray: false },
        })
    }
]);

// ApiCommunicationServices.factory('CollabIDRest', ['$resource',
//     function($resource) {
//         return $resource('collabid/:uuid', { id: '@eUuid' }, {
//             get: { method: 'GET', params: { format: 'json' }, isArray: false },
//         })
//     }
// ]);

// ApiCommunicationServices.factory('AppIDRest', ['$resource',
//     function($resource) {
//         return $resource('appid/:uuid', { id: '@eUuid' }, {
//             get: { method: 'GET', params: { format: 'json' }, isArray: false },
//         })
//     }
// ]);