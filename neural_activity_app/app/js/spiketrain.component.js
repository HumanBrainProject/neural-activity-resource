angular.module('Visualizer').
directive("spiketrainView", ['FileService', '$stateParams', 'Graphics', function(FileService, $stateParams, Graphics) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        templateUrl: '/static/templates/spiketrain-view.tpl.html',
        link: function($scope, $http, $location, $element, $attrs) {
            //variables
            $scope.segment_id = $stateParams.segment_id;
            $scope.spiketrain_id = $stateParams.spiketrain_id;
            //functions


            //main code
            $scope.$on('data_updated', function() {
                $scope.spiketrains = $scope.$parent.data.block[0].segments[$scope.segment_id].spiketrains;
                $scope.$apply();
            });

            FileService.setService($stateParams.file_name).then(function() {
                FileService.loadSegment($scope.segment_id).then(function() {
                    FileService.loadSpiketrain($scope.segment_id, $scope.spiketrain_id).then(function(spiketrain) {
                        $scope.spiketrain = spiketrain;
                        Graphics.initGraph(spiketrain).then(function(graph_data) {
                            $scope.data_spiketrain = $scope.$parent.data.block[0].segments[$scope.segment_id].spiketrains;
                            $scope.graph_data = graph_data;
                            $scope.options = Graphics.getOptions("View of spiketrain", "", "", graph_data.values, $scope.spiketrain)
                            $scope.$apply();
                        });
                    })
                })
            });
        }
    }

}]);