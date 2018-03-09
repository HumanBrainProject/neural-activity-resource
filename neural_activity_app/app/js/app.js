// Bootstrap function 

// (function() {

window.base_url = 'https://127.0.0.1:8000/';

window.ver_api = '/api/v2/';

angular.bootstrap().invoke(function($http, $log, $location) {

    $http.get('/config.json').then(function(res) {
        window.bbpConfig = res.data;

        angular.element(document).ready(function() {
            angular.bootstrap(document.getElementById("neural-activity-app"), ['NeuralActivityApp']);

            setTimeout(function() {

            }, 1000);

            $log.info('Booted nmpi application');
        });

    }, function() {
        $log.error('Cannot boot nmpi application');
        // window.location.href = '/login/hbp/?next=' + encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
    });
});


var NeuralActivityApp = angular.module('NeuralActivityApp', [
    'ui.router',
    'ng',
    'ngResource',
    'ContextServices',
    'ApiCommunicationServices',
    'FileServices',
    // 'DataHandlerServices',
    // 'GraphicsServices',
    'ngCookies',
    'nvd3',
    'ngTextTruncate',
    // 'HelpServices', //will have to add it later

    'clb-ui-error',
    'clb-env',
    'clb-app',
    'hbpCollaboratory',
]);

NeuralActivityApp.config(
    function($cookiesProvider, $httpProvider, $stateProvider, $locationProvider, $rootScopeProvider, $resourceProvider, $urlRouterProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/static/templates/home.tpl.html',
                controller: 'HomeCtrl'
            })
            .state('help', {
                url: '/help',
                templateUrl: '/static/templates/help.tpl.html',
                controller: 'HelpCtrl'
            })
            .state('file_view', {
                url: '/home/file-view/:file_name',
                templateUrl: '/static/templates/file-view.tpl.html',
                controller: 'FileViewCtrl'
            })
            .state('file_view.block', {
                parent: 'file_view',
                url: '/home/file-view/block/{block_id:[0-9]{1,8}}',
                views: {
                    'detail@file_view': {
                        templateUrl: '/static/templates/block-view.tpl.html',
                        controller: 'BlockViewCtrl'
                    }
                }
            })
            .state('file_view.segment', {
                parent: 'file_view',
                url: '/home/file-view/segment/{block_id:[0-9]{1,8}}?{segment_id:[0-9]{1,8}}',
                views: {
                    'detail': {
                        templateUrl: '/static/templates/segment-view.tpl.html',
                        controller: 'SegmentViewCtrl'
                    }
                }
            })
            .state('file_view.analog_signal', {
                parent: 'file_view',
                url: '/home/file-view/analog_signal/{block_id:[0-9]{1,8}}?{segment_id:[0-9]{1,8}}?{analog_signal_id:[0-9]{1,8}}',
                views: {
                    'detail': {
                        templateUrl: '/static/templates/analog-signal-view.tpl.html',
                        controller: 'AnalogSignalViewCtrl'
                    }
                }
            })
            // .state('file_view', {
            //     url: '/home/file-view',
            //     views: {
            //         'menu': {
            //             templateUrl: '/static/navbar/navbar.tpl.html',
            //             controller: 'NavBarCtrl'
            //         },
            //         'detail_view': {
            //             templateUrl: '/static/templates/file-view.tpl.html',
            //             controller: 'FileViewCtrl'
            //         }
            //     }
            // })

        // .state('menu_bar', {
        //     parent: 'file_view',
        //     views: {
        //         'menu': {
        //             templateUrl: '/static/navbar/navbar.tpl.html',
        //             controller: 'NavBarCtrl'
        //         },
        //         'detail@file_view': {

        //         }
        //     }
        // })



        $urlRouterProvider.otherwise('/home');

    });
// });