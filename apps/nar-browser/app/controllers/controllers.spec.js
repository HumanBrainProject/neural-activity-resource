describe('EEGController', function() {

    var $controller, $rootScope, controller, $scope;

    beforeEach(angular.mock.module('nar'));

    // Provide mock dependencies
    beforeEach(function () {
        mockbbpOidcSession = {
        };
        module(function ($provide) {
            $provide.value('bbpOidcSession', mockbbpOidcSession);
        });
    });

    beforeEach(inject(angular.mock.inject(function(_$controller_, _$rootScope_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        controller = $controller('EEGController', {$scope: $scope});
    })));

    it('should exist', function() {
        expect(controller).toBeDefined();
    });
});

describe('FMRIController', function() {

    var $controller, $rootScope, controller, $scope;

    beforeEach(angular.mock.module('nar'));

    // Provide mock dependencies
    beforeEach(function () {
        mockbbpOidcSession = {
        };
        module(function ($provide) {
            $provide.value('bbpOidcSession', mockbbpOidcSession);
        });
    });

    beforeEach(inject(angular.mock.inject(function(_$controller_, _$rootScope_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        controller = $controller('FMRIController', {$scope: $scope});
    })));

    it('should exist', function() {
        expect(controller).toBeDefined();
    });
});

describe('MEAController', function() {

    var $controller, $rootScope, controller, $scope;

    beforeEach(angular.mock.module('nar'));

    // Provide mock dependencies
    beforeEach(function () {
        mockbbpOidcSession = {
        };
        module(function ($provide) {
            $provide.value('bbpOidcSession', mockbbpOidcSession);
        });
    });

    beforeEach(inject(angular.mock.inject(function(_$controller_, _$rootScope_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        controller = $controller('MEAController', {$scope: $scope});
    })));

    it('should exist', function() {
        expect(controller).toBeDefined();
    });
});

describe('SharpElectrodeController', function() {

    var $controller, $rootScope, controller, $scope;

    beforeEach(angular.mock.module('nar'));

    // Provide mock dependencies
    beforeEach(function () {
        mockbbpOidcSession = {
        };
        module(function ($provide) {
            $provide.value('bbpOidcSession', mockbbpOidcSession);
        });
    });

    beforeEach(inject(angular.mock.inject(function(_$controller_, _$rootScope_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        controller = $controller('SharpElectrodeController', {$scope: $scope});
    })));

    it('should exist', function() {
        expect(controller).toBeDefined();
    });
});

describe('TwoPhotonController', function() {

    var $controller, $rootScope, controller, $scope;

    beforeEach(angular.mock.module('nar'));

    // Provide mock dependencies
    beforeEach(function () {
        mockbbpOidcSession = {
        };
        module(function ($provide) {
            $provide.value('bbpOidcSession', mockbbpOidcSession);
        });
    });

    beforeEach(inject(angular.mock.inject(function(_$controller_, _$rootScope_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        controller = $controller('TwoPhotonController', {$scope: $scope});
    })));

    it('should exist', function() {
        expect(controller).toBeDefined();
    });
});

describe('DatasetController', function() {

    var $controller, $rootScope, controller, $scope;

    beforeEach(angular.mock.module('nar'));

    // Provide mock dependencies
    beforeEach(function () {
        mockbbpOidcSession = {
            token: function() {
                return "footoken"
            }
        };
        module(function ($provide) {
            $provide.value('bbpOidcSession', mockbbpOidcSession);
        });
    });

    beforeEach(inject(angular.mock.inject(function(_$controller_, _$rootScope_, _$httpBackend_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        controller = $controller('DatasetController', {$scope: $scope});
        $httpBackend = _$httpBackend_;
    })));

    it('should exist', function() {
        expect(controller).toBeDefined();
    });
});

describe('PatchClampListController', function() {

    var $controller, $rootScope, controller, $scope;

    beforeEach(angular.mock.module('nar'));

    // Provide mock dependencies
    beforeEach(function () {
        mockbbpOidcSession = {
            token: function() {
                return "footoken"
            }
        };
        module(function ($provide) {
            $provide.value('bbpOidcSession', mockbbpOidcSession);
        });
    });

    beforeEach(inject(angular.mock.inject(function(_$controller_, _$rootScope_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        controller = $controller('PatchClampListController', {$scope: $scope});
    })));

    it('should exist', function() {
        expect(controller).toBeDefined();
    });
});

describe('PatchClampController', function() {

    var $controller, $rootScope, controller, $scope;

    beforeEach(angular.mock.module('nar'));

    // Provide mock dependencies
    beforeEach(function () {
        mockbbpOidcSession = {
            token: function() {
                return "footoken"
            }
        };
        module(function ($provide) {
            $provide.value('bbpOidcSession', mockbbpOidcSession);
        });
    });

    beforeEach(inject(angular.mock.inject(function(_$controller_, _$rootScope_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        controller = $controller('PatchClampController', {$scope: $scope});
    })));

    it('should exist', function() {
        expect(controller).toBeDefined();
    });

    it('should check if url is valid', function() {
        expect(controller.validURL('https://nexus.humanbrainproject.org/v0/schemas/shape/core/activity/v0.0.4')).toBe(true);
    });

    it('should return relative path of url', function() {
        expect(controller.relativePath('https://nexus.humanbrainproject.org/v0/schemas/shape/core/activity/v0.0.4')).toBe('shape/core/activity/v0.0.4');
    });

});
