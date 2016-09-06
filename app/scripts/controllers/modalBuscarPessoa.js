/**
 * Created by egmfilho on 01/09/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ModalBuscarPessoaCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderPessoa',
    'Pessoa',
    'tipo',
    function($rootScope, $scope, $uibModalInstance, provider, Pessoa, tipo) {

      $uibModalInstance.opened.then(function() {
        $scope.pessoas = [ ];
        setTimeout(function() {
          jQuery('input[name="cdPessoa"]').focus();
        }, 300);
      });

      $scope.buscarPorCodigo = function(codigo) {
        $rootScope.isLoading = true;

        provider.obterPessoaPorCodigo(tipo, codigo).then(function(success) {
          $scope.pessoas = [ ];
          $scope.pessoas.push(new Pessoa(Pessoa.converterEmEntrada(success.data)));
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      $scope.buscarPorNome = function(nome) {
        $rootScope.isLoading = true;

        provider.obterPessoasPorNome(tipo, nome).then(function(success) {
          $scope.pessoas = [ ];
          angular.forEach(success.data, function(item, index) {
            $scope.pessoas.push(new Pessoa(Pessoa.converterEmEntrada(item)));
          });
          ordenarPorCodigo();
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      function ordenarPorNome() {
        $scope.pessoas = $scope.pessoas.sort(function(a, b) {
          return a.nome - b.nome;
        });
      }

      function ordenarPorCodigo() {
        $scope.pessoas = $scope.pessoas.sort(function(a, b) {
          return a.codigo - b.codigo;
        });
      }

      $scope.selecionarPessoa = function(pessoa) {
        $rootScope.isLoading = true;
        provider.obterPessoaPorCodigo(tipo, pessoa.codigo).then(function(success) {
          $rootScope.isLoading = false;
          $uibModalInstance.close(new Pessoa(Pessoa.converterEmEntrada(success.data)));
        }, function(error) {
          console.log(error);
        });
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };
    }
  ]);