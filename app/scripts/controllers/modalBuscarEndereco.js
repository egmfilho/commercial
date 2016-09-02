/**
 * Created by egmfilho on 02/09/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ModalBuscarEnderecoCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderEndereco',
    'Endereco',
    'enderecos',
    function($rootScope, $scope, $uibModalInstance, provider, Pessoa, enderecos) {

      $uibModalInstance.opened.then(function() {
        $scope.enderecos = enderecos;
        $rootScope.isLoading = false;
        setTimeout(function() {
          jQuery('input[name="cdEndereco"]').focus();
        }, 300);
      });

      $scope.selecionarEndereco = function(endereco) {
        $uibModalInstance.close(endereco);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };
    }
  ]);
