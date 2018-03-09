'use strict';

/* Controllers */
var NeuralActivityApp = angular.module('NeuralActivityApp');

NeuralActivityApp.controller('HomeCtrl', ['$scope', '$rootScope', '$http', '$location', 'Context', 'FileService',

    function($scope, $rootScope, $http, $location, Context, FileService) {

        //variables

        //functions
        $scope.goToFileView = function() {
            var file_name = "File_AlphaOmega_2.map"
            FileService.setService(file_name).then(function() {
                console.log("location changed")
                $location.path("/home/file-view/{file_name:" + file_name + "}");
                $scope.$apply();
            })
        }


        //main code
        Context.setService().then(function() {
            $scope.Context = Context;

        });
    }
]);

NeuralActivityApp.controller('FileViewCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'Context', 'FileService',

    function($scope, $rootScope, $http, $location, $stateParams, Context, FileService) {
        //variables
        $scope.filename;
        $scope.data;

        //function


        //main code
        $scope.$on('data_updated', function() {
            $scope.data = FileService.getData();
            $scope.$apply();
            console.log("data updated", $scope.data)
        });



        Context.setService().then(function() {
            $scope.Context = Context;

            FileService.setService($stateParams.file_name).then(function() {
                $scope.data = FileService.getData();
                $scope.$apply();
                console.log("in fileview ctr data:", $scope.data)
            })
        });

    }
]);
NeuralActivityApp.controller('MenuCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'Context', 'FileService',

    function($scope, $rootScope, $http, $location, $stateParams, Context, FileService) {
        var ctrl = this;
        // var menu_data = FileService.getData();
        $scope.data = undefined;
        $scope.menu_blocks_to_show = [];
        $scope.menu_segments_to_show = [];

        $scope.showBlock = function(block_id) {

            var classe = document.getElementById("arrow-block-" + block_id).className;
            if (classe == "glyphicon glyphicon-menu-down") {
                $scope.menu_blocks_to_show.push(block_id);
                document.getElementById("arrow-block-" + block_id).className = "glyphicon glyphicon-menu-up";
            } else {
                var i = $scope.menu_blocks_to_show.indexOf(block_id);
                if (i == 0) {
                    $scope.menu_blocks_to_show.splice(0, 1);
                } else { $scope.menu_blocks_to_show.splice(i, i); }

                document.getElementById("arrow-block-" + block_id).className = "glyphicon glyphicon-menu-down";
            };
        }

        $scope.showSegment = function(block_id, segment_id) {
            var id = block_id + "-" + segment_id;
            var classe = document.getElementById("arrow-segment-" + id).className;
            if (classe == "glyphicon glyphicon-menu-down") {
                $scope.menu_segments_to_show.push(id);
                document.getElementById("arrow-segment-" + id).className = "glyphicon glyphicon-menu-up";
            } else {
                var i = $scope.menu_segments_to_show.indexOf(id);
                if (i == 0) {
                    $scope.menu_segments_to_show.splice(0, 1);
                } else { $scope.menu_segments_to_show.splice(i, i); }

                document.getElementById("arrow-segment-" + id).className = "glyphicon glyphicon-menu-down";
            };
        }


        $scope.isInArray = function(value, array) {
            return array.indexOf(value) > -1;
        }

        $scope.isInArraySegment = function(value1, value2, array) {
            var value = value1 + "-" + value2;
            console.log(array.indexOf(value) > -1)
            return array.indexOf(value) > -1;
        }

        $scope.$on('data_updated', function() {
            $scope.data = FileService.getData();
            $scope.$apply();
            console.log("data updated in menu", $scope.data)
        });

        Context.setService().then(function() {
            $scope.Context = Context;
            $scope.data = $scope.$parent.data;
            $(function() {
                $scope.showBlock(0);
            });
            console.log("menu ctrl data", $scope.$parent)
        });
    }
]);




NeuralActivityApp.controller('HelpCtrl', ['$scope', '$rootScope', '$http', '$location',

    function($scope, $rootScope, $http, $location) {
        // Context.setService().then(function() {

        //     $scope.Context = Context;

        //     var ctx = Context.getCtx();
        //     var app_id = Context.getAppID();

        //     CollabParameters.setService(ctx).then(function() {});

        // });


    }
]);


//could be usefull later
// NeuralActivityApp.directive('markdown', function() {
//     var converter = new Showdown.converter();
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             function renderMarkdown() {
//                 var htmlText = converter.makeHtml(scope.$eval(attrs.markdown) || '');
//                 element.html(htmlText);
//             }
//             scope.$watch(attrs.markdown, renderMarkdown);
//             renderMarkdown();
//         }
//     };
// });

//Filter multiple //could be usefull later //to put in a service
NeuralActivityApp.filter('filterMultiple', ['$parse', '$filter', function($parse, $filter) {
    return function(items, keyObj) {
        var x = false;
        if (!angular.isArray(items)) {
            return items;
        }
        var filterObj = {
            data: items,
            filteredData: [],
            applyFilter: function(obj, key) {
                var fData = [];
                if (this.filteredData.length == 0 && x == false)
                    this.filteredData = this.data;
                if (obj) {
                    var fObj = {};
                    if (!angular.isArray(obj)) {
                        fObj[key] = obj;
                        fData = fData.concat($filter('filter')(this.filteredData, fObj));
                    } else if (angular.isArray(obj)) {
                        if (obj.length > 0) {
                            for (var i = 0; i < obj.length; i++) {
                                if (angular.isDefined(obj[i])) {
                                    fObj[key] = obj[i];
                                    fData = fData.concat($filter('filter')(this.filteredData, fObj));
                                }
                            }
                        }
                    }
                    if (fData.length > 0) {
                        this.filteredData = fData;
                    }
                    if (fData.length == 0) {
                        if (obj != "" && obj != undefined) {
                            this.filteredData = fData;
                            x = true;
                        }
                    }

                }
            }
        };
        if (keyObj) {
            angular.forEach(keyObj, function(obj, key) {
                filterObj.applyFilter(obj, key);
            });
        }

        return filterObj.filteredData;
    }
}]);