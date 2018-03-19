var NeuralActivityApp = angular.module('NeuralActivityApp');

NeuralActivityApp.controller('AnalogSignalViewCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'FileService',

    function($scope, $rootScope, $http, $location, $stateParams, FileService) {

        //variables
        $scope.block_id = $stateParams.block_id;
        $scope.segment_id = $stateParams.segment_id;
        $scope.analog_signal_id = $stateParams.analog_signal_id;
        $scope.data_signal = $scope.$parent.data.block[$scope.block_id].segments[$scope.segment_id].analogsignals;
        //functions


        //main code
        $scope.$on('data_updated', function() {
            $scope.data_signal = $scope.$parent.data.block[$scope.block_id].segments[$scope.segment_id].analogsignals;
            $scope.$apply();
        });

        FileService.loadAnalogSignal($scope.block_id, $scope.segment_id, $scope.analog_signal_id);

    }
]);