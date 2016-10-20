/**
 * Created by egmfilho on 18/10/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('AtendimentoCtrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    'ProviderPedido',
    'Pedido',
    'ProviderAtendimento',
    'Parecer',
    'HistoricoAtendimento',
    'Atendimento',
    'ProviderStatusAtendimento',
    'StatusHistoricoAtendimento',
    'ProviderTipoContato',
    'TipoContato',
    'ProviderUsuario',
    'Usuario',
    function ($rootScope, $scope, $routeParams, $location, providerPedido, Pedido, providerAtendimento, Parecer, HistoricoAtendimento, Atendimento, providerStatusAtendimento, StatusHistoricoAtendimento, providerTipoContato, TipoContato, providerUsuario, Usuario) {

      var self = this;

      self.atendimento = new Atendimento();
      $scope.dt = new Date();

      self.dateOptions = {
        minDate: new Date(),
        showWeeks: false
      };

      $scope.novoParecer = new Parecer();
      $scope.novoHistorico = new HistoricoAtendimento();

      self.limparParecer = function() {
        if (confirm('Limpar parecer?')) {
          $scope.novoParecer = new Parecer();
        }
      };

      $scope.$on('$viewContentLoaded', function () {
        $rootScope.isLoading = true;

        if ($routeParams.action) {
          if (!$routeParams.code || !$routeParams.type) {
            $location.path('/');
            return;
          }

          switch ($routeParams.action) {
            case 'new':
              if ($routeParams.type === 'order') {
                getPedido($routeParams.code);
              } else {
                $location.path('/');
              }
              break;
            case 'open':
              if ($routeParams.type === 'order') {
                getAtendimentoPorPedido($routeParams.code)
              } else if ($routeParams.type === 'attendance') {
                getAtendimento($routeParams.code);
              } else {
                $location.path('/');
              }
              break;
            default:
              $location.path('/');
              break;
          }

          getStatusAtendimento();
          getTiposContato();
          getUsuarios();
        }
      });

      function getPedido(codigo) {
        $rootScope.isLoading = true;
        providerPedido.obterPedidoPorCodigo(codigo, null, null, null, true).then(function (success) {
          var pedido = new Pedido(Pedido.converterEmEntrada(success.data));
          console.log(pedido);
          if (pedido.atendimentoId) {
            $rootScope.alerta.show('Este pedido já possui um atendimento em aberto!', 'alert-danger');
            $location.path('/follow-up');
          }
          self.atendimento.setPedido(pedido);
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      function getAtendimento(codigo) {
        $rootScope.isLoading = true;
        providerAtendimento.obterPorCodigo(codigo, true, true, true, true).then(function (success) {
          self.atendimento = new Atendimento(Atendimento.converterEmEntrada(success.data));
          $scope.novoHistorico = new HistoricoAtendimento(self.atendimento.historico[0]);
          console.log(success.data, self.atendimento);
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      function getAtendimentoPorPedido(codigoPedido) {
        $rootScope.isLoading = true;
        providerAtendimento.obterPorCodigoPedido(codigoPedido, true, true, true, true).then(function (success) {
          self.atendimento = new Atendimento(Atendimento.converterEmEntrada(success.data));
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      function getStatusAtendimento() {
        self.statusArray = [];
        $rootScope.isLoading = true;
        providerStatusAtendimento.obterTodos().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.statusArray.push(new StatusHistoricoAtendimento(StatusHistoricoAtendimento.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      function getTiposContato() {
        self.tiposContato = [];
        $rootScope.isLoading = true;
        providerTipoContato.obterTodos().then(function(success) {
          angular.forEach(success.data, function(item, index) {
            self.tiposContato.push(new TipoContato(TipoContato.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        })
      }

      function getUsuarios() {
        self.usuarios = [];
        $rootScope.isLoading = true;
        providerUsuario.obterTodos().then(function (success) {
          angular.forEach(success.data, function(item, index) {
            self.usuarios.push(new Usuario(Usuario.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

    }]);
