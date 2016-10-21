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
    function ($rootScope, $scope, $uibModalInstance, provider, Pessoa, tipo) {

      $scope.pagination = {
        current: 1,
        max: 10,
        total: 0
      };

      $uibModalInstance.opened.then(function () {
        $scope.pessoas = [];
        setTimeout(function () {
          jQuery('input[name="cdPessoa"]').focus();
        }, 300);
      });

      $scope.buscarPorCodigo = function (codigo) {
        $rootScope.loading.load();

        provider.obterPessoaPorCodigo(tipo, codigo).then(function (success) {
          $scope.pessoas = [];
          $scope.pessoas.push(new Pessoa(Pessoa.converterEmEntrada(success.data)));
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
          $rootScope.alerta.show('Nenhuma pessoa encontrada');
        });
      };

      $scope.buscarPorNome = function (nome) {
        $rootScope.loading.load();

        provider.obterPessoasPorNome(tipo, nome).then(function (success) {
          $scope.pagination.total = success.data.length;
          $scope.pessoas = [];
          angular.forEach(success.data, function (item, index) {
            $scope.pessoas.push(new Pessoa(Pessoa.converterEmEntrada(item)));
          });
          ordenarPorCodigo();
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
          $rootScope.alerta.show('Nenhuma pessoa encontrada');
        });
      };

      function ordenarPorNome() {
        $scope.pessoas = $scope.pessoas.sort(function (a, b) {
          return a.nome - b.nome;
        });
      }

      function ordenarPorCodigo() {
        $scope.pessoas = $scope.pessoas.sort(function (a, b) {
          return a.codigo - b.codigo;
        });
      }

      $scope.selecionarPessoa = function (pessoa) {
        $rootScope.loading.load();
        provider.obterPessoaPorCodigo(tipo, pessoa.codigo).then(function (success) {
          $rootScope.loading.unload();
          $uibModalInstance.close(new Pessoa(Pessoa.converterEmEntrada(success.data)));
        }, function (error) {
          console.log(error);
        });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };
    }
  ]);
