var NeuralActivityApp = angular.module('NeuralActivityApp');

NeuralActivityApp.controller('BlockViewCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'FileService',

    function($scope, $rootScope, $http, $location, $stateParams, FileService) {


        //variables
        // $scope.block_id = $stateParams.block_id;

        //functions


        //main code
        $scope.$on('data_updated', function() {
            $scope.data_block = $scope.$parent.data.block[0];
            $scope.$apply();
        });
        // FileService.loadBlock($scope.block_id);

        FileService.setService($stateParams.file_name).then(function() {
            $scope.data = FileService.getData();
            $scope.$apply();
            $scope.data_block = $scope.$parent.data.block[0];
        });
    }
]);