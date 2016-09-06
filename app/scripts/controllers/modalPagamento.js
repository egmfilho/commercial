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

      $uibModalInstance.opened.then(function() {
        $scope.pedido = pedido;
        $scope.modalidade = new Modalidade();
        $scope.pagamento = new Pagamento();
        $scope.cdModalidade = '';
        $scope.nmModalidade = '';
        $scope.valor = $scope.restante();
        $rootScope.isLoading = false;
      });

      function limpar() {
        $scope.pagamento = new Pagamento();
        $scope.modalidade = new Modalidade();
        $scope.cdModalidade = '';
        $scope.nmModalidade = '';
        $scope.valor = $scope.restante();

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

      $scope.blurValor = function() {
        $scope.valor = $scope.restante();
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
        return Math.round((pedido.getValorTotalComDesconto() - $scope.totalPagamentos()) * 100) / 100;
      };

      $scope.buscarModalidadePorCodigo = function() {
        if ($scope.restante() <= 0) return;

        if (!$scope.cdModalidade) return;

        $rootScope.isLoading = true;
        providerModalidade.obterPorCodigo($scope.cdModalidade).then(function(success) {
          $scope.modalidade = new Modalidade(Modalidade.converterEmEntrada(success.data));
          $scope.cdModalidade = $scope.modalidade.codigo;
          $scope.nmModalidade = $scope.modalidade.nome;
          $scope.avancar('input', 'valor');
          $rootScope.isLoading = false;
        }, function(error) {
          $rootScope.isLoading = false;
          if (error.status == 404) {
            console.log('Modalidade não encontrada!');
            $rootScope.alerta.show('Modalidade não encontrada!');
          }
        });
      };

      $scope.addModalidade = function() {
        if ($scope.cdModalidade == $scope.modalidade.codigo) {
          $scope.pagamento.setModalidade(new Modalidade($scope.modalidade));
          $scope.pagamento.valor = $scope.valor;
          $scope.pedido.pagamentos.push($scope.pagamento);
          limpar();
        } else {
          $scope.avancar('input', 'codigo');
        }
      };

      $scope.removePagamento = function(pagamento) {
        $scope.pedido.pagamentos.splice($scope.pedido.pagamentos.indexOf(pagamento), 1);
        $scope.valor = $scope.restante();
      };

      $scope.avancar = function(elem, name) {
        jQuery(elem + '[name="' + name + '"]').focus().select();
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };

      $scope.gravar = function() {

        if (!$scope.pedido.pagamentos.length || $scope.troco() < 0) {
          alert('Finalize o pagamento!');
          return;
        }

        console.log('saida pedido', Pedido.converterEmSaida($scope.pedido));

        $rootScope.isLoading = true;
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