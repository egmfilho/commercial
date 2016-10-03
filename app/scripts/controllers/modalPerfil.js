/**
 * Created by egmfilho on 03/10/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ModalPerfilCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderPerfilUsuario',
    'PerfilUsuario',
    'perfil',
    'permissoes',
    function ($rootScope, $scope, $uibModalInstance, provider, PerfilUsuario, perfil, permissoes) {

      var self = this;

      $uibModalInstance.opened.then(function () {
        self.perfil = new PerfilUsuario(perfil);
        self.permissoes = permissoes;
      });

      $scope.salvar = function () {
        $uibModalInstance.close(true);
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };
    }
  ]);
