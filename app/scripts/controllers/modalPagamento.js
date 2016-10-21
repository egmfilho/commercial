/**
 * Created by egmfilho on 30/08/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ModalPagamentoCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    '$timeout',
    'ProviderModalidadePagamento',
    'ProviderPedido',
    'Modalidade',
    'Pagamento',
    'Pedido',
    'pedido',
    function($rootScope, $scope, $uibModalInstance, $timeout, providerModalidade, providerPedido, Modalidade, Pagamento, Pedido, pedido) {

      var lookup_valor = 0;

      $uibModalInstance.opened.then(function() {
        $scope.pedido = pedido;
        $scope.modalidade = new Modalidade();
        $scope.pagamento = new Pagamento();
        $scope.pagamento.valor = $scope.restante();
        $scope.cdModalidade = '';
        $scope.nmModalidade = '';
        lookup_valor = $scope.restante();
        $rootScope.loading.unload();

        $timeout(function() {
          jQuery('input[name="codigo"]').focus();
        }, 350);
      });

      $scope.blurLimitarNumero = function(obj, min) {
        if (obj <= (min || 0)) {
          obj = min || 0;
        }
      };

      function limpar() {
        $scope.pagamento = new Pagamento();
        $scope.modalidade = new Modalidade();
        $scope.cdModalidade = '';
        $scope.nmModalidade = '';

        $scope.avancar('input', 'codigo');
      }

      $scope.blurCodigo = function() {
        if ($scope.modalidade.codigo) {
          if ($scope.cdModalidade != $scope.modalidade.codigo) {
            $scope.cdModalidade = $scope.modalidade.codigo;
          }
        }
      };

      $scope.blurNome = function() {
        if ($scope.modalidade.nome) {
          if ($scope.nmModalidade != $scope.modalidade.nome) {
            $scope.nmModalidade = $scope.modalidade.nome;
          }
        }
      };

      $scope.totalPagamentos = function() {
        var total = 0;

        angular.forEach($scope.pedido.pagamentos, function(item, index) {
          total += item.valor;
        });

        return total;
      };

      $scope.troco = function() {
        return $scope.totalPagamentos() - pedido.getValorTotalComDesconto();
      };

      $scope.restante = function() {
        var restante = Math.round((pedido.getValorTotalComDesconto() - $scope.totalPagamentos()) * 100) / 100;

        if (lookup_valor != restante) {
          lookup_valor = restante;
          $scope.pagamento.valor = restante;
        }

        return restante;
      };

      $scope.buscarModalidadePorCodigo = function() {
        if ($scope.restante() <= 0) return;

        if (!$scope.cdModalidade) return;

        $rootScope.loading.load();
        providerModalidade.obterPorCodigo($scope.cdModalidade).then(function(success) {
          $scope.modalidade = new Modalidade(Modalidade.converterEmEntrada(success.data));
          $scope.cdModalidade = $scope.modalidade.codigo;
          $scope.nmModalidade = $scope.modalidade.nome;
          $scope.avancar('input', 'valor');
          $rootScope.loading.unload();
        }, function(error) {
          $rootScope.loading.unload();
          if (error.status == 404) {
            console.log('Modalidade não encontrada!');
            $rootScope.alerta.show('Modalidade não encontrada!');
          }
        });
      };

      $scope.addModalidade = function() {
        if ($scope.pagamento.valor <= 0) {
          $rootScope.alerta.show('Valor inválido');
          return;
        }

        if ($scope.cdModalidade == $scope.modalidade.codigo) {
          $scope.pagamento.setModalidade(new Modalidade($scope.modalidade));
          $scope.pedido.pagamentos.push($scope.pagamento);
          limpar();
        } else {
          $scope.avancar('input', 'codigo');
        }
      };

      $scope.removePagamento = function(pagamento) {
        $scope.pedido.pagamentos.splice($scope.pedido.pagamentos.indexOf(pagamento), 1);
      };

      $scope.avancar = function(elem, name) {
        jQuery(elem + '[name="' + name + '"]').focus().select();
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };

      $scope.gravar = function() {
        //if (!$scope.pedido.pagamentos.length || $scope.troco() != 0) {
        //  $rootScope.alerta.show('Reveja os valores', 'alert-warning');
        //  return;
        //}

        $uibModalInstance.close(true);
      };

    }
  ]);
