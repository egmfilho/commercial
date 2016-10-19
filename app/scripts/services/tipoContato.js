/**
 * Created by egmfilho on 13/10/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('TipoContato', [function () {

    function TipoContato(tipo) {
      this.id = tipo ? tipo.id : '';
      this.codigo = tipo ? tipo.codigo : '';
      this.nome = tipo ? tipo.nome : '';
      this.dataCadastro = tipo ? tipo.dataCadastro : new Date();
      this.dataUpdate = tipo ? tipo.dataUpdate : new Date();
    }

    TipoContato.converterEmEntrada = function(type) {
      var tipo = { };

      tipo.id = type.contact_type_id;
      tipo.codigo = type.contact_type_code;
      tipo.nome = type.contact_type_name;
      tipo.dataCadastro = new Date(type.contact_type_date);
      tipo.dataUpdate = type.contact_type_update ? new Date(type.contact_type_update) : null;

      return tipo;
    };

    TipoContato.converterEmSaida = function(tipo) {
      var type = { };

      type.contact_type_id = tipo.id;
      type.contact_type_name = tipo.nome;

      return type;
    };

    return TipoContato;

  }]);
