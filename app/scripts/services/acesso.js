/**
 * Created by egmfilho on 22/09/16.
 */

'use strict';

angular.module('commercialApp.services')
 .factory('Acesso', [function() {

    function Acesso(acesso) {
      this.nome = acesso ? acesso.nome : '';
      this.valor = acesso ? acesso.valor : '';
    }

    Acesso.converterEmEntrada = function(a) {
      var acesso = { };

      acesso.nome = a.user_profile_access_name || '';

      switch (a.user_profile_access_data_type) {
        case 'char':
          acesso.valor = a.user_profile_access_value === 'Y';
          break;

        case 'varchar':
          acesso.valor = a.user_profile_access_value;
          break;

        case 'float':
          acesso.valor = parseFloat(a.user_profile_access_value);
          break;

        default:
          acesso.valor = null;
          break;
      }

      return acesso;
    };

    return Acesso;

  }]);
