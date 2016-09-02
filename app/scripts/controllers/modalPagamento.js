/**
 * Created by egmfilho on 30/08/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ModalPagamentoCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderModalidadePagamento',
    'Modalidade',
    'Pagamento',
    'pedido',
    function($rootScope, $scope, $uibModalInstance, providerModalidade, Modalidade, Pagamento, pedido) {

      var pagamento = null;

      $uibModalInstance.opened.then(function() {
        $scope.pedido = pedido;
        $scope.pagamentos = [];
        $rootScope.isLoading = false;
      });

      $scope.totalPagamentos = function() {
        var total = 0;

        angular.forEach($scope.pagamentos, function(item, index) {
          total += item.valor;
        });

        return total;
      };

      $scope.troco = function() {
        return $scope.totalPagamentos() - pedido.getValorTotalComDesconto();
      };

      $scope.restante = function() {
        return pedido.getValorTotalComDesconto() - $scope.totalPagamentos();
      };

      $scope.buscarModalidadePorCodigo = function(codigo) {
        if ($scope.restante() <= 0) return;

        providerModalidade.obterPorCodigo(codigo).then(function(success) {
          pagamento = new Pagamento();
          pagamento.setModalidade(Modalidade.converterEmEntrada(success.data));
          pagamento.valor = $scope.restante();
          $scope.pagamentos.push(pagamento);
        }, function(error) {
          console.log(error);
        });
      };

      $scope.removePagamento = function(pagamento) {
        $scope.pagamentos.splice($scope.pagamentos.indexOf(pagamento), 1);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };

      $scope.gravar = function() {
        $uibModalInstance.close('Gravado!');
      };

    }
  ]);
