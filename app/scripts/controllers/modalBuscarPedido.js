/**
 * Created by egmfilho on 05/09/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ModalBuscarPedidoCtrl', [
    '$rootScope',
    '$scope',
    '$filter',
    '$uibModalInstance',
    'ProviderPedido',
    'Pedido',
    'DataSaida',
    'ModalBuscarPessoa',
    'Pessoa',
    'key',
    function($rootScope, $scope, $filter, $uibModalInstance, provider, Pedido, DataSaida, ModalBuscarPessoa, Pessoa, key) {

      $uibModalInstance.opened.then(function() {
        $scope.vazio = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        $scope.vendedor = new Pessoa();
        $scope.cliente = new Pessoa();
        $scope.dtInicial = $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.dtFinal = $filter('date')(new Date(), 'dd/MM/yyyy');

        $scope.pedidos = [ ];
        $scope.opcoes = [ {
            nome: 'Pedido',
            valor: 'pedido',
            desc: '(código)'
          }, {
            nome: 'Vendedor',
            valor: 'vendedor',
            desc: '(código ou nome)'
          }, {
            nome: 'Cliente',
            valor: 'cliente',
            desc: '(código ou nome)'
          }, {
            nome: 'Data Inicial',
            valor: 'data-inicial',
            desc: ''
          }, {
            nome: 'Data Final',
            valor: 'data-final',
            desc: ''
          }];
        $scope.filtros = [ 'pedido' ];

        $scope.obterTodos();
      });

      $scope.removeVendedor = function() {
        $scope.vendedor = new Pessoa();
      };

      $scope.removeCliente = function() {
        $scope.cliente = new Pessoa();
      };

      $scope.limpar = function() {
        $scope.cdPedido = '';
        $scope.removeVendedor();
        $scope.removeCliente();
        $scope.dtInicial = '';
        $scope.dtFinal = '';
      };

      $scope.buscarCliente = function() {
        ModalBuscarPessoa.show('Cliente', function(result) {
          if (result) {
            $scope.cliente = new Pessoa(result);
          }
        });
      };

      $scope.buscarVendedor = function() {
        ModalBuscarPessoa.show('Vendedor', function(result) {
          if (result) {
            $scope.vendedor = new Pessoa(result);
          }
        })
      };

      $scope.addFiltro = function(filtro) {
        if ($scope.filtros.length === $scope.opcoes.length) return;

        if (!$scope.filtros.contains(filtro)) {
          $scope.filtros.push(filtro);
        }

        //for (var i = 0; i < $scope.opcoes.length; i++) {
        //  if (!$scope.filtros.contains($scope.opcoes[i].valor)) {
        //    $scope.filtros.push($scope.opcoes[i].valor);
        //    break;
        //  }
        //}
      };

      $scope.removeFiltro = function(filtro) {
        $scope.filtros.splice($scope.filtros.indexOf(filtro), 1);
      };

      $scope.buscarPorCodigoPedido = function(codigo) {
        if (!codigo) {
          //$scope.obterTodos();
          return;
        }

        $rootScope.loading.load();
        console.log('busca de orçamento por código');
        provider.obterPedidoPorCodigo(codigo, true, null, null, true, null, null).then(function(success) {
          $scope.pedidos = [ ];
          $scope.pedidos.push(new Pedido(Pedido.converterEmEntrada(success.data)));
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
          if (error.status == 404) {
            console.log('Orçamento não encontrado!');
            $rootScope.alerta.show('Orçamento não encontrado!');
          }
        });
      };

      function parseDate(date) {
        var parts = date.split('/');

        return new Date(parts[2], parts[1] - 1, parts[0]);
      }

      $scope.buscar = function() {
        //var params = [
        //  $scope.filtros.contains('vendedor') ? $scope.cdVendedor : null,
        //  $scope.filtros.contains('vendedor') ? $scope.nmVendedor : null,
        //  $scope.filtros.contains('cliente') ? $scope.cdCliente : null,
        //  $scope.filtros.contains('cliente') ? $scope.nmCliente : null,
        //  $scope.filtros.contains('data-inicial') ? $scope.dtInicial : null,
        //  $scope.filtros.contains('data-final') ? $scope.dtFinal : null
        //];

        if ($scope.cdPedido) {
          $scope.buscarPorCodigoPedido($scope.cdPedido);
        } else {
          $rootScope.loading.load();

          var init = $scope.dtInicial ? DataSaida.converter(parseDate($scope.dtInicial)) : null,
              end = $scope.dtFinal ? DataSaida.converter(parseDate($scope.dtFinal)) : null;

          provider.obterPedidosComFiltros($scope.vendedor.id, $scope.cliente.id, init, end, true, true).then(function(success) {
            $scope.pedidos = [ ];
            angular.forEach(success.data, function(item, index) {
              $scope.pedidos.push(new Pedido(Pedido.converterEmEntrada(item)));
            });
            $rootScope.loading.unload();
          }, function(error) {
            console.log(error);
            $rootScope.loading.unload();
          });
        }
      };

      $scope.obterTodos = function() {
        $rootScope.loading.load();

        var init = $scope.dtInicial ? DataSaida.converter(parseDate($scope.dtInicial)) : null,
          end = $scope.dtFinal ? DataSaida.converter(parseDate($scope.dtFinal)) : null;

        provider.obterPedidosComFiltros(null, null, init, end, true, true).then(function(success) {
          $scope.pedidos = [ ];
          angular.forEach(success.data, function(item, index) {
            $scope.pedidos.push(new Pedido(Pedido.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      };

      function ordenarPorCodigo() {
        $scope.pedidos = $scope.pedidos.sort(function(a, b) {
          return a.codigo - b.codigo;
        });
      }

      $scope.selecionarPedido = function(pedido) {
        $rootScope.loading.load();
        provider.obterPedidoPorCodigo(pedido.codigo, true, true, true, true, true, true).then(function(success) {
          $rootScope.loading.unload();
          $uibModalInstance.close(new Pedido(Pedido.converterEmEntrada(success.data)));
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };
    }
  ]);
