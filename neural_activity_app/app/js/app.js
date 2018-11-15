// Bootstrap function 

// (function() {

window.base_url = 'https://127.0.0.1:8000/';

window.ver_api = '/api/v2/';

angular.bootstrap().invoke(function($http, $log, $location) {

    // $http.get('/config.json').then(function(res) {
    //     window.bbpConfig = res.data;

    angular.element(document).ready(function() {
        angular.bootstrap(document.getElementById("neural-activity-app"), ['NeuralActivityApp']);

        setTimeout(function() {

        }, 1000);

        $log.info('Booted nmpi application');
    });

    // }, function() {
    //     $log.error('Cannot boot nmpi application');
    //     // window.location.href = '/login/hbp/?next=' + encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
    // });
});


var NeuralActivityApp = angular.module('NeuralActivityApp', [
    'Visualizer',
    'ui.router',
    'ng',
    'ngResource',
    'ApiCommunicationServices',
    'FileServices',

    'GraphicsServices',
    'ngCookies',
    'nvd3',
    'ngTextTruncate',
]);

NeuralActivityApp.config(
    function($cookiesProvider, $httpProvider, $stateProvider, $locationProvider, $rootScopeProvider, $resourceProvider, $urlRouterProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/static/templates/search.tpl.html',
                controller: 'HomeCtrl'
            })
        $urlRouterProvider.otherwise('/home');

    });