/**
 * Created by egmfilho on 21/09/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('LogoutCtrl', ['$location', 'AuthenticationService', function($location, authentication) {

    authentication.logout(function(res) {
      if(res) {
        $location.path('/login');
      }
    });

  }]);
