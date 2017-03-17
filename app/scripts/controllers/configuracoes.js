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
    'ModalConfirm',
    function ($rootScope, $scope, $timeout, providerUsuario, Usuario, providerPerfil, PerfilUsuario, ModalUsuario, ModalPerfil, providerConfig, PermissoesUsuario, providerStatusAtendimento, StatusHistoricoAtendimento, providerTipoContato, TipoContato, modalConfirm) {

      var self = this,
        width = parseInt(jQuery(window).width()),
        banner = 0, //100,
        header = 50, //60,
        footer = 50,
        height = jQuery(window).height() - banner - header - footer;

      self.statusAtendimento = new StatusHistoricoAtendimento();
      self.tipoContato = new TipoContato();

      self.email = {};
      self.email.smtp = false;
      self.conexao = {};

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
        jQuery('.botao').css('height', (height / 5) + 'px');
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
        getEmail();
        getConexao();
        getMensagemOrcamento();
      });

      function getUsuarios() {
        $rootScope.loading.load();
        providerUsuario.obterTodos(true).then(function (success) {
          self.usuariosPagination.total = success.data.length;
          self.usuarios = [];
          angular.forEach(success.data, function (item, index) {
            self.usuarios.push(new Usuario(Usuario.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          $rootScope.loading.unload();
        });
      }

      function getPerfis() {
        $rootScope.loading.load();
        providerPerfil.obterTodos().then(function (success) {
          self.perfisPagination.total = success.data.length;
          self.perfis = [];
          angular.forEach(success.data, function (item, index) {
            self.perfis.push(new PerfilUsuario(PerfilUsuario.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getPermissoes() {
        $rootScope.loading.load();
        providerConfig.obterPermissoes().then(function (success) {
          self.permissoes = new PermissoesUsuario(PermissoesUsuario.converterEmEntrada(success.data));
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getStatusAtendimentoArray() {
        $rootScope.loading.load();
        self.statusAtendimentoArray = [];
        providerStatusAtendimento.obterTodos().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.statusAtendimentoArray.push(new StatusHistoricoAtendimento(StatusHistoricoAtendimento.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getTiposContato() {
        $rootScope.loading.load();
        self.tiposContato = [];
        providerTipoContato.obterTodos().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.tiposContato.push(new TipoContato(TipoContato.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getEmail() {
        $rootScope.loading.load();
        providerConfig.obterEmail().then(function (success) {
          self.email = {
            host: success.data.mail.mail_host,
            email: success.data.mail.mail_mail,
            senha: atob(success.data.mail.mail_password),
            porta: success.data.mail.mail_port,
            remetente: success.data.mail.mail_sender,
            smtp: success.data.mail.mail_smtp === 'Y',
            status: 'sucesso'
          };
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          self.email = {
            status: 'falha'
          };
          $rootScope.loading.unload();
        });
      }

      function getConexao() {
        $rootScope.loading.load();
        providerConfig.obterConexao().then(function (success) {
          self.conexao = {
            database: success.data.sql.sql_data_base,
            host: success.data.sql.sql_host,
            usuario: success.data.sql.sql_user_name,
            senha: atob(success.data.sql.sql_password),
            status: 'sucesso'
          };
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          self.conexao = {
            status: 'falha'
          };
          $rootScope.loading.unload();
        });
      }

      function getMensagemOrcamento() {
        $rootScope.loading.load();
        providerConfig.obterMensagemOrcamento().then(function(success) {
          self.mensagemOrcamento = success.data.order_message;
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      this.atualizarUsuarios = function () {
        getUsuarios();
      };

      this.editarUsuario = function (usuario) {
        if (!self.perfis) {
          getPerfis();
        }

        $rootScope.loading.load();
        providerUsuario.obterPorId(usuario.id, true, true).then(function (success) {
          $rootScope.loading.unload();
          ModalUsuario.show(new Usuario(Usuario.converterEmEntrada(success.data)), self.perfis).then(function (success) {
            self.atualizarUsuarios();
          });
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
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

      this.excluirUsuario = function (usuario) {
        modalConfirm.show('Aviso', 'Excluir usuario?').then(function() {
          $rootScope.loading.load();
          providerUsuario.excluir(usuario.id).then(function (success) {
            $rootScope.loading.unload();
            self.atualizarUsuarios();
            $rootScope.alerta.show('Usuário excluído!', 'alert-success');
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
            if (error.status === 420) {
              $rootScope.alerta.show(error.data.status.description, 'alert-danger');
            } else {
              $rootScope.alerta.show('Não foi possível excluir o usuário', 'alert-danger');
            }
          });
        });
      };

      this.atualizarPerfis = function () {
        getPerfis();
      };

      this.editarPerfil = function (perfil) {
        $rootScope.loading.load();
        providerPerfil.obterPorId(perfil.id, true).then(function (success) {
          $rootScope.loading.unload();
          ModalPerfil.show(new PerfilUsuario(PerfilUsuario.converterEmEntrada(success.data))).then(function (success) {
            self.atualizarPerfis();
          });
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
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
        modalConfirm.show('Aviso', 'Excluir perfil?').then(function() {
          $rootScope.loading.load();
          providerPerfil.excluir(perfil.id).then(function (success) {
            $rootScope.loading.unload();
            self.atualizarPerfis();
            $rootScope.alerta.show('Perfil excluído!', 'alert-success');
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
            if (error.status === 420) {
              $rootScope.alerta.show('Não é possível excluir perfis em uso!', 'alert-danger');
            }
          });
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
        modalConfirm.show('Aviso', 'Excluir status?').then(function() {
          $rootScope.loading.load();
          providerStatusAtendimento.excluir(status.id).then(function (success) {
            $rootScope.loading.unload();
            $rootScope.alerta.show('Status removido!', 'alert-success');
          }, function (error) {
            $rootScope.loading.unload();
            console.log(error);
            if (error.status === 420) {
              $rootScope.alerta.show('Não é possível excluir um Status em uso!', 'alert-danger');
            }
          });
        });
      };

      this.salvarStatusAtendimento = function () {
        if (!self.statusAtendimento.nome) {
          $rootScope.alerta.show('Insira um nome!', 'alert-danger');
          return;
        }

        $rootScope.loading.load();
        if (self.statusAtendimento.id) {
          providerStatusAtendimento.editar(StatusHistoricoAtendimento.converterEmSaida(self.statusAtendimento)).then(function (success) {
            $rootScope.loading.unload();
            $rootScope.alerta.show('Status editado!', 'alert-success');
            jQuery('#modalStatus').modal('hide');
            self.statusAtendimento = new StatusHistoricoAtendimento();
            self.atualizarStatusAtendimento();
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
            jQuery('#modalStatus').modal('hide');
            self.statusAtendimento = new StatusHistoricoAtendimento();
          });
        } else {
          providerStatusAtendimento.adicionar(StatusHistoricoAtendimento.converterEmSaida(self.statusAtendimento)).then(function (success) {
            $rootScope.loading.unload();
            $rootScope.alerta.show('Status adicionado!', 'alert-success');
            jQuery('#modalStatus').modal('hide');
            self.statusAtendimento = new StatusHistoricoAtendimento();
            self.atualizarStatusAtendimento();
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
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
        modalConfirm.show('Aviso', 'Excluir tipo de contato?').then(function() {
          $rootScope.loading.load();
          providerTipoContato.excluir(tipo.id).then(function (success) {
            $rootScope.loading.unload();
            $rootScope.alerta.show('Tipo de contato removido!', 'alert-success');
          }, function (error) {
            $rootScope.loading.unload();
            console.log(error);
            if (error.status === 420) {
              $rootScope.alerta.show('Não é possível excluir tipos de contato em uso!', 'alert-danger');
            }
          });
        });
      };

      this.salvarTipoContato = function () {
        if (!self.tipoContato.nome) {
          $rootScope.alerta.show('Insira um nome!', 'alert-danger');
          return;
        }

        $rootScope.loading.load();
        if (self.tipoContato.id) {
          providerTipoContato.editar(TipoContato.converterEmSaida(self.tipoContato)).then(function (success) {
            $rootScope.loading.unload();
            $rootScope.alerta.show('Tipo de contato editado!', 'alert-success');
            jQuery('#modalTipoContato').modal('hide');
            self.tipoContato = new TipoContato();
            self.atualizarTiposContato();
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
            $rootScope.alerta.show('Não foi possível adicionar o tipo de contato!', 'alert-danger');
            jQuery('#modalTipoContato').modal('hide');
            self.tipoContato = new TipoContato();
          });
        } else {
          providerTipoContato.adicionar(TipoContato.converterEmSaida(self.tipoContato)).then(function (success) {
            $rootScope.loading.unload();
            $rootScope.alerta.show('Tipo de contato adicionado!', 'alert-success');
            jQuery('#modalTipoContato').modal('hide');
            self.tipoContato = new TipoContato();
            self.atualizarTiposContato();
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
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

      this.salvarEmail = function () {
        if (!this.email.host || !this.email.porta || !this.email.remetente || !this.email.email || !this.email.senha) {
          $rootScope.alerta.show('Preencha corretamente as informações de email!', 'alert-danger');
          return;
        }

        $rootScope.loading.load();
        this.email.status = 'testando';
        providerConfig.configurarEmail(this.email.host, this.email.porta, this.email.smtp ? 'Y' : 'N', this.email.remetente, this.email.email, btoa(this.email.senha)).then(function (success) {
          self.email.status = 'sucesso';
          self.email.retorno = 'Configuração bem sucedida!';
          $rootScope.loading.unload();
          $rootScope.alerta.show('Configurações de email salvas!', 'alert-success');
        }, function (error) {
          console.log(error);
          self.email.status = 'falha';
          self.email.retorno = error.data.status.description;
          $rootScope.loading.unload();
        });
      };

      this.testarEmail = function () {
        if (!this.email.host || !this.email.porta || !this.email.remetente || !this.email.email || !this.email.senha) {
          $rootScope.alerta.show('Preencha corretamente as informações de email!', 'alert-danger');
          return;
        }

        $rootScope.loading.load();
        this.email.status = 'testando';
        providerConfig.testarEmail(this.email.host, this.email.porta, this.email.smtp ? 'Y' : 'N', this.email.remetente, this.email.email, btoa(this.email.senha)).then(function (success) {
          self.email.status = 'sucesso';
          self.email.retorno = 'Configuração bem sucedida!';
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          self.email.status = 'falha';
          self.email.retorno = error.data.status.description;
          $rootScope.loading.unload();
        });
      };

      this.testarConexao = function () {
        if (!this.conexao.host || !this.conexao.database || !this.conexao.usuario || !this.conexao.senha) {
          $rootScope.alerta.show('Preencha corretamente as informações de conexão!', 'alert-danger');
          return;
        }

        $rootScope.loading.load();
        this.conexao.status = 'testando';
        providerConfig.testarConexao(this.conexao.host, this.conexao.database, this.conexao.usuario, btoa(this.conexao.senha)).then(function(success) {
          self.conexao.status = 'sucesso';
          self.conexao.retorno = 'Conexão bem sucedida!';
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          self.conexao.status = 'falha';
          self.conexao.retorno = error.data.status.description;
          $rootScope.loading.unload();
        });
      };

      this.salvarConexao = function () {
        if (!this.conexao.host || !this.conexao.database || !this.conexao.usuario || !this.conexao.senha) {
          $rootScope.alerta.show('Preencha corretamente as informações de conexão!', 'alert-danger');
          return;
        }

        $rootScope.loading.load();
        this.conexao.status = 'testando';
        providerConfig.configurarConexao(this.conexao.host, this.conexao.database, this.conexao.usuario, btoa(this.conexao.senha)).then(function (success) {
          self.conexao.status = 'sucesso';
          $rootScope.loading.unload();
          $rootScope.alerta.show('Configurações de conexão salvas!', 'alert-success');
        }, function (error) {
          console.log(error);
          self.conexao.retorno = self.conexao.retorno = error.data.status.description;
          self.conexao.status = 'falha';
          $rootScope.loading.unload();
        });
      };

      this.salvarMensagemOrcamento = function() {
        $rootScope.loading.load();
        providerConfig.salvarMensagemOrcamento(self.mensagemOrcamento).then(function(success) {
          $rootScope.alerta.show('Mensagem salva!', 'alert-success');
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

    }]);
