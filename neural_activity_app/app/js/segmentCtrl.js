var NeuralActivityApp = angular.module('NeuralActivityApp');

NeuralActivityApp.controller('SegmentViewCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'Context', 'FileService',

    function($scope, $rootScope, $http, $location, $stateParams, Context, FileService) {

        //variables
        $scope.block_id = $stateParams.block_id;
        $scope.segment_id = $stateParams.segment_id;
        $scope.data_segment = $scope.$parent.data.block[$scope.block_id].segments[$scope.segment_id];
        //functions


        //main code
        $scope.$on('data_updated', function() {
            $scope.data_segment = $scope.$parent.data.block[$scope.block_id].segments[$scope.segment_id];
            $scope.$apply();
            console.log("data updated in detail view", $scope.dat_segment)
        });

        Context.setService().then(function() {
            $scope.Context = Context;
            console.log("is loading SEGMENT view", $stateParams.block_id, $stateParams.segment_id)
            FileService.loadSegment($scope.block_id, $scope.segment_id);
        });
    }
]);