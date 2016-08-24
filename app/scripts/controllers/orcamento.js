/**
 * Created by egmfilho on 14/06/16.
 */

'use strict';

angular.module('commercialApp')
  .controller('OrcamentoCtrl', [
    '$rootScope',
    '$scope',
    'ProviderPessoa',
    'ProviderProduto',
    'ItemPedido',
    'Pedido',
    'Pessoa',
    function($rootScope, $scope, providerPessoa, providerProduto, ItemPedido, Pedido, Pessoa) {

      var self = this;

      // retira o padding-right que compensa o scroll se o SO for um MacOS
      if (navigator.platform === 'MacIntel') {
        angular.element('#tabela-orcamento thead tr').css('padding-right', '0px');
      }

      $scope.$on('$viewContentLoaded', function() {
        self.pedido = new Pedido();
        $scope.item = new ItemPedido();

        $scope.formularios.vendedor = true;
        $scope.formularios.cliente = false;
        $scope.formularios.produtos = false;
        $scope.formularios.pagamentos = false;

        setTimeout(function() {
          $('#CdVendedor').focus();
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

      this.scrollTo = function($event) {
        var container = $('body'),
            scrollTo = $('#' + $event.currentTarget.id);

        container.animate({
          scrollTop: scrollTo.offset().top - 20// - container.offset().top + container.scrollTop()
        });
      };

      this.buscaVendedorPorCodigo = function(codigo) {

        if (!codigo) return;

        if (parseInt(codigo) == parseInt(this.pedido.vendedor.codigo)) {
          $scope.formularios.vendedor = false;
          $scope.formularios.produtos = true;
          $scope.$apply();
          setTimeout(function() {
            $('#CdProduto').focus();
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

        //if (parseInt(codigo) == parseInt(this.pedido.cliente.codigo)) {
        //  $scope.formularios.cliente = false;
        //  $scope.formularios.produtos = true;
        //  $scope.$apply();
        //  setTimeout(function() {
        //    $('#CdProduto').focus();
        //  }, 500);
        //
        //  return;
        //}

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

      this.limparProduto = function() {
        $scope.item = new ItemPedido();
      };

      this.buscaProdutoPorCodigo = function(codigo) {

        if (!codigo) return;

        $rootScope.isLoading = true;
        providerProduto.obterProdutoPorCodigo(codigo).then(function(data) {
          $rootScope.isLoading = false;
          $scope.item.setProduto(data);
          $('#NmProduto').focus();
        }, function(err) {
          $rootScope.isLoading = false;
          console.log(err);
        });

      };

      this.buscaProdutoPorDescricao = function(descricao) {

        return providerProduto.obterProdutosPorDescricao(descricao).then(function(data) {
          data.push({ NmProduto: 'Mais resultados...', CdProduto: -1});
          return data;
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

      this.addProduto = function() {
        if (this.carregandoProdutos) return;

        this.pedido.addItem($scope.item);
        this.limparProduto();
        $scope.$apply();
        $('#CdProduto').focus();
      };

      this.avancar = function(id) {
        $(id).focus();
      }

    }
  ]);
