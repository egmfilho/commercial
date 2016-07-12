'use strict';

angular.module('commercialApp')
  .controller('LoginCtrl', ['$scope', 'AuthenticationService', function($scope, authentication) {

    this.erro = 'O servidor encontra-se em manutenção. Tente novamente mais tarde.';

    //var elem = document.getElementById('login');
    //
    //$(window).resize(function() {
    //  elem.style.transform = 'translateY(' + Math.round((window.innerHeight - elem.style.height) / 4) + 'px)';
    //});

    this.login = function() {

      authentication.login($scope.username, $scope.password, function(response) {
        console.log(response);

        if (response.status.flag == status.sucesso) {
          console.log('Sucesso!');
        }
      });

    };

  }]);
