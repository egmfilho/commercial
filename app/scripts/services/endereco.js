/**
 * Created by egmfilho on 01/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('Endereco', [function() {

    function Endereco(endereco) {
      this.id = endereco ? endereco.id : '';
      this.cep = endereco ? endereco.cep : '';
      this.logradouro = endereco ? endereco.logradouro : '';
      this.bairro = endereco ? endereco.bairro : '';
      this.cidade = endereco ? endereco.cidade : '';
      this.ddd = endereco ? endereco.ddd : '';
      this.uf = endereco ? endereco.uf : '';
      this.numero = endereco ? endereco.numero : '';
    }

    Endereco.prototype = {

      setCEP: function (cep) {
        this.cep = cep.IdCep;
        this.logradouro = cep.Logradouro;
        this.bairro = cep.Bairro;
        this.cidade = cep.Cidade;
        this.ddd = cep.DDD;
        this.uf = cep.UF;
      }

    };

    Endereco.converterEmEntrada = function(e) {
      var endereco = { };

      endereco.id = e.IdCep;
      endereco.cep = e.CdCep;
      endereco.logradouro = e.Logradouro;
      endereco.bairro = e.Bairro;
      endereco.cidade = e.Cidade;
      endereco.ddd = e.DDD;
      endereco.uf = e.UF;
      endereco.numero = e.Numero;

      return endereco;
    };

    return Endereco;

  }]);
