// Register blockView component, along with its associated controller and template
angular.
  module('NeuralActivityApp').
  component('blockView', {
    template:
        '<ul>' +
          '<li ng-repeat="phone in $ctrl.phones">' +
            '<span>{{phone.name}}</span>' +
            '<p>{{phone.snippet}}</p>' +
          '</li>' +
        '</ul>' +

'<div>' +
    '<body>' +
        '<h1 align=center>Block XXX3</h1>' +
        '<panel class=description-panel>' +
            '<table class="table-create">' +
                '<thead>' +
                '</thead>' +
                '<tbody>' +
                    '<ul>' +
                    'kjh' +
                      '<li ng-repeat="b in $ctrl.data_block">' +
                       '<span>test</span>' +
                        '<span>{{$ctrl.b.name}}</span>' +
                        '<p>{{$ctrl.b.description}}</p>' +
                      '</li>' +
                      'kjh' +
                    '</ul>' +
                    '<tr>' +
                        '<td>name: </td>' +
                        '<td>{{$ctrl.element.name}}</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>name: </td>' +
                        '<td>{{$ctrl.block.name}}</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>description: </td>' +
                        '<td>{{$ctrl.block.description}}</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>file origin: </td>' +
                        '<td>{{$ctrl.block.file_origin}}</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>name: </td>' +
                        '<td>{{$ctrl.block.name}}</td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>' +
        '</panel>' +
        '<br>' +
        '<h4>Annotations</h4>' +
        '<table class="table">' +
            '<tbody>' +
                '<tr ng-repeat="(key,value) in $ctrl.block.annotations">' +
                    '<th scope="row">{{key}}</th><td>{{value}}</td>' +
            '</tbody>' +
        '</table>' +
        '<br>' +
        '<br>' +
        '<h2>Segments Array</h2>' +
        '<table class="table">' +
            '<thead>' +
                '<tr>' +
                    '<th style="width: 15%">Id</th><td>Name</td>' +
                '</tr>' +
            '</thead>' +
            '<tbody>' +
                '<tr class=tr-clickable ng-repeat="(s_key,segment) in $ctrl.block.segments" ng-click="showSegment(s_key)" ui-sref="file_view.segment({segment_id:{{s_key}}})" ui-sref-active="active">' +
                    '<th style="width: 15%">{{s_key}}</th><td>{{segment.name}}</td>' +
                    '<td style="width: 15%">' +
                    '</td>' +
            '</tbody>' +
        '</table>' +
    '</body>' +
'</div>',

controller: function BlockViewController($scope, $rootScope, $http, $location, $stateParams, FileService) {
      this.phones = [
        {
          name: 'hello',
          snippet: 'goodbye'
        }, {
          name: 'Motorola XOOM™ with Wi-Fi',
          snippet: 'The Next, Next Generation tablet.'
        }, {
          name: 'MOTOROLA XOOM™',
          snippet: 'The Next, Next Generation tablet.'
        }
      ];

      this.element = {name: 'xxx', description: 'human'};


      this.$onChanges = FileService.setService($stateParams.file_name).then(function(response) {

            this.data = FileService.getData();

            // $scope.$apply();

            console.log("this.data: " + JSON.stringify(this.data, null, 4));
            this.data_block = this.data.block[0];
            console.log("this.data_block: " + JSON.stringify(this.data_block, null, 4));
            //this.data_block = this.$parent.data.block[0];

            console.log("response XXX: " + JSON.stringify(response, null, 4));

            this.block = response.block[0];

        });

        console.log("this.data_block 2: " + JSON.stringify(this.data_block, null, 4));

    }
  });