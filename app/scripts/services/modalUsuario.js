/**
 * Created by egmfilho on 30/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ModalUsuario', ['$uibModal', function ($uibModal) {

    return {
      show: function (usuario, perfis, permissoes) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalUsuario.html',
          controller: 'ModalUsuarioCtrl',
          controllerAs: 'modal',
          size: 'md',
          resolve: {
            usuario: function () {
              return usuario;
            },
            perfis: function () {
              return perfis;
            },
            permissoes: function () {
              return permissoes;
            }
          }
        }).result;
      }
    };

  }]);
