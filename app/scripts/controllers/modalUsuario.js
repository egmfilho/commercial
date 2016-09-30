/**
 * Created by egmfilho on 30/09/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ModalUsuarioCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderUsuario',
    'Usuario',
    'usuario',
    'perfis',
    function ($rootScope, $scope, $uibModalInstance, provider, Usuario, usuario, perfis) {

      var self = this;

      $uibModalInstance.opened.then(function () {
        self.usuario = new Usuario(usuario);
        self.perfis = perfis;
      });

      $scope.excluir = function () {
        $rootScope.isLoading = true;
        provider.excluir(self.usuario.id).then(function (success) {
          $rootScope.isLoading = false;
          $uibModalInstance.close('Usuário excluído!');
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      $scope.atualizar = function () {
        $rootScope.isLoading = true;
        provider.editar(self.usuario).then(function (success) {
          $rootScope.isLoading = false;
          $uibModalInstance.close('Usuário "' + self.usuario.usuario + '" editado!');
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };
    }
  ]);
