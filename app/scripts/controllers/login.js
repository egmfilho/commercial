'use strict';

angular.module('commercialApp')
  .controller('LoginCtrl', ['$scope', 'AuthenticationService', 'LOGIN_STATUS', function($scope, authentication, status) {

    this.erro = true;

    this.login = function() {
      //alert($scope.username + ' - ' + $scope.password);

      //this.erro = !this.erro;

      //$http({
      //  method: 'POST'
      //});

      authentication.login($scope.username, $scope.password, function(response) {
        console.log(response);

        if (response.status.flag == status.sucesso) {
          console.log('Sucesso!');
        }
      });

    };

  }]);
