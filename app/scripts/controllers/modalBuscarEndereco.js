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
        $rootScope.isLoading = false;
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

        $rootScope.isLoading = true;
        provider.obterEnderecosPorCEP(cep).then(function (success) {
          $scope.pagination.total = success.data.length;
          $scope.enderecos = [ ];
          angular.forEach(success.data, function (item, index) {
            $scope.enderecos.push(new Endereco(Endereco.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      $scope.buscarPorLogradouro = function(logradouro, cidade) {
        if (!logradouro || !cidade) {
          alert('Informe corretamente um logradouro e uma cidade!');
          return;
        }

        $rootScope.isLoading = true;
        provider.obterEnderecosPorLogradouro(logradouro).then(function(success) {
          $scope.enderecos = [ ];
          angular.forEach(success.data, function (item, index) {
            $scope.enderecos.push(new Endereco(Endereco.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
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
