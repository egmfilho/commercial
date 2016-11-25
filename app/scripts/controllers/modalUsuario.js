/**
 * Created by egmfilho on 30/09/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ModalUsuarioCtrl', [
    '$rootScope',
    '$scope',
    '$cookies',
    '$uibModalInstance',
    'ProviderUsuario',
    'ProviderLoja',
    'ProviderTabelaPrecos',
    'ModalAlert',
    'Usuario',
    'usuario',
    'perfis',
    'permissoes',
    function ($rootScope, $scope, $cookies, $uibModalInstance, provider, providerLoja, providerTabelaPrecos, modalAlert, Usuario, usuario, perfis, permissoes) {

      var self = this,
          currentUser = $cookies.get('currentUser') ? JSON.parse(window.atob($cookies.get('currentUser'))) : null;

      self.usuario = new Usuario();

      $scope.tranca = function() {
        if (self.usuario.id == 1001) {
          return !(currentUser.id == 1001);
        } else {
          return false;
        }
      };

      $uibModalInstance.opened.then(function () {
        self.usuario = new Usuario(usuario);
        console.log(self.usuario);
        self.perfis = perfis; // para usar no select
        if (!self.usuario.perfil.permissoes) {
          self.usuario.perfil.permissoes = permissoes;
        }
        getLojas();
        getTabelaPrecos();
      });

      function getLojas() {
        $rootScope.loading.load();
        self.lojas = [ ];
        providerLoja.obterTodos().then(function(success) {
          angular.forEach(success.data, function(item, index) {
            self.lojas.push({
              id: item.shop_id.toString(),
              nome: item.shop_name
            });
          });
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getTabelaPrecos() {
        $rootScope.loading.load();
        self.tabelaPrecos = [ ];
        providerTabelaPrecos.obterTodos().then(function(success) {
          angular.forEach(success.data, function(item, index) {
            self.tabelaPrecos.push({
              id: item.price_id.toString(),
              nome: item.price_name
            });
          });
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }


      function validarCadastro() {
        if (!self.usuario.nome) {
          $rootScope.alerta.show('Preencha o nome do usuário!');
          return false;
        }

        if (!self.usuario.usuario) {
          $rootScope.alerta.show('Preencha o nome de usuário!');
          return false;
        } else if (self.usuario.usuario.length < 6) {
          $rootScope.alerta.show('Usuário precisa ter no mínimo 6 caracteres!');
          return false;
        } else if (/[^0-9^a-z^A-Z^_]/g.test(self.usuario.usuario)) {
          $rootScope.alerta.show('Caracteres inválidos no nome de usuário!');
          return false;
        }

        if (!self.usuario.id) {
          if (!self.usuario.senha || !self.senhaCheck) {
            $rootScope.alerta.show('Preencha a senha do usuário!');
            return false;
          } else if(self.usuario.senha.length < 6) {
            $rootScope.alerta.show('Senha precisa ter no mínimo 6 caracteres!');
            return false;
          } else if (self.usuario.senha !== self.senhaCheck) {
            $rootScope.alerta.show('As senhas não conferem!');
            return false;
          }
        }

        if (!self.usuario.perfilId) {
          $rootScope.alerta.show('Selecione um perfil!');
          return false;
        }

        return true;
      }

      //$scope.excluir = function () {
      //  $rootScope.loading.load();
      //  provider.excluir(self.usuario.id).then(function (success) {
      //    $rootScope.loading.unload();
      //    $uibModalInstance.close('Usuário excluído!');
      //  }, function (error) {
      //    console.log(error);
      //    $rootScope.loading.unload();
      //  });
      //};

      $scope.salvar = function () {
        if (!validarCadastro()) {
          return;
        }

        console.log(Usuario.converterEmSaida(self.usuario));

        $rootScope.loading.load();
        if (self.usuario.id) {
          provider.editar(Usuario.converterEmSaida(self.usuario)).then(function (success) {
            $rootScope.loading.unload();
            // $rootScope.alerta.show('Usuário "' + self.usuario.usuario + '" editado!', 'alert-success');
            modalAlert.show('Editado!', 'Alterações de usuário terão efeito na próxima vez que o login for realizado.');
            $uibModalInstance.close(true);
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
            if (error.status === 420) {
              $rootScope.alerta.show('Nome de usuário ja registrado!', 'alert-danger');
            }
          });
        } else {
          provider.adicionar(Usuario.converterEmSaida(self.usuario)).then(function (success) {
            $rootScope.loading.unload();
            $rootScope.alerta.show('Usuário registrado com sucesso!', 'alert-success');
            $uibModalInstance.close(true);
          }, function (error) {
            console.log(error);
            $rootScope.loading.unload();
            if (error.status === 420) {
              $rootScope.alerta.show('Nome de usuário ja registrado!', 'alert-danger');
            }
          });
        }
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };
    }
  ]);
