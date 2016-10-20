/**
 * Created by egmfilho on 29/09/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ConfiguracoesCtrl', [
    '$rootScope',
    '$scope',
    '$timeout',
    'ProviderUsuario',
    'Usuario',
    'ProviderPerfilUsuario',
    'PerfilUsuario',
    'ModalUsuario',
    'ModalPerfil',
    'ProviderConfig',
    'PermissoesUsuario',
    'ProviderStatusAtendimento',
    'StatusHistoricoAtendimento',
    'ProviderTipoContato',
    'TipoContato',
    function ($rootScope, $scope, $timeout, providerUsuario, Usuario, providerPerfil, PerfilUsuario, ModalUsuario, ModalPerfil, providerConfig, PermissoesUsuario, providerStatusAtendimento, StatusHistoricoAtendimento, providerTipoContato, TipoContato) {

      var self = this,
        width = parseInt(jQuery(window).width()),
        banner = 100,
        header = 60,
        footer = 60,
        height = jQuery(window).height() - banner - header - footer;

      self.statusAtendimento = new StatusHistoricoAtendimento();
      self.tipoContato = new TipoContato();

      self.usuariosPagination = {
        current: 1,
        max: 15,
        total: 0
      };

      self.perfisPagination = {
        current: 1,
        max: 15,
        total: 0
      };

      self.statusAtendimentoPagination = {
        current: 1,
        max: 15,
        total: 0
      };

      self.tipoContatoPagination = {
        current: 1,
        max: 15,
        total: 0
      };

      if (width >= 768) {
        jQuery('.controle').css('height', height + 'px');
        jQuery('.dashboard').css('height', height + 'px');
        jQuery('.logs').css('height', height + 'px');
      } else {
        self.usuariosPagination.max = 10;
        self.perfisPagination.max = 10;
        self.statusAtendimentoPagination.max = 10;
        self.tipoContatoPagination.max = 10;
      }

      $scope.$on('$viewContentLoaded', function () {
        // self.novoUsuario = new Usuario();
        getUsuarios();
        getPerfis();
        getPermissoes();
        getStatusAtendimentoArray();
        getTiposContato();
      });

      function getUsuarios() {
        $rootScope.isLoading = true;
        providerUsuario.obterTodos(true).then(function (success) {
          self.usuariosPagination.total = success.data.length;
          self.usuarios = [];
          angular.forEach(success.data, function (item, index) {
            self.usuarios.push(new Usuario(Usuario.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function (error) {
          $rootScope.isLoading = false;
        });
      }

      function getPerfis() {
        $rootScope.isLoading = true;
        providerPerfil.obterTodos().then(function (success) {
          self.perfisPagination.total = success.data.length;
          self.perfis = [];
          angular.forEach(success.data, function (item, index) {
            self.perfis.push(new PerfilUsuario(PerfilUsuario.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      function getPermissoes() {
        $rootScope.isLoading = true;
        providerConfig.obterPermissoes().then(function (success) {
          self.permissoes = new PermissoesUsuario(PermissoesUsuario.converterEmEntrada(success.data));
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      function getStatusAtendimentoArray() {
        $rootScope.isLoading = true;
        self.statusAtendimentoArray = [];
        providerStatusAtendimento.obterTodos().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.statusAtendimentoArray.push(new StatusHistoricoAtendimento(StatusHistoricoAtendimento.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      function getTiposContato() {
        $rootScope.isLoading = true;
        self.tiposContato = [];
        providerTipoContato.obterTodos().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.tiposContato.push(new TipoContato(TipoContato.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      this.atualizarUsuarios = function () {
        getUsuarios();
      };

      this.editarUsuario = function (usuario) {
        if (!self.perfis) {
          getPerfis();
        }

        $rootScope.isLoading = true;
        providerUsuario.obterPorId(usuario.id, true, true).then(function (success) {
          $rootScope.isLoading = false;
          ModalUsuario.show(new Usuario(Usuario.converterEmEntrada(success.data)), self.perfis).then(function (success) {
            self.atualizarUsuarios();
          });
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      this.adicionarUsuario = function () {
        if (!self.perfis) {
          getPerfis();
        }

        if (!self.permissoes) {
          getPermissoes();
        }

        ModalUsuario.show(new Usuario(), self.perfis, self.permissoes).then(function (success) {
          self.atualizarUsuarios();
        });
      };

      this.atualizarPerfis = function () {
        getPerfis();
      };

      this.editarPerfil = function (perfil) {
        $rootScope.isLoading = true;
        providerPerfil.obterPorId(perfil.id, true).then(function (success) {
          $rootScope.isLoading = false;
          ModalPerfil.show(new PerfilUsuario(PerfilUsuario.converterEmEntrada(success.data))).then(function (success) {
            self.atualizarPerfis();
          });
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      this.adicionarPerfil = function () {
        if (!self.permissoes) {
          getPermissoes();
        }

        ModalPerfil.show(new PerfilUsuario(), self.permissoes).then(function (success) {
          self.atualizarPerfis();
        });
      };

      this.excluirPerfil = function (perfil) {
        if (!confirm('Excluir perfil?')) {
          return;
        }

        $rootScope.isLoading = true;
        providerPerfil.excluir(perfil.id).then(function (success) {
          $rootScope.isLoading = false;
          self.atualizarPerfis();
          $rootScope.alerta.show('Perfil excluído!', 'alert-success');
          self.getPerfis();
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
          if (error.status === 420) {
            $rootScope.alerta.show('Não é possível excluir perfis em uso!', 'alert-danger');
          }
        });
      };

      this.atualizarStatusAtendimento = function () {
        getStatusAtendimentoArray();
      };

      this.editarStatusAtendimento = function (tipo) {
        self.statusAtendimento = new StatusHistoricoAtendimento(tipo);
        jQuery('#modalStatus').modal('show');
        $timeout(function () {
          jQuery('#modalStatus').find('input').focus().select();
        }, 500);
      };

      this.adicionarStatusAtendimento = function () {
        jQuery('#modalStatus').modal('show');
        $timeout(function () {
          jQuery('#modalStatus').find('input').focus();
        }, 500);
      };

      this.excluirStatusAtendimento = function (status) {
        if (!confirm('Excluir status?')) {
          return;
        }

        $rootScope.isLoading = true;
        providerStatusAtendimento.excluir(status.id).then(function(success) {
          $rootScope.isLoading = false;
          $rootScope.alerta.show('Status removido!', 'alert-success');
        }, function(error) {
          $rootScope.isLoading = false;
          console.log(error);
          if (error.status === 420) {
            $rootScope.alerta.show('Não é possível excluir um Status em uso!', 'alert-danger');
          }
        });
      };

      this.salvarStatusAtendimento = function () {
        if (!self.statusAtendimento.nome) {
          $rootScope.alerta.show('Insira um nome!', 'alert-danger');
          return;
        }

        $rootScope.isLoading = true;
        if (self.statusAtendimento.id) {
          providerStatusAtendimento.editar(StatusHistoricoAtendimento.converterEmSaida(self.statusAtendimento)).then(function(success) {
            $rootScope.isLoading = false;
            $rootScope.alerta.show('Status adicionado!', 'alert-success');
            jQuery('#modalStatus').modal('hide');
            self.statusAtendimento = new StatusHistoricoAtendimento();
          }, function(error) {
            console.log(error);
            $rootScope.isLoading = false;
            jQuery('#modalStatus').modal('hide');
            self.statusAtendimento = new StatusHistoricoAtendimento();
          });
        } else {
          providerStatusAtendimento.adicionar(StatusHistoricoAtendimento.converterEmSaida(self.statusAtendimento)).then(function (success) {
            $rootScope.isLoading = false;
            $rootScope.alerta.show('Status adicionado!', 'alert-success');
            jQuery('#modalStatus').modal('hide');
            self.statusAtendimento = new StatusHistoricoAtendimento();
          }, function (error) {
            console.log(error);
            $rootScope.isLoading = false;
            jQuery('#modalStatus').modal('hide');
            self.statusAtendimento = new StatusHistoricoAtendimento();
          });
        }
      };

      this.cancelarModalStatusAtendimento = function () {
        jQuery('#modalStatus').modal('hide');
        self.statusAtendimento = new StatusHistoricoAtendimento();
      };

      this.atualizarTiposContato = function () {
        getTiposContato();
      };

      this.editarTipoContato = function (tipo) {
        self.tipoContato = new TipoContato(tipo);
        jQuery('#modalTipoContato').modal('show');
        $timeout(function () {
          jQuery('#modalTipoContato').find('input').focus().select();
        }, 500);
      };

      this.adicionarTipoContato = function () {
        jQuery('#modalTipoContato').modal('show');
      };

      this.excluirTipoContato = function (tipo) {
        if (!confirm('Excluir tipo de contato?')) {
          return;
        }

        $rootScope.isLoading = true;
        providerTipoContato.excluir(tipo.id).then(function(success) {
          $rootScope.isLoading = false;
          $rootScope.alerta.show('Tipo de contato removido!', 'alert-success');
        }, function(error) {
          $rootScope.isLoading = false;
          console.log(error);
          if (error.status === 420) {
            $rootScope.alerta.show('Não é possível excluir tipos de contato em uso!', 'alert-danger');
          }
        });
      };

      this.salvarTipoContato = function () {
        if (!self.tipoContato.nome) {
          $rootScope.alerta.show('Insira um nome!', 'alert-danger');
          return;
        }

        $rootScope.isLoading = true;
        if (self.tipoContato.id) {
          providerTipoContato.editar(TipoContato.converterEmSaida(self.tipoContato)).then(function (success) {
            $rootScope.isLoading = false;
            $rootScope.alerta.show('Tipo de contato adicionado!', 'alert-success');
            jQuery('#modalTipoContato').modal('hide');
            self.tipoContato = new TipoContato();
          }, function (error) {
            console.log(error);
            $rootScope.isLoading = false;
            $rootScope.alerta.show('Não foi possível adicionar o tipo de contato!', 'alert-danger');
            jQuery('#modalTipoContato').modal('hide');
            self.tipoContato = new TipoContato();
          });
        } else {
          providerTipoContato.adicionar(TipoContato.converterEmSaida(self.tipoContato)).then(function (success) {
            $rootScope.isLoading = false;
            $rootScope.alerta.show('Tipo de contato adicionado!', 'alert-success');
            jQuery('#modalTipoContato').modal('hide');
            self.tipoContato = new TipoContato();
          }, function (error) {
            console.log(error);
            $rootScope.isLoading = false;
            $rootScope.alerta.show('Não foi possível adicionar o tipo de contato!', 'alert-danger');
            jQuery('#modalTipoContato').modal('hide');
            self.tipoContato = new TipoContato();
          });
        }
      };

      this.cancelarModalTipoContato = function () {
        jQuery('#modalTipoContato').modal('hide');
        self.tipoContato = new TipoContato();
      };

    }]);
