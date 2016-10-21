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
    function($rootScope, $scope, $uibModalInstance, provider, Endereco, enderecos) {

      $scope.pagination = {
        current: 1,
        max: 10,
        total: 0
      };

      $uibModalInstance.opened.then(function() {
        $scope.enderecos = enderecos || [ ];
        $rootScope.loading.unload();
        setTimeout(function() {
          jQuery('input[name="cdEndereco"]').focus();
        }, 300);
      });

      $scope.avancar = function() {
        jQuery('input[name="cidade"]').focus();
      };

      $scope.buscarPorCEP = function(cep) {

        if (!cep || cep.length < 8) {
          alert('Informe corretamente um CEP!');
          return;
        }

        $rootScope.loading.load();
        provider.obterEnderecosPorCEP(cep).then(function (success) {
          $scope.pagination.total = success.data.length;
          $scope.enderecos = [ ];
          angular.forEach(success.data, function (item, index) {
            $scope.enderecos.push(new Endereco(Endereco.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      };

      $scope.buscarPorLogradouro = function(logradouro, cidade) {
        if (!logradouro || !cidade) {
          alert('Informe corretamente um logradouro e uma cidade!');
          return;
        }

        $rootScope.loading.load();
        provider.obterEnderecosPorLogradouro(logradouro).then(function(success) {
          $scope.enderecos = [ ];
          angular.forEach(success.data, function (item, index) {
            $scope.enderecos.push(new Endereco(Endereco.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      };

      $scope.selecionarEndereco = function(endereco) {
        $uibModalInstance.close(endereco);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };
    }
  ]);
