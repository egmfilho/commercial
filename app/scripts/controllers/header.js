/**
 * Created by egmfilho on 03/10/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('HeaderCtrl', ['$rootScope', '$cookies', 'ProviderUsuario', function($rootScope, $cookies, provider) {

    var self = this,
        user = $cookies.get('currentUser') ? JSON.parse(window.atob($cookies.get('currentUser'))) : null;

    this.novaSenha = '';
    this.novaSenhaConfirm = '';

    this.getCurrentUser = function() {
      if (!$cookies.get('currentUser')) {
        user = null;
        return;
      }

      if (!user) {
        user = JSON.parse(window.atob($cookies.get('currentUser')));
      }

      return {
        nome: user.nome,
        usuario: user.usuario,
        email: user.email,
        perfil: user.perfil.nome,
        loja: user.loja.shop_name,
        precos: user.precos.price_name
      };
    };

    this.abrirModalSenha = function() {
      jQuery('#modalSenha').modal('show');
    };

    this.cancelarModalSenha = function() {
      jQuery('#modalSenha').modal('hide');
      this.novaSenha = '';
      this.novaSenhaConfirm = '';
    };

    this.salvarModalSenha = function() {
      if (this.novaSenha !== this.novaSenhaConfirm) {
        $rootScope.alerta.show('As senhas não conferem!', 'alert-danger');
        return;
      }

      $rootScope.loading.load();
      provider.novaSenha(JSON.parse(window.atob($cookies.get('currentUser'))).id, self.novaSenha).then(function(success) {
        jQuery('#modalSenha').modal('hide');
        self.novaSenha = '';
        self.novaSenhaConfirm = '';
        $rootScope.loading.unload();
        $rootScope.alerta.show('Senha alterada!', 'alert-success');
      }, function(error) {
        console.log(error);
        $rootScope.loading.unload();
      });
    };

  }]);
