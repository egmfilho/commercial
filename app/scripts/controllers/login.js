'use strict';

angular.module('commercialApp')
  .controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {

    this.erro = true;

    this.login = function() {
      //alert($scope.username + ' - ' + $scope.password);

      this.erro = !this.erro;

      //$http({
      //  method: 'POST'
      //});
    };

  }]);
