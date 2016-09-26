/**
 * Created by egmpermissoes on 22/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('PermissoesUsuario', ['PERMISSOES', function(PERMISSOES) {

    function PermissoesUsuario(perfil) {
      var self = this;

      angular.forEach(perfil, function(modulo, chave_modulo) {
        self[chave_modulo] = modulo;
      });
    }

    PermissoesUsuario.converterEmEntrada = function(p) {
      var perfil = {}, permissoes = { };
      console.log(p);

      angular.forEach(PERMISSOES.modulo, function(modulo, chave_modulo) {
        permissoes = { };
        if (p.hasOwnProperty(modulo)) {
          angular.forEach(PERMISSOES.permissao, function (permissao, chave_permissao) {
            if (p[modulo].hasOwnProperty(permissao)) {
              switch (p[modulo][permissao].data_type) {
                case 'bool':
                  permissoes[chave_permissao] = p[modulo][permissao].value === 'Y';
                  break;

                case 'varchar':
                  permissoes[chave_permissao] = p[modulo][permissao].value;
                  break;

                case 'float':
                  permissoes[chave_permissao] = parseFloat(p[modulo][permissao].value);
                  break;

                default:
                  permissoes[chave_permissao] = null;
                  break;
              }

            }
          });
        }
        perfil[chave_modulo] = permissoes;
      });

      return perfil;
    };

    return PermissoesUsuario;

  }]);
