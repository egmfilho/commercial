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
        if (!self.perfil.id) {
          self.perfil.permissoes = permissoes;
        }
      });

      $scope.salvar = function () {
        if (!self.perfil.nome) {
          $rootScope.alerta.show('Informe o nome do perfil!');
          return;
        }

        console.log(PerfilUsuario.converterEmSaida(self.perfil));

        $rootScope.loading.load();
        if (self.perfil.id) {
          provider.editar(PerfilUsuario.converterEmSaida(self.perfil)).then(function(success) {
            $rootScope.loading.unload();
            $rootScope.alerta.show('Perfil "' + self.perfil.nome + '" editado!', 'alert-success');
            $uibModalInstance.close(true);
          }, function(error) {
            console.log(error);
            $rootScope.loading.unload();
            if (error.status == 420) {
              $rootScope.alerta.show('Nome de perfil ja registrado!', 'alert-danger');
            }
          });
        } else {
          provider.adicionar(PerfilUsuario.converterEmSaida(self.perfil)).then(function(success) {
            $rootScope.loading.unload();
            $rootScope.alerta.show('Perfil registrado com sucesso!', 'alert-success');
            $uibModalInstance.close(true);
          }, function(error) {
            console.log(error);
            $rootScope.loading.unload();
            if (error.status == 420) {
              $rootScope.alerta.show('Nome de perfil ja registrado!', 'alert-danger');
            }
          });
        }
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };
    }
  ]);
