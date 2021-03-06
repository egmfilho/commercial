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
    'ProviderLoja',
    'Loja',
    'ModalConfirm',
    function ($rootScope, $scope, $routeParams, $location, providerPedido, Pedido, providerAtendimento, Parecer, providerHistorico, HistoricoAtendimento, Atendimento, providerStatusAtendimento, StatusHistoricoAtendimento, providerTipoContato, TipoContato, providerUsuario, Usuario, providerLoja, Loja, modalConfirm) {

      var self = this;

      self.atendimento = new Atendimento();
      $scope.dt = new Date();
      $scope.trancaLoja = false;

      self.dateOptions = {
        minDate: new Date(),
        showWeeks: false
      };

      self.emails = [];

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

      self.limparParecer = function () {
        modalConfirm.show('Aviso', 'Limpar parecer?').then(function() {
          $scope.novoParecer = new Parecer();
        });
      };

      $scope.$on('$viewContentLoaded', function () {
        if ($routeParams.action) {
          if ((!$routeParams.code && !$routeParams.codes) || !$routeParams.type) {
            $location.path('/');
            return;
          }

          getLojas();
          getStatusAtendimento();
          getTiposContato();
          getUsuarios();

          switch ($routeParams.action) {
            case 'new':
              if ($routeParams.type === 'order') {
                getPedido($routeParams.code);
              } else {
                voltar();
              }
              break;
            case 'open':
              if ($routeParams.type === 'order') {
                getAtendimentoPorPedido($routeParams.code)
              } else if ($routeParams.type === 'attendance') {
                getAtendimento($routeParams.code);
              } else {
                voltar();
              }
              break;
            case 'batch':
              if ($routeParams.type === 'order') {
                self.codigosArray = $routeParams.codes.split('x');
                self.vendedores = $routeParams.v;
                self.clientes = $routeParams.c;
                self.min = $routeParams.min;
                self.max = $routeParams.max;
              } else {
                voltar();
              }
              break;
            default:
              voltar();
              break;
          }
        }
      });

      function getLojas() {
        self.lojas = [];
        $rootScope.loading.load();
        providerLoja.obterTodos().then(function(success) {
          angular.forEach(success.data, function(item, index) {
            self.lojas.push(new Loja(Loja.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getPedido(codigo) {
        $rootScope.loading.load();
        providerPedido.obterPedidoPorCodigo(codigo, true, null, null, true).then(function (success) {
          var pedido = new Pedido(Pedido.converterEmEntrada(success.data));
          console.log(pedido);
          if (pedido.atendimentoId) {
            $rootScope.alerta.show('Este pedido já possui um atendimento em aberto!', 'alert-danger');
            voltar();
          }
          self.atendimento.setPedido(pedido);
          $scope.trancaLoja = self.atendimento.lojaId || false;
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
          if (error.status == 404) {
            voltar();
          }
        });
      }

      function getAtendimento(codigo) {
        $rootScope.loading.load();
        providerAtendimento.obterPorCodigo(codigo, true, true, true, true).then(function (success) {
          self.atendimento = new Atendimento(Atendimento.converterEmEntrada(success.data));
          $scope.trancaLoja = self.atendimento.lojaId || false;
          $scope.novoHistorico = new HistoricoAtendimento(self.atendimento.historico[0]);
          $scope.novoHistorico.proximoContato = new Date();
          if (self.atendimento.historico[0].statusId == 1001) {
            $scope.novoHistorico.statusId = !self.statusArray ? null : self.statusArray[1].id;
          }
          if ($scope.novoHistorico.spy) {
            angular.forEach($scope.novoHistorico.spy.split(';'), function (item, index) {
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
          if (error.status == 404) {
            voltar();
          }
        });
      }

      function getAtendimentoPorPedido(codigoPedido) {
        $rootScope.loading.load();
        providerAtendimento.obterPorCodigoPedido(codigoPedido, true, true, true, true).then(function (success) {
          self.atendimento = new Atendimento(Atendimento.converterEmEntrada(success.data));
          $scope.trancaLoja = self.atendimento.lojaId || false;
          $scope.novoHistorico = new HistoricoAtendimento(self.atendimento.historico[0]);
          if (self.atendimento.historico[0].statusId == 1001) {
            $scope.novoHistorico.statusId = !self.statusArray ? null : self.statusArray[1].id;
          }
          if ($scope.novoHistorico.spy) {
            angular.forEach($scope.novoHistorico.spy.split(';'), function (item, index) {
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
          if (error.status == 404) {
            voltar();
          }
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

      $scope.mostraStatus = function(status) {
        if (!self.atendimento.historico.length) {
          return status.id == 1001;
        } else {
          return status.id != 1001 && status.id != 1002;
        }
      };

      function getTiposContato() {
        self.tiposContato = [];
        $rootScope.loading.load();
        providerTipoContato.obterTodos().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.tiposContato.push(new TipoContato(TipoContato.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        })
      }

      function getUsuarios() {
        self.usuarios = [];
        $rootScope.loading.load();
        providerUsuario.obterTodos().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.usuarios.push(new Usuario(Usuario.converterEmEntrada(item)));
          });
          getContatos();
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getContatos() {
        self.contatos = [];

        angular.forEach(self.usuarios, function (item, index) {
          self.contatos.push({
            nome: self.usuarios[index].nome,
            email: self.usuarios[index].email
          });
        });
      }

      this.emailExterno = function (email) {
        return ({
          nome: 'Externo',
          email: email,
          isTag: true
        });
      };

      this.abrirParecer = function (parecer) {
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

      this.salvarParecer = function () {
        if (!self.codigosArray || !self.codigosArray.length) {
          if (!$scope.novoParecer.pessoaDeContato || !$scope.novoParecer.contatoId) {
            $rootScope.alerta.show('Preencha corretamente o parecer!', 'alert-danger');
            return;
          }
        }

        if (!$scope.novoParecer.texto) {
          $rootScope.alerta.show('Preencha corretamente o parecer!', 'alert-danger');
          return;
        }

        if (!self.atendimento.lojaId) {
          $rootScope.alerta.show('Informe a loja!', 'alert-danger');
          return;
        }

        jQuery('#modal-historico').modal('show');
      };

      this.encerrarAtendimento = function () {
        if (!self.atendimento.lojaId) {
          $rootScope.alerta.show('Informe a loja!', 'alert-danger');
          return;
        }

        jQuery('#modal-parecer-final').modal('show');
      };

      this.salvar = function (encerrar) {

        modalConfirm.show('Aviso', encerrar ? 'Deseja encerrar?' : 'Deseja salvar?').then(function() {
          var att = new Atendimento(self.atendimento);
          att.parecer = new Parecer($scope.novoParecer);
          att.parecer.atendimentoId = self.atendimento.id;
          att.historico = new HistoricoAtendimento($scope.novoHistorico);
          att.historico.spy = '';
          angular.forEach(self.emails, function (item, index) {
            att.historico.spy += item.nome + ':' + item.email + (index === (self.emails.length - 1) ? '' : ';');
          });

          if (encerrar) {
            att.historico.statusId = 1002;
          }

          if (self.codigosArray) {
            att.codigoPedido = self.codigosArray;
            att.historico.statusId = 1001;

            $rootScope.loading.load();
            providerAtendimento.adicionarEmLote(Atendimento.converterEmSaida(att)).then(function (success) {
              $rootScope.loading.unload();
              $rootScope.alerta.show('Atendimentos salvos', 'alert-success');
              voltar();
            }, function (error) {
              console.log(error);
              $rootScope.loading.unload();
              $rootScope.alerta.show('Não foi possível salvar os atendimentos.', 'alert-danger');
              jQuery('#modal-historico').modal('show');
            });

            return;
          }

          jQuery('#modal-historico').modal('hide');
          if (self.atendimento.id) {
            $rootScope.loading.load();
            providerAtendimento.editar(Atendimento.converterEmSaida(att)).then(function (success) {
              $rootScope.loading.unload();
              $rootScope.alerta.show('Salvo', 'alert-success');
              voltar();
            }, function (error) {
              console.log(error);
              $rootScope.loading.unload();
              $rootScope.alerta.show('Não foi possível salvar o atendimento.', 'alert-danger');
              jQuery('#modal-historico').modal('show');
            });
          } else {
            $rootScope.loading.load();
            providerAtendimento.adicionar(Atendimento.converterEmSaida(att)).then(function (success) {
              $rootScope.loading.unload();
              $rootScope.alerta.show('Salvo', 'alert-success');
              voltar();
            }, function (error) {
              console.log(error);
              $rootScope.loading.unload();
              $rootScope.alerta.show('Não foi possível salvar o atendimento.', 'alert-danger');
              jQuery('#modal-historico').modal('show');
            });
          }
        });
      };

      this.verItens = function(){
        $rootScope.loading.load();

        if(self.atendimento.pedido.items.length > 0){
            $rootScope.loading.unload();
            jQuery('#modalItensPedido').modal('show');
        }else {
          providerPedido.obterPedidoPorCodigo(this.atendimento.pedido.codigo, true, true, true, true, true, true).then(
            function (success){
              $rootScope.loading.unload();

              self.atendimento.pedido = new Pedido(Pedido.converterEmEntrada(success.data));

              jQuery('#modalItensPedido').modal('show');
            }, function (error){
              $rootScope.loading.unload();
              console.log(error);
            });
        }

      };

    }]);
