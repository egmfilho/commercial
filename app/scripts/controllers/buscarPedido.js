/**
 * Created by egmfilho on 14/11/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('BuscarPedidoCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$filter',
    'ProviderPedido',
    'ProviderConfig',
    'Pedido',
    'ModalBuscarPessoa',
    'DataSaida',
    function ($rootScope, $scope, $location, $filter, providerPedido, providerConfig, Pedido, modalBuscarPessoa, DataSaida) {

      var self = this, pedidosMarcados = [];

      self.pagination = {
        current: 1,
        max: 15,
        total: 0,
        mudarPagina: function () {
          getPedidos();
        }
      };

      self.filtro = {
        pedido: '',
        cliente: {id: null, nome: null},
        vendedor: {id: null, nome: null},
        dataMin: null,
        dataMax: null,
        statusId: '',
        valorMin: null,
        valorMax: null
      };

      $scope.$on('$viewContentLoaded', function () {
        obterStatus();
        getPedidos();
      });

      function obterStatus() {
        $rootScope.loading.load();
        $scope.statusArray = [];
        providerConfig.obterStatusPedido().then(function(success) {
          //@ console.log(success.data);
          angular.forEach(success.data, function(item, index) {
            $scope.statusArray.push({
              id: item.order_status_id.toString(),
              nome: item.order_status_name
            });
          });
          $rootScope.loading.unload();
        }, function(error) {
          //@ console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getPedidos() {
        $rootScope.loading.load();
        self.pedidos = [];
        var limite = (self.pagination.current - 1) * self.pagination.max + ',' + self.pagination.max;
        providerPedido.obterPedidosComFiltros(self.filtro.vendedor.id, self.filtro.cliente.id, self.filtro.valorMin, self.filtro.valorMax, DataSaida.converter(self.filtro.dataMin), DataSaida.converter(self.filtro.dataMax), self.filtro.statusId, null, null, true, false, false, true, false, false, limite).then(function (success) {
          self.pagination.total = success.info ? success.info.order_quantity : 0;
          angular.forEach(success.data, function (item, index) {
            var pedido = new Pedido(Pedido.converterEmEntrada(item));
            self.pedidos.push({
              checked: pedidosMarcados.find(function(p) {
                return p.codigo === pedido.codigo;
              }) != null,
              pedido: pedido
            });
          });
          $rootScope.loading.unload();
          $scope.showFiltros = false;
        }, function (error) {
          self.pagination.total = 0;
          //@ console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getPedido(codigo) {
        $rootScope.loading.load();
        self.pedidos = [];
        providerPedido.obterPedidoPorCodigo(true, false, false, true).then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.pedidos.push({
              checked: false,
              pedido: new Pedido(Pedido.converterEmEntrada(item))
            });
          });
          $rootScope.loading.unload();
          $scope.showFiltros = false;
        }, function (error) {
          //@ console.log(error);
          $rootScope.loading.unload();
        });
      }

      this.atualizar = function () {
        getPedidos();
      };

      this.marcarTodos = function (value) {
        angular.forEach(self.pedidos, function (item, index) {
          item.checked = value;
        });
      };

      this.changeCheck = function(p) {
        if (p.checked) {
          pedidosMarcados.push(p.pedido);
        } else {
          pedidosMarcados.splice(pedidosMarcados.indexOf(p.pedido), 1);
        }
      };

      this.criar = function () {
        var codes = '',
          clientes = [],
          vendedores = [],
          min = new Date(),
          max = new Date();

        angular.forEach(pedidosMarcados, function (item, index) {
          if (clientes.length != 0) {
            codes += 'x';
          }
          codes += item.codigo;

          if (!clientes.contains(item.idCliente)) {
            clientes.push(item.idCliente);
          }

          if (!vendedores.contains(item.idVendedor)) {
            vendedores.push(item.idVendedor);
          }

          min = item.dataPedido < min ? item.dataPedido : min;
          max = item.dataPedido > max ? item.dataPedido : max;
        });

        if (!codes) {
          return;
        }

        $location.path('/atendimento/batch')
          .search('type', 'order')
          .search('codes', codes)
          .search('v', vendedores.length)
          .search('c', clientes.length)
          .search('min', $filter('date')(min, 'dd/MM/yyyy'))
          .search('max', $filter('date')(max, 'dd/MM/yyyy'));
      };

      this.filtrar = function () {
        if (this.filtro.pedido) {
          getPedido(self.filtro.pedido);
          return;
        }

        if (angular.isDate(this.filtro.dataMin) && angular.isDate(this.filtro.dataMax)) {
          if (this.filtro.dataMin > this.filtro.dataMax) {
            $rootScope.alerta.show('A data final não pode ser menor que a inicial!', 'alert-danger');
            return;
          }
        }

        if (this.filtro.valorMax && this.filtro.valorMin) {
          if (this.filtro.valorMax < this.filtro.valorMin) {
            $rootScope.alerta.show('O valor máximo não pode ser menor que o mínimo!', 'alert-danger');
            return;
          }
        }

        getPedidos();
      };

      $scope.removeFiltros = function () {
        self.filtro = {
          pedido: '',
          cliente: {id: null, nome: null},
          vendedor: {id: null, nome: null},
          dataMin: null,
          dataMax: null,
          statusId: '',
          valorMin: null,
          valorMax: null
        };
      };

      $scope.buscarCliente = function () {
        modalBuscarPessoa.show('Cliente').then(function (result) {
          if (result) {
            self.filtro.cliente = result;
          }
        }, function (error) {

        });
      };

      $scope.removeCliente = function () {
        self.filtro.cliente = {id: null, nome: null};
      };

      $scope.buscarVendedor = function () {
        modalBuscarPessoa.show('Vendedor').then(function (result) {
          if (result) {
            self.filtro.vendedor = result;
          }
        }, function (error) {

        });
      };

      $scope.removeVendedor = function () {
        self.filtro.vendedor = {id: null, nome: null};
      };

      $scope.getStatusName = function (id) {
        for (var i = 0; i < $scope.statusArray.length; i++) {
          if ($scope.statusArray[i].id == id) {
            return $scope.statusArray[i].nome;
          }
        }

        return 'não disponível';
      };

    }]);
