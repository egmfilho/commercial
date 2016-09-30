/**
 * Created by egmfilho on 15/07/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('Pedido', ['$filter', '$cookies', 'ItemPedido', 'Pessoa', 'Pagamento', 'DataSaida', function ($filter, $cookies, ItemPedido, Pessoa, Pagamento, dataSaida) {

    function compare(pedido) {
      var i;

      if (this.idStatus != pedido.idStatus) return false;
      if (this.idCliente != pedido.idCliente) return false;
      if (this.idVendedor != pedido.idVendedor) return false;

      if (this.items.length != pedido.items.length) return false;

      if (this.valor != pedido.valor) return false;
      if (this.valorComDesconto != pedido.valorComDesconto) return false;
      if (this.descontoPercent != pedido.descontoPercent) return false;
      if (this.descontoDinheiro != pedido.descontoDinheiro) return false;

      if (this.pagamentos.length != pedido.pagamentos.length) return false;

      for (i = 0; i < this.items.length; i++) {
        if (this.items[i].idProduto != pedido.items[i].idProduto) return false;
        if (this.items[i].quantidade != pedido.items[i].quantidade) return false;
        if (this.items[i].precoProduto != pedido.items[i].precoProduto) return false;
        if (this.items[i].descontoPercent != pedido.items[i].descontoPercent) return false;
        if (this.items[i].descontoDinheiro != pedido.items[i].descontoDinheiro) return false;
        //if (this.items[i].produto != pedido.items[i].produto) return false;
      }

      for (i = 0; i < this.pagamentos.length; i++) {
        if (this.pagamentos[i].idModalidade != pedido.pagamentos[i].idModalidade) return false;
        if (this.pagamentos[i].descontoPercent != pedido.pagamentos[i].descontoPercent) return false;
        if (this.pagamentos[i].descontoDinheiro != pedido.pagamentos[i].descontoDinheiro) return false;
        if (this.pagamentos[i].valor != pedido.pagamentos[i].valor) return false;
      }

      return true;
    }

    function Pedido(p) {
      var self = this;

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
      this.items = [];

      if (p) {
        angular.forEach(p.items, function (item, index) {
          self.items.push(new ItemPedido(item));
        });
      }

      this.descontoPercent = p ? p.descontoPercent : 0;
      this.descontoDinheiro = p ? p.descontoDinheiro : 0;
      this.valor = p ? p.valor : 0;
      this.valorComDesconto = p ? p.valorComDesconto : 0;

      this.pagamentos = [];

      if (p) {
        angular.forEach(p.pagamentos, function (item, index) {
          self.pagamentos.push(new Pagamento(item));
        });
      }

      this.blocos = this.formataritemsParaImpressao();
    }

    Pedido.prototype = {

      contemItem: function (item) {
        var result = -1;

        angular.forEach(this.items, function (i, index) {
          if (result === -1) {
            if (parseInt(item.produto.codigo) == parseInt(i.produto.codigo)) {
              result = index;
            }
          }
        });

        return result;
      },

      setVendedor: function (vendedor) {
        this.idVendedor = vendedor.id;
        this.vendedor = vendedor;
      },

      removeVendedor: function () {
        this.vendedor = new Pessoa();
        this.idVendedor = '';
      },

      setCliente: function (cliente) {
        this.idCliente = cliente.id;
        this.cliente = cliente;
      },

      setIdCliente: function (id) {
        this.idCliente = id;
        this.cliente.id = id;
      },

      removeCliente: function () {
        this.cliente = new Pessoa();
        this.idCliente = '';
      },

      addItem: function (itemPedido) {
        this.items.push(new ItemPedido(itemPedido));
        this.blocos = this.formataritemsParaImpressao();
      },

      removerItem: function (itemPedido) {
        this.items.splice(this.items.indexOf(itemPedido), 1);
        this.blocos = this.formataritemsParaImpressao();
      },

      setDescontoPercent: function (percent) {
        var userDesc = $cookies.get('currentUser') ? JSON.parse(window.atob($cookies.get('currentUser'))).perfil.permissoes.orcamento.maxDescontoPercent : 10;
        percent > userDesc ? percent = userDesc : false;

        this.descontoPercent = parseFloat(Math.round(percent * 100) / 100);
        this.descontoDinheiro = parseFloat(this.descontoPercent) > 0 ? Math.floor(this.getValorTotalSemDesconto() * (parseFloat(percent) / 100) * 100) / 100 : 0;
      },

      setDescontoDinheiro: function (dinheiro) {
        dinheiro < 0 || !dinheiro ? dinheiro = 0 : false;
        var userDesc = $cookies.get('currentUser') ? JSON.parse(window.atob($cookies.get('currentUser'))).perfil.permissoes.orcamento.maxDescontoPercent : 10;
        this.getValorTotalSemDesconto() * (userDesc / 100) < dinheiro ? dinheiro = this.getValorTotalSemDesconto() * (userDesc / 100) : false;

        this.descontoDinheiro = parseFloat(Math.floor(dinheiro * 100) / 100);
        this.descontoPercent = (parseFloat(this.descontoDinheiro) * 100) / this.getValorTotalSemDesconto();
      },

      getDescontoPercentItens: function () {
        //return 100 - ((this.getValorTotalComDesconto() * 100) / this.getValorTotalSemDesconto());
        var total = 0;

        angular.forEach(this.items, function (item, index) {
          total += item.descontoPercent;
        });

        return total;
      },

      getDescontoDinheiroItens: function () {
        var total = 0;

        angular.forEach(this.items, function (item, index) {
          total += item.descontoDinheiro;
        });

        return total;
      },

      getValorTotalSemDesconto: function () {
        var total = 0;

        angular.forEach(this.items, function (item, index) {
          total += item.getTotalSemDesconto();
        });

        return Math.round(total * 100) / 100;
      },

      getValorTotalComDesconto: function () {
        var total = 0;

        angular.forEach(this.items, function (item, index) {
          total += item.getTotalComDesconto();
        });

        return Math.round((total - this.descontoDinheiro) * 100) / 100;
      },

      addPagamento: function (pagamento) {
        this.pagamentos.push(pagamento);
      },

      removerPagamento: function (pagamento) {
        this.pagamentos.splice($scope.pagamentos.indexOf(pagamento), 1);
      },

      getPagamentos: function () {
        return this.pagamentos;
      },

      getTotalPagamentos: function () {
        var total = 0;

        angular.forEach(this.pagamentos, function (item, index) {
          total += item.valor;
        });

        return total;
      },

      formataritemsParaImpressao: function () {
        var items = $filter('orderBy')(this.items, 'produto.codigo'),
          blocos = [],
          temp = [],
          i = 0;

        //for (i = 0; i < 100; i++) {
        //  items.push(new ItemPedido());
        //}

        for (i = 0; i < items.length; i++) {
          temp.push(items[i]);

          //if ((i + 1) % (i < 17 ? 17 : 24) === 0) {
          if ((items.length === i + 1) || (temp.length === 23 && i === 22) || (i > 23 && temp.length === 30)) {
            blocos.push(temp);
            temp = [];
          }
        }
        if (temp.length > 0) {
          blocos.push(temp);
        }

        return blocos;
      },

      troco: function () {
        return Math.floor((this.getTotalPagamentos() - this.getValorTotalComDesconto()) * 100) / 100;
      },

      compare: compare

    };

    Pedido.converterEmEntrada = function (p) {
      var pedido = {};

      pedido.id = p.order_id;
      pedido.codigo = p.order_code;
      pedido.idUsuario = p.order_user_id;
      pedido.idStatus = p.order_status_id;
      pedido.idCliente = p.order_client_id;
      pedido.idVendedor = p.order_seller_id;
      pedido.descontoPercent = parseFloat(p.order_al_discount);
      pedido.descontoDinheiro = parseFloat(p.order_vl_discount);
      pedido.valor = parseFloat(p.order_value);
      pedido.valorComDesconto = parseFloat(p.order_value_total);
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

      pedido.items = [];
      if (p.order_items) {
        angular.forEach(p.order_items, function (item, index) {
          pedido.items.push(new ItemPedido(ItemPedido.converterEmEntrada(item)));
        });
      }

      pedido.pagamentos = [];
      if (p.order_payments) {
        angular.forEach(p.order_payments, function (item, index) {
          pedido.pagamentos.push(new Pagamento(Pagamento.converterEmEntrada(item)));
        });
      }

      return pedido;
    };

    Pedido.converterEmSaida = function (pedido) {
      var p = {};

      p.order_id = pedido.id;
      p.order_client_id = pedido.idCliente.length ? pedido.cliente.id : pedido.idCliente;
      //p.Cliente = Pessoa.converterEmSaida(pedido.cliente);
      p.order_seller_id = pedido.idVendedor.length ? pedido.vendedor.id : pedido.idVendedor;
      //p.Vendedor = Pessoa.converterEmSaida(pedido.vendedor);
      p.order_status_id = pedido.status;

      p.order_items = [];
      angular.forEach(pedido.items, function (item, index) {
        p.order_items.push(ItemPedido.converterEmSaida(item));
      });

      p.order_value = pedido.getValorTotalSemDesconto();
      p.order_al_discount = pedido.descontoPercent;
      p.order_vl_discount = pedido.descontoDinheiro;
      p.order_value_total = pedido.getValorTotalComDesconto();

      p.order_payments = [];
      angular.forEach(pedido.pagamentos, function (item, index) {
        p.order_payments.push(Pagamento.converterEmSaida(item));
      });

      //p.DtAtualizacao = dataSaida.converter(pedido.dataAtualizacao);
      //p.DtPedido = dataSaida.converter(pedido.dataPedido);

      return p;
    };

    return Pedido;

  }]);
