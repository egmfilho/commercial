/**
 * Created by egmfilho on 15/07/16.
 */
'use strict';

angular.module('commercialApp.services')
  .factory('Pedido', ['ItemPedido', 'Pessoa', 'Pagamento', 'DataSaida', function(ItemPedido, Pessoa, Pagamento, dataSaida) {

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

      this.pagamentos = p ? p.pagamentos : [ ];
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
      },

      addPagamento: function(pagamento) {
        this.pagamentos.push(pagamento);
      },

      removerPagamento: function(pagamento) {
        this.pagamentos.splice($scope.pagamentos.indexOf(pagamento), 1);
      },

      getPagamentos: function() {
        return this.pagamentos;
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

      p.order_id = pedido.id;
      p.order_client_id = pedido.idCliente;
      //p.Cliente = Pessoa.converterEmSaida(pedido.cliente);
      p.order_seller_id = pedido.idVendedor;
      //p.Vendedor = Pessoa.converterEmSaida(pedido.vendedor);
      p.order_status_id = pedido.status;

      p.order_items = [ ];
      angular.forEach(pedido.items, function(item, index) {
        p.order_items.push(ItemPedido.converterEmSaida(item));
      });

      p.order_value = pedido.getValorTotalSemDesconto();
      p.order_al_discount = pedido.getDescontoPercentTotal();
      p.order_vl_discount = pedido.getValorTotalSemDesconto() - pedido.getValorTotalComDesconto();
      p.order_value_total = pedido.getValorTotalComDesconto();

      p.order_payments = [ ];
      angular.forEach(pedido.pagamentos, function(item, index) {
        p.order_payments.push(Pagamento.converterEmSaida(item));
      });

      //p.DtAtualizacao = dataSaida.converter(pedido.dataAtualizacao);
      //p.DtPedido = dataSaida.converter(pedido.dataPedido);

      return p;
    };

    return Pedido;

  }]);
