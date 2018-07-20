describe('clb-form-control-focus directive', function() {
  var compile;
  var scope;
  var timeout;

  beforeEach(module('clb-ui-form'));

  beforeEach(inject(function($compile, $rootScope, $timeout) {
    compile = $compile;
    scope = $rootScope;
    timeout = $timeout;
  }));

  it('should send the focus command to the current form element', function() {
    var element = compile(
      '<input type="search" clb-form-control-focus>')(scope);
    spyOn(element[0], 'focus');
    timeout.flush();
    expect(element[0].focus).toHaveBeenCalled();
  });
});
