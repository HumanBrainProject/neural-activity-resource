// Bootstrap function 

// (function() {

window.base_url = 'https://127.0.0.1:8000/';

window.ver_api = '/api/v2/';
console.log('here')
angular.bootstrap().invoke(function($http, $log, $location) {
    console.log('getting /config.json', $http.get('/config.json'))
    $http.get('/config.json').then(function(res) {
        window.bbpConfig = res.data;

        angular.element(document).ready(function() {

            console.log('bootsrapping')
            angular.bootstrap(document.getElementById("neural-activity-app"), ['NeuralActivityApp']);
            console.log('boostrapp done')
            alert('in app.js config')

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
    // 'ParametersConfigurationServices',
    // 'ApiCommunicationServices',
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
                url: '/home/file-view',
                templateUrl: '/static/templates/file-view.tpl.html',
                controller: 'FileViewCtrl'
            })

        $urlRouterProvider.otherwise('/home');

    });
// });