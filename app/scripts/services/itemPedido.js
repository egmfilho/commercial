/**
 * Created by egmfilho on 16/08/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ItemPedido', ['Produto', 'Pessoa', function(Produto, Pessoa) {

    function ItemPedido(itemPedido) {
      this.descontoPercent = itemPedido ? itemPedido.descontoPercent : 0;
      this.descontoDinheiro = itemPedido ? itemPedido.descontoDinheiro : 0;
      this.quantidade = itemPedido ? itemPedido.quantidade : 1;
      this.produto = itemPedido ? itemPedido.produto : new Produto();
    }

    ItemPedido.prototype = {

      setProduto: function(produto) {
        this.produto = new Produto(Produto.converterEmEntrada(produto));
      },

      setQuantidade: function(quantidade) {
        if (quantidade <= 0) {
          return;
        }

        this.quantidade = quantidade;
        this.setDescontoPercent(this.descontoPercent);
      },

      setDescontoPercent: function(percent) {
        this.descontoPercent = parseFloat(percent);
        this.descontoDinheiro = parseFloat(percent) > 0 ? this.getTotalSemDesconto() * (parseFloat(percent) / 100) : 0;
      },

      setDescontoDinheiro: function(dinheiro) {
        this.descontoDinheiro = parseFloat(dinheiro);
        this.descontoPercent = (parseFloat(dinheiro) * 100) / this.getTotalSemDesconto();
      },

      getTotalSemDesconto: function() {
        return this.quantidade * this.produto.preco;
      },

      getTotalComDesconto: function() {
        return (this.quantidade * this.produto.preco) - this.descontoDinheiro;
      }
    };

    ItemPedido.converterEmSaida = function(item) {
      var i = { };

      i.order_item_value = item.produto.preco;
      i.order_item_al_discount = item.descontoPercent;
      i.order_item_vl_discount = item.descontoDinheiro;
      i.order_item_ammount = item.quantidade;
      i.order_item_value_total = item.getTotalComDesconto();
      i.product_id = item.produto.id;

      return i;
    };

    return ItemPedido;

  }]);
