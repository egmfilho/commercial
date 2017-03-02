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
    'nome',
    function ($rootScope, $scope, $uibModalInstance, provider, Pessoa, tipo, Nome) {

      $scope.pagination = {
        current: 1,
        max: 10,
        total: 0,
        mudarPagina: function (nome) {
          $scope.buscarPorNome(nome);
        }
      };

      $uibModalInstance.opened.then(function () {
        $scope.pessoas = [];
        if (Nome) {
          $scope.nmPessoa = Nome;
          $scope.buscarPorNome(Nome);
        }
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
          //@ console.log(error);
          $rootScope.loading.unload();
          $rootScope.alerta.show('Nenhuma pessoa encontrada');
        });
      };

      $scope.buscarPorNome = function (nome) {
        $rootScope.loading.load();

        var page = {
          min: (($scope.pagination.current - 1) * $scope.pagination.max) + 1,
          max: (($scope.pagination.current - 1) * $scope.pagination.max) + $scope.pagination.max
        };
        $scope.pessoas = [];
        provider.obterPessoasPorNome(tipo, nome, null, page.min + ',' + page.max).then(function (success) {
          $scope.pagination.total = success.info.person_quantity;
          angular.forEach(success.data, function (item, index) {
            $scope.pessoas.push(new Pessoa(Pessoa.converterEmEntrada(item)));
          });
          ordenarPorCodigo();
          $rootScope.loading.unload();
        }, function (error) {
          //@ console.log(error);
          $scope.pagination.total = 0;
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
          //@ console.log(error);
        });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };
    }
  ]);
