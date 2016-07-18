/**
 * Created by egmfilho on 15/07/16.
 */
'use strict';

angular.module('commercialApp')
  .factory('Pedido', function() {

    var pedido = { };

    pedido.produtos = [];

    function getDescontoPercentTotal() {
      var valor_total = this.getValorTotalSemDesconto(),
          desc_dinheiro = this.getDescontoDinheiroTotal();

      return valor_total === 0 ? 0 : (desc_dinheiro * 100) / valor_total;
    }

    function getDescontoDinheiroTotal() {
      return this.getValorTotalSemDesconto() - this.getValorTotalComDesconto();
    }

    function getValorTotalSemDesconto() {
      var i, total = 0;

      for (i = 0; i < pedido.produtos.length; i++) {
        total += pedido.produtos[i].vlPreco * pedido.produtos[i].quantidade;
      }

      return total;
    }

    function getValorTotalComDesconto() {
      var i, total = 0;

      for (i = 0; i < pedido.produtos.length; i++) {
        total += pedido.produtos[i].total;
      }

      return total;
    }

    function removerProduto(produto) {

      pedido.produtos.splice(pedido.produtos.indexOf(produto), 1);

    }

    return {
      addVendedor: function(vendedor) {
        pedido.vendedor = {
          cdVendedor: vendedor.cdVendedor,
          nmVendedor: vendedor.nmVendedor,
        };
      },

      addCliente: function(cliente) {
        pedido.cliente = {
          cdCliente: cliente.cdCliente,
          nmCliente: cliente.nmCliente,
          email: cliente.email,
          cpf_cnpj: cliente.cpf_cnpj,
          tp_cliente: cliente.tp_cliente
        };
      },

      addProduto: function(produto) {
        pedido.produtos.push({
          cdProduto: produto.cdProduto,
          nmProduto: produto.nmProduto,
          unidade: produto.unidade,
          quantidade: produto.quantidade,
          vlPreco: produto.vlPreco,
          desconto_percent: produto.desconto_percent,
          desconto_dinheiro: produto.desconto_dinheiro,
          total: produto.total
        });
      },

      removerProduto: removerProduto,

      getProdutos: function() {
        return pedido.produtos;
      },

      getDescontoPercentTotal: getDescontoPercentTotal,

      getDescontoDinheiroTotal: getDescontoDinheiroTotal,

      getValorTotalSemDesconto: getValorTotalSemDesconto,

      getValorTotalComDesconto: getValorTotalComDesconto
    }

  });
