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
    'ProviderPedido',
    'Modalidade',
    'Pagamento',
    'Pedido',
    'pedido',
    function($rootScope, $scope, $uibModalInstance, providerModalidade, providerPedido, Modalidade, Pagamento, Pedido, pedido) {

      var pagamento = null;

      $uibModalInstance.opened.then(function() {
        $scope.pedido = pedido;
        $rootScope.isLoading = false;
      });

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
        return pedido.getValorTotalComDesconto() - $scope.totalPagamentos();
      };

      $scope.buscarModalidadePorCodigo = function(codigo) {
        if ($scope.restante() <= 0) return;

        providerModalidade.obterPorCodigo(codigo).then(function(success) {
          pagamento = new Pagamento();
          pagamento.setModalidade(Modalidade.converterEmEntrada(success.data));
          pagamento.valor = $scope.restante();
          $scope.pedido.pagamentos.push(pagamento);
        }, function(error) {
          console.log(error);
        });
      };

      $scope.removePagamento = function(pagamento) {
        $scope.pedido.pagamentos.splice($scope.pedido.pagamentos.indexOf(pagamento), 1);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };

      $scope.gravar = function() {

        //console.log(JSON.stringify(Pedido.converterEmSaida($scope.pedido)));
        //return;

        $rootScope.isLoading = true;
        console.log(Pedido.converterEmSaida($scope.pedido));
        providerPedido.adicionarPedido(Pedido.converterEmSaida($scope.pedido)).then(function(success) {
          console.log(success.data);
          $rootScope.isLoading = false;
          $uibModalInstance.close('Gravado!');
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

    }
  ]);
