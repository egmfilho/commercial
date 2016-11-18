/**
 * Created by egmfilho on 01/10/16.
 */

'use strict';

angular.module('commercialApp.services')
  .provider('ProviderConfig', ['URLS', function (urls) {

    var url = urls.root + 'config.php?action=:action',
      provider = null;

    this.$get = ['$resource', function ($resource) {
      provider = $resource(url, {}, {
        get: {
          method: 'GET'
        }
      });

      return {
        obterPermissoes: function () {
          return provider.get({
            action: 'getJsonAccess'
          }).$promise;
        },

        obterConexao: function () {
          return provider.get({
            action: 'getSqlConfig'
          }).$promise;
        },

        obterStatusPedido: function() {
          return provider.get({
            action: 'getOrderStatus'
          }).$promise;
        },

        configurarConexao: function (host, database, username, password) {
          return provider.save({
            action: 'editSQL'
          }, {
            sql_host: host,
            sql_data_base: database,
            sql_user_name: username,
            sql_password: password
          }).$promise;
        },

        testarConexao: function (host, database, username, password) {
          return provider.save({
            action: 'sqlConnTest'
          }, {
            sql_host: host,
            sql_data_base: database,
            sql_user_name: username,
            sql_password: password
          }).$promise;
        },

        obterEmail: function () {
          return provider.get({
            action: 'getMailConfig'
          }).$promise;
        },

        configurarEmail: function (host, porta, smtp, sender, email, password) {
          return provider.save({
            action: 'editMail'
          }, {
            mail_host: host,
            mail_port: porta,
            mail_smtp: smtp,
            mail_sender: sender,
            mail_mail: email,
            mail_password: password
          }).$promise;
        },

        testarEmail: function(host, porta, smtp, sender, email, password) {
          return provider.save({
            action: 'mailConnTest'
          }, {
            mail_host: host,
            mail_port: porta,
            mail_smtp: smtp,
            mail_sender: sender,
            mail_mail: email,
            mail_password: password
          }).$promise;
        }
      };

    }];
  }]);
