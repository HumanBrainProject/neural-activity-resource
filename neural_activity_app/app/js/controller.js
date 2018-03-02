'use strict';

/* Controllers */
var NeuralActivityApp = angular.module('NeuralActivityApp');

NeuralActivityApp.controller('HomeCtrl', ['$scope', '$rootScope', '$http', '$location',
    function($scope, $rootScope, $http, $location) {

    }
]);

NeuralActivityApp.controller('FileViewCtrl', ['$scope', '$rootScope', '$http', '$location',
    function($scope, $rootScope, $http, $location) {

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