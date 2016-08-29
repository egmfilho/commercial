/**
 * Created by egmfilho on 14/06/16.
 */

'use strict';

angular.module('commercialApp')
  .controller('OrcamentoCtrl', [
    '$rootScope',
    '$scope',
    '$timeout',
    'ProviderPessoa',
    'ProviderProduto',
    'ItemPedido',
    'Pedido',
    'Pessoa',
    function($rootScope, $scope, $timeout, providerPessoa, providerProduto, ItemPedido, Pedido, Pessoa) {

      var self = this;

      // retira o padding-right que compensa o scroll se o SO for um MacOS
      if (navigator.platform === 'MacIntel') {
        angular.element('#tabela-orcamento thead tr').css('padding-right', '0px');
      }

      $scope.$on('$viewContentLoaded', function() {
        self.pedido = new Pedido();
        $scope.item = new ItemPedido();
        $scope.cliente = { novo: false };

        $scope.formularios.vendedor = true;
        $scope.formularios.cliente = false;
        $scope.formularios.produtos = false;
        $scope.formularios.pagamentos = false;

        $timeout(function() {
          jQuery('#CdVendedor').focus();
        }, 500);
      });

      $scope.blurCdVendedor = function() {
        if ($scope.cdVendedor && self.pedido.vendedor.codigo) {
          if ($scope.cdVendedor != parseInt(self.pedido.vendedor.codigo)) {
            $scope.cdVendedor = parseInt(self.pedido.vendedor.codigo);
          }
        }
      };

      $scope.blurCdCliente = function() {
        if ($scope.cdCliente && self.pedido.cliente.codigo) {
          if ($scope.cdCliente != parseInt(self.pedido.cliente.codigo)) {
            $scope.cdCliente = parseInt(self.pedido.cliente.codigo);
          }
        }
      };

      $scope.scrollTo = function($event, id) {
        var container = jQuery('body'),
            scrollTo = $event ? jQuery('#' + $event.currentTarget.id) : jQuery(id);

        container.animate({
          scrollTop: scrollTo.offset().top - 20// - container.offset().top + container.scrollTop()
        });
      };

      this.buscaVendedorPorCodigo = function(codigo) {

        if (!codigo) return;

        if (parseInt(codigo) == parseInt(this.pedido.vendedor.codigo)) {
          $scope.formularios.vendedor = false;
          $scope.formularios.produtos = true;
          $timeout(function() {
            $scope.scrollTo(null, '#form-produtos');
            jQuery('#CdProduto').focus();
          }, 500);

          return;
        }

        $rootScope.isLoading = true;
        providerPessoa.obterPessoaPorCodigo('Vendedor', codigo).then(function(success) {
          $rootScope.isLoading = false;
          self.pedido.setVendedor(new Pessoa(Pessoa.converterEmEntrada(success.data)));
        }, function(error) {
          $rootScope.isLoading = false;
          if (error.status == 404) {
            console.log('Vendedor não encontrado!');
          }
        });

      };

      this.buscaClientePorCodigo = function(codigo) {

        if (!codigo) return;

        $rootScope.isLoading = true;
        providerPessoa.obterPessoaPorCodigo('Cliente', codigo).then(function(success) {
          $rootScope.isLoading = false;
          self.pedido.setCliente(new Pessoa(Pessoa.converterEmEntrada(success.data)));
        }, function(error) {
          $rootScope.isLoading = false;
          if (error.status == 404) {
            console.log('Cliente não encontrado!');
          }
        });

      };

      this.novoCliente = function() {
        $scope.cliente.novo = true;
        $scope.cdCliente = null;
        this.pedido.cliente = new Pessoa();
      };

      this.limparProduto = function() {
        $scope.item = new ItemPedido();
      };

      this.buscaProdutoPorCodigo = function(codigo) {

        if (!codigo) return;

        $rootScope.isLoading = true;
        providerProduto.obterProdutoPorCodigo(codigo).then(function(success) {
          $rootScope.isLoading = false;
          $scope.item.setProduto(success.data);
          jQuery('#NmProduto').focus();
        }, function(err) {
          $rootScope.isLoading = false;
          console.log(err);
        });

      };

      this.buscaProdutoPorDescricao = function(descricao) {

        return providerProduto.obterProdutosPorDescricao(descricao).then(function(success) {
          success.data.push({ NmProduto: 'Mais resultados...', CdProduto: -1});
          return success.data;
        }, function(err) {
          console.log(err);
          return;
        });

      };

      this.selectProduto = function(item) {
        if (item.CdProduto === -1) {
          alert('mais resultados');
          $scope.item = new ItemPedido();
        } else {
          this.buscaProdutoPorCodigo(item.CdProduto);
        }
      };

      this.removerItem = function(item) {
        if (confirm('Deseja excluir o produto?')) {
          this.pedido.removerItem(item);
        }
      };

      this.addItem = function() {
        if (this.carregandoProdutos) return;

        if (!$scope.item.produto.codigo || !$scope.item.produto.nome) {
          jQuery('#CdProduto').focus();
          return;
        }

        this.pedido.addItem($scope.item);
        this.limparProduto();
        jQuery('#CdProduto').focus();
      };

      this.avancar = function(id) {
        jQuery(id).focus().select();
      };

      this.escapeProdutos = function() {
        $scope.formularios.produtos = false;
        $scope.formularios.cliente = true;
        $timeout(function() {
          $scope.scrollTo(null, '#form-cliente');
          jQuery('#CdCliente').focus();
        }, 500);
      };

      this.limpar = function() {
        this.pedido = new Pedido();
        $scope.item = new ItemPedido();
        $scope.cdCliente = null;
        $scope.cdVendedor = null;
      };

      function validar() {
        if (!self.pedido.idVendedor) {
          $scope.formularios.vendedor = true;
          $scope.formularios.produtos = false;
          $scope.formularios.cliente = false;
          $scope.formularios.pagamentos = false;

          $timeout(function() {
            jQuery('CdVendedor').focus();
          }, 500);

          alert('Selecione um vendedor!');

          return;
        }

        if (self.pedido.items.length == 0) {
          $scope.formularios.vendedor = false;
          $scope.formularios.produtos = true;
          $scope.formularios.cliente = false;
          $scope.formularios.pagamentos = false;

          $timeout(function() {
            $('CdProduto').focus();
          }, 500);

          alert('Orçamento vazio!');

          return;
        }

        if (self.pedido.cliente.nome) {
          if (!self.pedido.cliente.telefone && !self.pedido.cliente.celular && !self.pedido.cliente.email) {
            $scope.formularios.vendedor = false;
            $scope.formularios.produtos = false;
            $scope.formularios.cliente = true;
            $scope.formularios.pagamentos = false;

            $timeout(function() {
              $('CdCliente').focus();
            }, 500);

            alert('Cliente precisa ter ao menos 1 contato!');
          }
        }
      }

      this.salvar = function() {
        validar();
        console.log(this.pedido);
      };

    }
  ]);
