/**
 * Created by egmfilho on 05/09/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ModalBuscarPedidoCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$filter',
    '$uibModalInstance',
    'ProviderPedido',
    'Pedido',
    'DataSaida',
    'ModalBuscarPessoa',
    'Pessoa',
    'destino',
    'atendimento',
    function($rootScope, $scope, $location, $filter, $uibModalInstance, provider, Pedido, DataSaida, ModalBuscarPessoa, Pessoa, destino, atendimento) {

      $scope.pagination = {
        current: 1,
        max: 10,
        total: 0,
        mudarPagina: function () {
          $scope.buscar();
        }
      };

      $uibModalInstance.opened.then(function() {
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
        ModalBuscarPessoa.show('Cliente').then(function(result) {
          if (result) {
            console.log(result);
            $scope.cliente = new Pessoa(result);
          }
        });
      };

      $scope.buscarVendedor = function() {
        ModalBuscarPessoa.show('Vendedor').then(function(result) {
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

      function parseDate(date, h, m, s) {
        var parts = date.split('/');

        return new Date(parts[2], parts[1] - 1, parts[0], h, m, s);
      }

      $scope.buscar = function() {
        if ($scope.cdPedido) {
          $scope.buscarPorCodigoPedido($scope.cdPedido);
        } else {
          $rootScope.loading.load();

          var init = $scope.dtInicial ? DataSaida.converter(parseDate($scope.dtInicial, 0, 0, 0)) : null,
              end = $scope.dtFinal ? DataSaida.converter(parseDate($scope.dtFinal, 23, 59, 59)) : null;

          var limite = ($scope.pagination.current - 1) * $scope.pagination.max + ',' + $scope.pagination.max;
          provider.obterPedidosComFiltros($scope.vendedor.id, $scope.cliente.id, null, null, init, end, atendimento, true, true, false, false, false, false, limite).then(function(success) {
            $scope.pedidos = [ ];
            $scope.pagination.total = success.info.order_quantity;
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

        var init = $scope.dtInicial ? DataSaida.converter(parseDate($scope.dtInicial, 0, 0, 0)) : null,
            end = $scope.dtFinal ? DataSaida.converter(parseDate($scope.dtFinal, 23, 59, 59)) : null;

        var limite = ($scope.pagination.current - 1) * $scope.pagination.max + ',' + $scope.pagination.max;
        provider.obterPedidosComFiltros(null, null, null, null, init, end, null, true, true, true, false, false, false, limite).then(function(success) {
          $scope.pedidos = [ ];
          $scope.pagination.total = success.info ? success.info.order_quantity : 0;
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
        if (destino) {
          $location.path(destino).search('code', pedido.codigo);
        } else {
          $uibModalInstance.close(pedido);
        }
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };
    }
  ]);
