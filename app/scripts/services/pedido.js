/**
 * Created by egmfilho on 15/07/16.
 */
'use strict';

angular.module('commercialApp.services')
  .factory('Pedido', ['ItemPedido', 'Pessoa', 'DataSaida', function(ItemPedido, Pessoa, dataSaida) {

    function Pedido(p) {
      this.id = p ? p.id : '';
      this.idCliente = p ? p.idCliente : '';
      this.idVendedor = p ? p.idVendedor : '';
      this.status = p ? p.status : '';
      this.dataAtualizacao = p ? p.dataAtualizacao : new Date();
      this.dataPedido = p ? p.dataPedido : new Date();

      this.vendedor = p ? p.vendedor : new Pessoa();
      this.cliente = p ? p.cliente : new Pessoa();
      this.items = p ? p.items : [ ];

      this.descontoPercent = p ? p.descontoPercent : 0;
      this.descontoDinheiro = p ? p.descontoDinheiro : 0;
    }

    Pedido.prototype = {

      contemItem: function(item) {
        var result = -1;

        angular.forEach(this.items, function(i, index) {
          if (result === -1) {
            if (parseInt(item.produto.codigo) == parseInt(i.produto.codigo)) {
              result = index;
            }
          }
        });

        return result;
      },

      setVendedor: function(vendedor) {
        this.idVendedor = vendedor.id;
        this.vendedor = vendedor;
      },

      removeVendedor: function() {
        this.vendedor = new Pessoa();
        this.idVendedor = '';
      },

      setCliente: function(cliente) {
        this.idCliente = cliente.id;
        this.cliente = cliente;
      },

      removeCliente: function() {
        this.cliente = new Pessoa();
        this.idCliente = '';
      },

      addItem: function(itemPedido) {
        this.items.push(new ItemPedido(itemPedido));
      },

      removerItem: function(itemPedido) {
        this.items.splice(this.items.indexOf(itemPedido), 1);
      },

      setDescontoPercent: function(percent) {
        this.descontoPercent = parseFloat(percent);
        this.descontoDinheiro = parseFloat(percent) > 0 ? this.getValorTotalSemDesconto() * (parseFloat(percent) / 100) : 0;
      },

      setDescontoDinheiro: function(dinheiro) {
        this.descontoDinheiro = parseFloat(dinheiro);
        this.descontoPercent = (parseFloat(dinheiro) * 100) / this.getValorTotalSemDesconto();
      },

      getDescontoPercentTotal: function() {
        return 100 - ((this.getValorTotalComDesconto() * 100) / this.getValorTotalSemDesconto());
      },

      getDescontoDinheiroTotal: function() {
        var total = 0;

        angular.forEach(this.items, function(item, index) {
          total += item.descontoDinheiro;
        });

        return total;
      },

      getValorTotalSemDesconto: function() {
        var total = 0;

        angular.forEach(this.items, function(item, index) {
          total += item.getTotalSemDesconto();
        });

        return total;
      },

      getValorTotalComDesconto: function() {
        var total = 0;

        angular.forEach(this.items, function(item, index) {
          total += item.getTotalComDesconto();
        });

        return total - this.descontoDinheiro;
      }

    };

    Pedido.converterEmEntrada = function(p) {
      var pedido = { };

      pedido.id = p.IdPedido;
      pedido.idCliente = p.IdCliente;
      pedido.idVendedor = p.IdVendedor;
      pedido.status = p.StatusPedido;
      pedido.dataAtualizacao = new Date(p.DtAtualizacao);
      pedido.dataPedido = new Date(p.DtPedido);

      return pedido;
    };

    Pedido.converterEmSaida = function(pedido) {
      var p = { };

      p.IdPedido = pedido.id;
      p.IdCliente = pedido.idCliente;
      p.IdVendedor = pedido.idVendedor;
      p.StatusPedido = pedido.status;
      p.DtAtualizacao = dataSaida.converter(pedido.dataAtualizacao);
      p.DtPedido = dataSaida.converter(pedido.dataPedido);

      return p;
    };

    return Pedido;

  }]);
