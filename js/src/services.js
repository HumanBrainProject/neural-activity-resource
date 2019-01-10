

angular.module('neo-visualizer')

.value('baseURL', 'https://neo-viewer.brainsimulation.eu/')

.factory('BlockData', ['$resource', 'baseURL',
    function($resource, baseURL) {
        return $resource(baseURL + 'blockdata/', { id: '@eUuid' }, {
            get: { method: 'GET', params: { format: 'json' }, isArray: false },
        })
    }
])

.factory('SegmentData', ['$resource', 'baseURL',
    function($resource, baseURL) {
        return $resource(baseURL + 'segmentdata/', { id: '@eUuid' }, {
            get: { method: 'GET', params: { format: 'json' }, isArray: false },
        })
    }
])

.factory('AnalogSignalData', ['$resource', 'baseURL',
    function($resource, baseURL) {
        return $resource(baseURL + 'analogsignaldata/', { id: '@eUuid' }, {
            get: { method: 'GET', params: { format: 'json' }, isArray: false },
        })
    }
])