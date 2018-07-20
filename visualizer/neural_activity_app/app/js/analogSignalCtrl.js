var NeuralActivityApp = angular.module('NeuralActivityApp');

NeuralActivityApp.controller('AnalogSignalViewCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'FileService', 'Graphics',

    function($scope, $rootScope, $http, $location, $stateParams, FileService, Graphics) {


        //variables
        $scope.segment_id = $stateParams.segment_id;
        $scope.analog_signal_id = $stateParams.analog_signal_id;

        //functions


        //main code
        $scope.$on('data_updated', function() {
            $scope.data_signal = $scope.$parent.data.block[0].segments[$scope.segment_id].analogsignals;
            $scope.$apply();
        });

        FileService.setService($stateParams.file_name).then(function() {
            FileService.loadSegment($scope.segment_id).then(function() {
                FileService.loadAnalogSignal($scope.segment_id, $scope.analog_signal_id).then(function(signal) {
                    $scope.signal = signal;
                    Graphics.initGraph(signal).then(function(graph_data) {
                        $scope.data_signal = $scope.$parent.data.block[0].segments[$scope.segment_id].analogsignals;
                        $scope.graph_data = graph_data;
                        $scope.options = Graphics.getOptions("View of analogsignal", "", "", graph_data.values, $scope.signal)
                        $scope.$apply();
                    });
                })
            })
        });
    }
]);