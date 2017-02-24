/**
 * Created by egmfilho on 30/08/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('Pagamento', ['Modalidade', 'FormaPagamento', 'DataSaida', function (Modalidade, FormaPagamento, DataSaida) {

    function Pagamento(pagamento) {
      this.id = pagamento ? pagamento.id : '';
      this.idPedido = pagamento ? pagamento.idPedido : '';
      this.idModalidade = pagamento ? pagamento.idModalidade : '';
      this.modalidade = pagamento ? pagamento.modalidade : new Modalidade();
      this.descontoPercent = pagamento ? pagamento.descontoPercent : 0;
      this.descontoDinheiro = pagamento ? pagamento.descontoDinheiro : 0;
      this.valor = pagamento ? pagamento.valor : 0;
      this.dataPagamento = pagamento ? pagamento.dataPagamento : new Date();
      this.dataAtualizacao = pagamento ? pagamento.dataAtualizacao : new Date();

      this.idForma = pagamento ? pagamento.idForma : '';
      this.forma = pagamento ? new FormaPagamento(pagamento.forma) : new FormaPagamento();
      this.vencimento = pagamento ? pagamento.vencimento : new Date();
    }

    Pagamento.prototype = {

      setForma: function(forma) {
        if (forma) {
          this.forma = new FormaPagamento(forma);
        }
        this.idForma = this.forma.id;
      },

      setModalidade: function (modalidade) {
        if (!modalidade) return;

        this.modalidade = new Modalidade(modalidade);
      },

      setDescontoPercent: function (percent) {
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

      setDescontoDinheiro: function (dinheiro) {
        //this.descontoDinheiro = parseFloat(dinheiro);
      },

      getDescontoMaximoPercent: function () {
        return this.descontoMaximo;
      },

      getValorTotalComDesconto: function () {
        return this.valor;
      }

    };

    Pagamento.converterEmEntrada = function (p) {
      var pagamento = {};

      pagamento.id = p.order_payment_id;
      pagamento.idPedido = p.order_id;
      pagamento.idModalidade = p.modality_id;

      if (p.modality) {
        pagamento.modalidade = new Modalidade(Modalidade.converterEmEntrada(p.modality));
      } else {
        pagamento.modalidade = new Modalidade();
      }


      pagamento.descontoPercent = parseFloat(p.order_payment_al_discount);
      pagamento.descontoDinheiro = parseFloat(p.order_payment_vl_discount);
      pagamento.valor = parseFloat(p.order_payment_value_total);

      pagamento.dataPagamento = new Date(p.order_payment_date);
      pagamento.dataAtualizacao = new Date(p.order_payment_update);

      pagamento.idForma = p.modality_id;
      pagamento.forma = new FormaPagamento(FormaPagamento.converterEmEntrada(p.modality));
      pagamento.vencimento = new Date((p.order_payment_deadline || p.order_payment_deadline) + 'T12:00:00');

      return pagamento;
    };

    Pagamento.converterEmSaida = function (pagamento) {
      var p = {};

      // p.modality_id = pagamento.modalidade.id;
      p.order_payment_al_discount = pagamento.descontoPercent;
      p.order_payment_vl_discount = pagamento.descontoDinheiro;
      p.order_payment_value = pagamento.valor;
      p.order_payment_value_total = pagamento.getValorTotalComDesconto();

      p.modality_id = pagamento.idForma;
      p.order_payment_deadline = DataSaida.converter(pagamento.vencimento);

      return p;
    };

    return Pagamento;

  }]);
