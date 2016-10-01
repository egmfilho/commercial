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

    //PermissoesUsuario.converterEmEntrada = function(p) {
    //  var perfil = {}, permissoes = { };
    //
    //  angular.forEach(p, function(modulo, chave_modulo) {
    //    permissoes = { };
    //    angular.forEach(modulo, function (permissao, chave_permissao) {
    //      switch (p[chave_modulo][chave_permissao].data_type) {
    //        case 'bool':
    //          permissoes[chave_permissao] = p[chave_modulo][chave_permissao].value === 'Y';
    //          break;
    //
    //        case 'varchar':
    //          permissoes[chave_permissao] = p[chave_modulo][chave_permissao].value;
    //          break;
    //
    //        case 'float':
    //          permissoes[chave_permissao] = parseFloat(p[chave_modulo][chave_permissao].value);
    //          break;
    //
    //        default:
    //          permissoes[chave_permissao] = null;
    //          break;
    //      }
    //    });
    //    perfil[chave_modulo] = permissoes;
    //  });
    //
    //  return perfil;
    //};

    PermissoesUsuario.converterEmEntrada = function(p) {
      var modulos = {}, modulo = {}, permissoes = {}, permissao = {};

      angular.forEach(p, function(module, key_module) {
        modulo = { nome: module.name };
        permissoes = { };
        angular.forEach(module, function(permission, key_permission) {
          permissao = { };
          if (permission.hasOwnProperty('data_type')) {
            permissao.nome = permission.name;
            permissao.tipo = permission.data_type;
            switch (permission.data_type) {
              case 'bool':
                    permissao.valor = permission.value === 'Y';
                    break;
              case 'varchar':
                    permissao.valor = permission.value;
                    break;
              case 'percent':
              case 'currency':
                    permissao.valor = parseFloat(permission.value);
                    break;
            }
            permissoes[key_permission] = permissao;
          }
          modulo.permissoes = permissoes;
        });

        modulos[key_module] = modulo;
      });

      return modulos;
    };

    PermissoesUsuario.converterEmSaida = function(permissoes) {
      var p = { };

      angular.forEach(permissoes, function(modulo, chave_modulo) {
        p[chave_modulo] = { };
        angular.forEach(modulo.permissoes, function(permissao, chave_permissao) {
          p[chave_modulo][chave_permissao] = permissao.valor;
        });
      });

      return p;
    };

    return PermissoesUsuario;

  }]);
