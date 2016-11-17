/**
 * Created by egmfilho on 13/10/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('FollowUpCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    'Atendimento',
    'Usuario',
    'ProviderAtendimento',
    'ModalAtendimento',
    'ProviderStatusAtendimento',
    'StatusHistoricoAtendimento',
    'ModalBuscarPedido',
    'ModalBuscarPessoa',
    'ProviderUsuario',
    'DataSaida',
    function ($rootScope, $scope, $location, Atendimento, Usuario, providerAtendimento, modalAtendimento, providerStatus, StatusHistoricoAtendimento, modalBuscarPedido, modalBuscarPessoa, providerUsuario, DataSaida) {

      var self = this;

      $scope.$on('$viewContentLoaded', function () {
        getStatusAtendimento();
        getAtendimentos();
        getUsuarios();
      });

      self.showFiltros = false;

      $scope.pagination = {
        current: 1,
        max: 15,
        total: 0,
        mudarPagina: function () {
          if (self.filtro.pedido) {
            getAtendimentosPorCodigoDePedido(self.filtro.pedido);
          } else {
            getAtendimentos();
          }
        }
      };

      self.filtro = {
        atendimento: '',
        pedido: '',
        cliente: {id: null, nome: null},
        responsavel: null,
        data: 'nenhum',
        dataMin: null,
        dataMax: null,
        valorMin: null,
        valorMax: null,
        status: ''
      };

      function getAtendimentos() {
        self.atendimentos = [];
        $rootScope.loading.load();
        var limite = ($scope.pagination.current - 1) * $scope.pagination.max + ',' + $scope.pagination.max;
        providerAtendimento.obterTodos(true, true, true, true, self.filtro.status, self.filtro.cliente.id, self.filtro.responsavel, self.filtro.data, DataSaida.converter(self.filtro.dataMin), DataSaida.converter(self.filtro.dataMax), limite).then(function (success) {
          $scope.pagination.total = success.info.attendance_quantity;
          angular.forEach(success.data, function (item, index) {
            self.atendimentos.push(new Atendimento(Atendimento.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
          self.showFiltros = false;
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getAtendimentosPorCodigoDePedido(codigo) {
        self.atendimentos = [];
        $rootScope.loading.load();
        console.log(self.filtro.responsavel);
        var limite = ($scope.pagination.current - 1) * $scope.pagination.max + ',' + $scope.pagination.max;
        providerAtendimento.obterTodosPorCodigoPedido(codigo, true, true, true, true, self.filtro.status, self.filtro.responsavel, self.filtro.data, DataSaida.converter(self.filtro.dataMin), DataSaida.converter(self.filtro.dataMax), limite).then(function (success) {
          $scope.pagination.total = success.info.attendance_quantity;
          angular.forEach(success.data, function (item, index) {
            self.atendimentos.push(new Atendimento(Atendimento.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
          self.showFiltros = false;
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getAtendimento(codigo) {
        self.atendimentos = [];
        $rootScope.loading.load();
        providerAtendimento.obterPorCodigo(codigo, true, true, true, true).then(function (success) {
          self.atendimentos.push(new Atendimento(Atendimento.converterEmEntrada(success.data)));
          $rootScope.loading.unload();
          self.showFiltros = false;
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getUsuarios() {
        self.usuarios = [];
        $rootScope.loading.load();
        providerUsuario.obterTodos().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.usuarios.push(new Usuario(Usuario.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      this.filtrar = function () {
        if (this.filtro.atendimento) {
          getAtendimento(this.filtro.atendimento);
          return;
        }

        if (this.filtro.pedido) {
          getAtendimentosPorCodigoDePedido(this.filtro.pedido);
          return;
        }

        if (this.filtro.data === 'nenhum') {
          if (angular.isDate(this.filtro.dataMin) || angular.isDate(this.filtro.dataMax)) {
            $rootScope.alerta.show('Escolha um tipo de data', 'alert-danger');
            return;
          }
        } else {
          if (!angular.isDate(this.filtro.dataMin) && !angular.isDate(this.filtro.dataMax)) {
            $rootScope.alerta.show('Informe pelo menos uma das datas!', 'alert-danger');
            return;
          }

          if (angular.isDate(this.filtro.dataMin) && angular.isDate(this.filtro.dataMax)) {
            if (this.filtro.dataMax < this.filtro.dataMin) {
              $rootScope.alerta.show('A data final não pode ser menor que a inicial!', 'alert-danger');
              return;
            }
          }
        }

        if (this.filtro.valorMax && this.filtro.valorMin) {
          if (this.filtro.valorMax < this.filtro.valorMin) {
            $rootScope.alerta.show('O valor máximo não pode ser menor que o mínimo!', 'alert-danger');
            return;
          }
        }

        getAtendimentos();
      };

      function getStatusAtendimento() {
        self.statusArray = [];
        $rootScope.loading.load();
        providerStatus.obterTodos().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.statusArray.push(new StatusHistoricoAtendimento(StatusHistoricoAtendimento.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      this.atualizar = function () {
        getAtendimentos();
      };

      this.buscarPedido = function () {
        modalBuscarPedido.show().then(function (result) {
          if (result) {
            if (result.atendimentoId) {
              $location.path('/atendimento/open').search('type', 'order').search('code', result.codigo);
            } else {
              $location.path('/atendimento/new').search('type', 'order').search('code', result.codigo);
            }
          }
        });
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

      $scope.removeFiltros = function () {
        self.filtro = {
          atendimento: '',
          pedido: '',
          cliente: {id: null, nome: null},
          responsavel: null,
          data: 'nenhum',
          dataMin: null,
          dataMax: null,
          valorMin: null,
          valorMax: null,
          status: ''
        };
      };

    }]);
