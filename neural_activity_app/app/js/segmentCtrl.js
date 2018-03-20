var NeuralActivityApp = angular.module('NeuralActivityApp');

NeuralActivityApp.controller('SegmentViewCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'FileService',

    function($scope, $rootScope, $http, $location, $stateParams, FileService) {

        //variables
        // $scope.block_id = $stateParams.block_id;
        $scope.segment_id = $stateParams.segment_id;
        $scope.data_segment = $scope.$parent.data.block[0].segments[$scope.segment_id];
        //functions


        //main code
        $scope.$on('data_updated', function() {
            $scope.data_segment = $scope.$parent.data.block[0].segments[$scope.segment_id];
            $scope.$apply();
            console.log("data updated in detail view", $scope.data_segment)
        });

        console.log("is loading SEGMENT view", $stateParams.segment_id)
        FileService.loadSegment($scope.segment_id);
    }
]);