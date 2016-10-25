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
    'ProviderHistoricoAtendimento',
    'HistoricoAtendimento',
    'Atendimento',
    'ProviderStatusAtendimento',
    'StatusHistoricoAtendimento',
    'ProviderTipoContato',
    'TipoContato',
    'ProviderUsuario',
    'Usuario',
    function ($rootScope, $scope, $routeParams, $location, providerPedido, Pedido, providerAtendimento, Parecer, providerHistorico, HistoricoAtendimento, Atendimento, providerStatusAtendimento, StatusHistoricoAtendimento, providerTipoContato, TipoContato, providerUsuario, Usuario) {

      var self = this;

      self.atendimento = new Atendimento();
      $scope.dt = new Date();

      self.dateOptions = {
        minDate: new Date(),
        showWeeks: false
      };

      self.emails = [ ];

      $scope.novoParecer = new Parecer();
      $scope.novoHistorico = new HistoricoAtendimento();

      $scope.formularios = {
        info: true,
        parecer: false,
        historico: false
      };

      $scope.scrollTo = function ($event) {
        var container = jQuery('body'),
            scrollTo = jQuery($event.currentTarget);

        container.animate({
          scrollTop: scrollTo.offset().top - 20// - container.offset().top + container.scrollTop()
        });
      };

      self.limparParecer = function() {
        if (confirm('Limpar parecer?')) {
          $scope.novoParecer = new Parecer();
        }
      };

      $scope.$on('$viewContentLoaded', function () {
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
        $rootScope.loading.load();
        providerPedido.obterPedidoPorCodigo(codigo, null, null, null, true).then(function (success) {
          var pedido = new Pedido(Pedido.converterEmEntrada(success.data));
          console.log(pedido);
          if (pedido.atendimentoId) {
            $rootScope.alerta.show('Este pedido já possui um atendimento em aberto!', 'alert-danger');
            $location.path('/follow-up');
          }
          self.atendimento.setPedido(pedido);
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getAtendimento(codigo) {
        $rootScope.loading.load();
        providerAtendimento.obterPorCodigo(codigo, true, true, true, true).then(function (success) {
          self.atendimento = new Atendimento(Atendimento.converterEmEntrada(success.data));
          $scope.novoHistorico = new HistoricoAtendimento(self.atendimento.historico[0]);
          if ($scope.novoHistorico.spy) {
            angular.forEach($scope.novoHistorico.spy.split(';'), function(item, index) {
              if (item) {
                self.emails.push({
                  nome: item.split(':')[0],
                  email: item.split(':')[1]
                });
              }
            });
          }
          console.log(success.data, self.atendimento);
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getAtendimentoPorPedido(codigoPedido) {
        $rootScope.loading.load();
        providerAtendimento.obterPorCodigoPedido(codigoPedido, true, true, true, true).then(function (success) {
          self.atendimento = new Atendimento(Atendimento.converterEmEntrada(success.data));
          $scope.novoHistorico = new HistoricoAtendimento(self.atendimento.historico[0]);
          if ($scope.novoHistorico.spy) {
            angular.forEach($scope.novoHistorico.spy.split(';'), function(item, index) {
              if (item) {
                self.emails.push({
                  nome: item.split(':')[0],
                  email: item.split(':')[1]
                });
              }
            });
          }
          console.log(success.data, self.atendimento);
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getStatusAtendimento() {
        self.statusArray = [];
        $rootScope.loading.load();
        providerStatusAtendimento.obterTodos().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.statusArray.push(new StatusHistoricoAtendimento(StatusHistoricoAtendimento.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getTiposContato() {
        self.tiposContato = [];
        $rootScope.loading.load();
        providerTipoContato.obterTodos().then(function(success) {
          angular.forEach(success.data, function(item, index) {
            self.tiposContato.push(new TipoContato(TipoContato.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        })
      }

      function getUsuarios() {
        self.usuarios = [];
        $rootScope.loading.load();
        providerUsuario.obterTodos().then(function (success) {
          angular.forEach(success.data, function(item, index) {
            self.usuarios.push(new Usuario(Usuario.converterEmEntrada(item)));
          });
          getContatos();
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getContatos() {
        self.contatos = [];

        angular.forEach(self.usuarios, function(item, index) {
          self.contatos.push({
            nome: self.usuarios[index].nome,
            email: self.usuarios[index].email
          });
        });
      }

      this.emailExterno = function(email) {
        return ({
          nome: 'Externo',
          email: email,
          isTag: true
        });
      };

      this.abrirParecer = function(parecer) {
        $scope.parecerCompleto = new Parecer(parecer);
        jQuery('#modal-parecer-completo').modal('show');
      };

      function voltar() {
        jQuery('.modal-backdrop').css('display', 'none');
        $location.search('action', null);
        $location.search('type', null);
        $location.search('code', null);
        $location.path('/follow-up');
      }

      this.salvarParecer = function() {
        if (!$scope.novoParecer.texto || !$scope.novoParecer.pessoaDeContato || !$scope.novoParecer.contatoId) {
          $rootScope.alerta.show('Preencha corretamente o parecer!', 'alert-danger');
          return;
        }

        jQuery('#modal-historico').modal('show');
      };

      this.encerrarAtendimento = function() {
        jQuery('#modal-parecer-final').modal('show');
      };

      this.salvar = function (encerrar) {

        if (!confirm(encerrar ? 'Encerrar?' : 'Salvar?')) {
          return;
        }

        var att = new Atendimento(self.atendimento);
        att.parecer = new Parecer($scope.novoParecer);
        att.parecer.atendimentoId = self.atendimento.id;
        att.historico = new HistoricoAtendimento($scope.novoHistorico);
        att.historico.spy = '';
        angular.forEach(self.emails, function(item, index) {
          att.historico.spy += item.nome + ':' + item.email + (index  === (self.emails.length - 1) ? '' : ';');
        });

        if (encerrar) {
          att.historico.statusId = 1002;
        }

        console.log(Atendimento.converterEmSaida(att));

        jQuery('#modal-historico').modal('hide');
        if (self.atendimento.id) {
          $rootScope.loading.load();
          providerAtendimento.editar(Atendimento.converterEmSaida(att)).then(function(success) {
            $rootScope.loading.unload();
            $rootScope.alerta.show('Salvo', 'alert-success');
            voltar();
          }, function(error) {
            console.log(error);
            $rootScope.loading.unload();
            $rootScope.alerta.show('Não foi possível salvar o atendimento.', 'alert-danger');
            jQuery('#modal-historico').modal('show');
          });
        } else {
          $rootScope.loading.load();
          providerAtendimento.adicionar(Atendimento.converterEmSaida(att)).then(function(success) {
            $rootScope.loading.unload();
            $rootScope.alerta.show('Salvo', 'alert-success');
            voltar();
          }, function(error) {
            console.log(error);
            $rootScope.loading.unload();
            $rootScope.alerta.show('Não foi possível salvar o atendimento.', 'alert-danger');
            jQuery('#modal-historico').modal('show');
          });
        }
      };

    }]);
