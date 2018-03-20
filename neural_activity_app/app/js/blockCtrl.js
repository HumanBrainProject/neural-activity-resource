var NeuralActivityApp = angular.module('NeuralActivityApp');

NeuralActivityApp.controller('BlockViewCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'FileService',

    function($scope, $rootScope, $http, $location, $stateParams, FileService) {


        //variables
        $scope.block_id = $stateParams.block_id;
        $scope.data_block = $scope.$parent.data.block[$scope.block_id];
        //functions


        //main code
        $scope.$on('data_updated', function() {
            $scope.data_block = $scope.$parent.data.block[$scope.block_id];
            $scope.$apply();
            console.log("data updated in detail view", $scope.data_block)
        });

        console.log("is loading BLOCK view", $stateParams.block_id)
            // FileService.loadBlock($scope.block_id);


    }
]);