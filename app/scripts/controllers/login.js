'use strict';

angular.module('commercialApp')
  .controller('LoginCtrl', ['$scope', 'AuthenticationService', function($scope, authentication) {

    this.erro = 'O servidor encontra-se em manutenção. Tente novamente mais tarde.';

    this.login = function() {

      authentication.login($scope.username, $scope.password, function(response) {
        console.log(response);

        if (response.status.flag == status.sucesso) {
          console.log('Sucesso!');
        }
      });

    };

  }]);
