var NeuralActivityApp = angular.module('NeuralActivityApp');

NeuralActivityApp.controller('SegmentViewCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'FileService',

    function($scope, $rootScope, $http, $location, $stateParams, FileService) {

        //variables
        // $scope.block_id = $stateParams.block_id;
        $scope.segment_id = $stateParams.segment_id;

        //functions


        //main code
        $scope.$on('data_updated', function() {
            $scope.data_segment = $scope.$parent.data.block[0].segments[$scope.segment_id];
            $scope.$apply();
        });

        FileService.setService($stateParams.file_name).then(function() {
            $scope.data = FileService.getData();
            FileService.loadSegment($scope.segment_id);
            $scope.$apply();
            $scope.data_segment = $scope.$parent.data.block[0].segments[$scope.segment_id];
        });

    }
]);