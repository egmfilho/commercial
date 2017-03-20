/**
 * Created by egmfilho on 16/08/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ItemPedido', ['Produto', 'Pessoa', function(Produto, Pessoa) {

    function ItemPedido(itemPedido) {
      this.id = itemPedido ? itemPedido.id : '';
      this.idPedido = itemPedido ? itemPedido.idPedido : '';
      this.idProduto = itemPedido ? itemPedido.idProduto : '';
      this.precoProduto = itemPedido ? itemPedido.precoProduto : '';
      this.descontoPercent = itemPedido ? itemPedido.descontoPercent : 0;
      this.descontoDinheiro = itemPedido ? itemPedido.descontoDinheiro : 0;
      this.quantidade = itemPedido ? itemPedido.quantidade : 1;
      this.produto = itemPedido ? new Produto(itemPedido.produto) : new Produto();
    }

    ItemPedido.prototype = {

      setProduto: function(produto) {
        this.produto = new Produto(Produto.converterEmEntrada(produto));
        this.idProduto = produto.id;
        this.precoProduto = produto.preco;
      },

      setQuantidade: function(quantidade) {
        if (quantidade <= 0) {
          return;
        }

        this.quantidade = quantidade;
        this.setDescontoPercent(this.descontoPercent);
      },

      setDescontoPercent: function(percent) {
        // percent = Math.min(parseFloat(percent), 20);
        this.descontoPercent = parseFloat(percent);
        this.descontoDinheiro = parseFloat(percent) > 0 ? this.getTotalSemDesconto() * (parseFloat(percent) / 100) : 0;
      },

      setDescontoDinheiro: function(dinheiro) {
        // dinheiro = Math.min(dinheiro, this.getTotalSemDesconto() * (0.2));
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

    ItemPedido.converterEmEntrada = function(i) {
      var item = { };

      item.id = i.order_item_id;
      item.idPedido = i.order_id;
      item.idProduto = i.product_id;
      item.quantidade = parseFloat(i.order_item_amount);
      item.precoProduto = parseFloat(i.order_item_value);
      item.descontoPercent = parseFloat(i.order_item_al_discount);
      item.descontoDinheiro = parseFloat(i.order_item_vl_discount);

      if (i.product) {
        item.produto = new Produto(Produto.converterEmEntrada(i.product));
      } else {
        item.produto = new Produto();
      }

      return item;
    };

    ItemPedido.converterEmSaida = function(item) {
      var i = { };

      i.order_item_value = item.precoProduto || item.produto.preco;
      i.order_item_al_discount = item.descontoPercent;
      i.order_item_vl_discount = item.descontoDinheiro;
      i.order_item_amount = item.quantidade;
      i.order_item_value_total = item.getTotalComDesconto();
      i.product_id = item.idProduto || item.produto.id;

      return i;
    };

    return ItemPedido;

  }]);
