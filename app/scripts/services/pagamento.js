/**
 * Created by egmfilho on 30/08/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('Pagamento', ['Modalidade', function(Modalidade) {

    function Pagamento(pagamento) {
      this.modalidade = pagamento ? pagamento.modalidade : new Modalidade();
      this.descontoPercent = pagamento ? pagamento.descontoPercent : 0;
      this.descontoDinheiro = pagamento ? pagamento.descontoDinheiro : 0;
      this.valor = pagamento ? pagamento.valor : 0;
    }

    Pagamento.prototype = {

      setModalidade: function(modalidade) {
        if (!modalidade) return;

        this.modalidade = new Modalidade(modalidade);
      },

      setDescontoPercent: function(percent) {
        //if (percent < 0) return;
        //
        //if (percent > this.modalidade.desconto) {
        //  this.descontoPercent = parseFloat(this.modalidade.desconto);
        //} else {
        //  this.descontoPercent = parseFloat(percent);
        //}
        //
        //this.descontoDinheiro = parseFloat(percent) > 0 ? this.getTotalSemDesconto() * (parseFloat(percent) / 100) : 0;
      },

      setDescontoDinheiro: function(dinheiro) {
        //this.descontoDinheiro = parseFloat(dinheiro);
      },

      getDescontoMaximoPercent: function() {
        return this.descontoMaximo;
      },

      getValorTotalComDesconto: function() {
        return this.valor;
      }

    };

    Pagamento.converterEmSaida = function(pagamento) {
      var p = { };

      p.modality_id = pagamento.modalidade.id;
      p.order_payment_al_discount = pagamento.descontoPercent;
      p.order_payment_vl_discount = pagamento.descontoDinheiro;
      p.order_payment_value = pagamento.valor;
      p.order_payment_value_total = pagamento.getValorTotalComDesconto();

      return p;
    };

    return Pagamento;

  }]);
