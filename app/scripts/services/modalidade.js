/**
 * Created by egmfilho on 01/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('Modalidade', [function() {

    function Modalidade(m) {
      this.id = m ? m.id : '';
      this.codigo = m ? m.codigo : '';
      this.nome = m ? m.nome : '';
      this.desconto = m ? m.desconto : 0;
    }

    Modalidade.converterEmEntrada = function(m) {
      var modalidade = { };

      modalidade.id = m.IdPagamento;
      modalidade.codigo = m.CdPagamento;
      modalidade.nome = m.NmPagamento;
      modalidade.desconto = m.DscPagamento;

      return modalidade;
    };

    return Modalidade;

  }]);
