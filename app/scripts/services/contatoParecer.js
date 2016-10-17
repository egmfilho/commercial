/**
 * Created by egmfilho on 14/10/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ContatoParecer', [function () {

    function ContatoParecer(contato) {
      this.id = contato ? contato.id : '';
      this.nome = contato ? contato.nome : '';
      this.dataCadastro = contato ? contato.dataCadastro : new Date();
      this.dataUpdate = contato ? contato.dataUpdate : null;
    }

    ContatoParecer.converterEmEntrada = function (contact) {
      var contato = {};

      contato.id = contact.contact_type_id;
      contato.nome = contact.contact_type_name;
      contato.dataCadastro = new Date(contact.contact_type_date);
      contato.dataUpdate = new Date(contact.contact_type_update);

      return contato;
    };

    ContatoParecer.converterEmSaida = function(contato) {
      var contact = {};

      contact.contact_type_id = contato.id;
      contact.contact_type_name = contato.nome;

      return contact;
    };

    return ContatoParecer;

  }]);
