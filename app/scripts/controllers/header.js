/**
 * Created by egmfilho on 03/10/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('HeaderCtrl', ['$cookies', function($cookies) {

    this.getCurrentUser = function() {
      if (!$cookies.get('currentUser')) return;

      var user = JSON.parse(window.atob($cookies.get('currentUser')));

      return {
        nome: user.nome,
        usuario: user.usuario,
        email: user.email,
        perfil: user.perfil.nome
      };
    };

  }]);
