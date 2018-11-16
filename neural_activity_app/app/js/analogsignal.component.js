angular.module('Visualizer').
directive("analogsignalView", ['FileService', '$stateParams', 'Graphics', function(FileService, $stateParams, Graphics) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        templateUrl: '/static/templates/analog-signal-view.tpl.html',
        link: function($scope, $http, $location, $element, $attrs) {
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
    }

}]);