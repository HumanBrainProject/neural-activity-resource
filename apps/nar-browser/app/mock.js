(function() {
    'use strict';
  
    angular.module('bbpOidcClient', [])
    
    .provider('bbpOidcSession', function() {
        
        this.alwaysPromptLogin = function(value) {
            
        };

        this.ensureToken = function(value) {
            
        };

        this.$get = ['$http', '$q', function($http, $q) {
            return {
                alwaysPromptLogin: this.alwaysPromptLogin,
                ensureToken: this.ensureToken
            };
        }];
    })

})();
