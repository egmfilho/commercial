/**
 * Created by egmfilho on 15/07/16.
 */
'use strict';

angular.module('commercialApp.services')
  .factory('Pedido', ['ItemPedido', 'Pessoa', 'Pagamento', 'DataSaida', function(ItemPedido, Pessoa, Pagamento, dataSaida) {

    function Pedido(p) {
      this.id = p ? p.id : '';
      this.codigo = p ? p.codigo : '';
      this.idUsuario = p ? p.idUsuario : '';
      this.idStatus = p ? p.idStatus : '';
      this.idCliente = p ? p.idCliente : '';
      this.idVendedor = p ? p.idVendedor : '';
      this.dataAtualizacao = p ? p.dataAtualizacao : new Date();
      this.dataPedido = p ? p.dataPedido : new Date();

      this.vendedor = p ? p.vendedor : new Pessoa();
      this.cliente = p ? p.cliente : new Pessoa();
      this.items = p ? p.items : [ ];

      this.descontoPercent = p ? p.descontoPercent : 0;
      this.descontoDinheiro = p ? p.descontoDinheiro : 0;
      this.valor = p ? p.valor : 0;
      this.valorComDesconto = p ? p.valorComDesconto : 0;

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

      pedido.id = p.order_id;
      pedido.codigo = p.order_code;
      pedido.idUsuario = p.order_user_id;
      pedido.idStatus = p.order_status_id;
      pedido.idCliente = p.order_client_id;
      pedido.idVendedor = p.order_seller_id;
      pedido.descontoPercent = p.order_al_discount;
      pedido.descontoDinheiro = p.order_vl_discount;
      pedido.valor = p.order_value;
      pedido.valorComDesconto = p.order_value_total;
      pedido.dataAtualizacao = new Date(p.order_update);
      pedido.dataPedido = new Date(p.order_date);

      if (p.order_seller) {
        pedido.vendedor = new Pessoa(Pessoa.converterEmEntrada(p.order_seller));
      } else {
        pedido.vendedor = new Pessoa();
      }

      if (p.order_client) {
        pedido.cliente = new Pessoa(Pessoa.converterEmEntrada(p.order_client));
      } else {
        pedido.cliente = new Pessoa();
      }

      pedido.items = [ ];
      if (p.order_items) {
        angular.forEach(p.order_items, function(item, index) {
          pedido.items.push(new ItemPedido(ItemPedido.converterEmEntrada(item)));
        });
      }

      pedido.pagamentos = [ ];
      if (p.order_payments) {
        angular.forEach(p.order_payments, function(item, index) {
          pedido.pagamentos.push(new Pagamento(Pagamento.converterEmEntrada(item)));
        });
      }

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
