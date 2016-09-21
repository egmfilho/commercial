'use strict';

angular.module('commercialApp.controllers')
  .controller('LoginCtrl', ['$location', 'AuthenticationService', function($location, authentication) {

    this.login = function(username, password) {
      authentication.login(username, password, function(response) {
        $location.path('#/home');
      });
    };

  }]);
