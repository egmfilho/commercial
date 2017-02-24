/**
 * Created by egmfilho on 24/02/17.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('PrazoPagamento', ['FormaPagamento', function(FormaPagamento) {

    function PrazoPagamento(prazo) {
      this.id = prazo ? prazo.id : '';
      this.codigo = prazo ? prazo.codigo : '';
      this.descricao = prazo ? prazo.descricao : '';
      this.parcelas = prazo ? prazo.parcelas : 0;
      this.iniciaEm = prazo ? prazo.iniciaEm : 0;
      this.intervalo = prazo ? prazo.intervalo : 0;
      this.ativo = prazo ? prazo.ativo : true;
      this.dataCadastro = prazo ? prazo.dataCadastro : null;
      this.dataUpdate = prazo ? prazo.dataUpdate : null;
      this.formas = prazo ? prazo.formas : [ ];
    }

    PrazoPagamento.converterEmEntrada = function(term) {
      var prazo = { };

      prazo.id =  term.payment_term_id;
      prazo.codigo = term.payment_term_code;
      prazo.descricao = term.payment_term_description;
      prazo.parcelas = parseInt(term.payment_term_plots);
      prazo.iniciaEm = parseInt(term.payment_term_first_parcel_days);
      prazo.intervalo = parseInt(term.payment_term_days_between_plots);
      prazo.ativo = term.payment_term_active === 'Y';
      prazo.dataCadastro = new Date(term.payment_term_date);
      prazo.dataAtualizacao = term.payment_term_update ? new Date(term.payment_term_update) : null;
      prazo.formas = [];

      angular.forEach(term.payment_mode, function (item, index) {
        prazo.formas.push(new FormaPagamento(FormaPagamento.converterEmEntrada(item)));
      });

      return prazo;
    };

    PrazoPagamento.converterEmSaida = function(prazo) {
      var term = { };

      term.payment_term_id = prazo.id;
      term.payment_term_code = prazo.codigo;
      term.payment_term_description = prazo.descricao;
      term.payment_term_plots = prazo.parcelas;
      term.payment_term_first_parcel_days = prazo.iniciaEm;
      term.payment_term_days_between_plots = prazo.intervalo;
      term.payment_term_active = prazo.ativo ? 'Y' : 'N';
      term.payment_mode_id = [];

      angular.forEach(prazo.formas, function (item, index) {
        term.payment_mode_id.push(item.id);
      });

      return term;
    };

    return PrazoPagamento;

  }]);
