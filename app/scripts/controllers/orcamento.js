/**
 * Created by egmfilho on 14/06/16.
 */

'use strict';

angular.module('commercialApp')
  .controller('OrcamentoCtrl', [
    '$scope',
    'ProviderVendedor',
    'ProviderCliente',
    'ProviderProduto',
    function($scope, providerVendedor, providerCliente, providerProduto) {

      var self = this;

      this.produtos = [];

      // retira o padding-right que compensa o scroll se o SO for um MacOS
      if (navigator.platform === 'MacIntel') {
        angular.element('#tabela-orcamento thead tr').css('padding-right', '0px');
      }

      $scope.$on('$viewContentLoaded', function() {
        $scope.formularios.vendedor = true;
        $scope.formularios.cliente = false;
        $scope.formularios.produtos = false;
        $scope.formularios.pagamentos = false;
      });

      this.buscaVendedorPorCodigo = function(codigo) {

        providerVendedor.obterVendedorPorCodigo(codigo).then(function(data) {
          self.vendedor.cdVendedor = data.CdVendedor;
          self.vendedor.nmVendedor = data.NmVendedor;
        });

      };

      this.buscaClientePorCodigo = function(codigo) {

        providerCliente.obterClientePorCodigo(codigo).then(function(data) {
          self.cliente.cdCliente = data.CdCliente;
          self.cliente.nmCliente = data.NmCliente;
          self.cliente.email = data.Email;
          self.cpf_cnpj = data.CPF_CNPJ;
          self.tpCliente = data.TpCliente;
        });

      };

      this.limparProdutos = function() {
        $scope.produto.cdProduto = '';
        $scope.produto.nmProduto = '';
        $scope.produto.vlPreco = '';
        $scope.produto.unidade = '';
        $scope.produto.quantidade = 0;
        $scope.produto.desconto_percent = 0;
        $scope.produto.desconto_dinheiro = 0;
        $scope.produto.total = 0;
      }

      this.buscaProdutoPorCodigo = function(codigo) {

        providerProduto.obterProdutoPorCodigo(codigo).then(function(data) {
          $scope.produto.cdProduto = data.CdProduto;
          $scope.produto.nmProduto = data.NmProduto;
          $scope.produto.vlPreco = data.VlPreco;
          $scope.produto.unidade = data.Unidade;
          $scope.produto.quantidade = 1;
          $scope.produto.desconto_percent = 0;
          $scope.produto.desconto_dinheiro = 0;
          $scope.produto.total = $scope.produto.vlPreco * $scope.produto.quantidade;
        }, function(err) {
          console.log(err);
        });

      };

      this.buscaProdutoPorDescricao = function(descricao) {

          return providerProduto.obterProdutosPorDescricao(descricao).then(function(data) {
            data.push({ NmProduto: 'Mais resultados...', CdProduto: -1});
            return data;
          }, function(err) {
            console.log(err);
          });

      };

      this.selectProduto = function(item) {

        if (item.CdProduto == -1) {
          alert('mais resultados');
          $scope.produto.nmProduto = '';
        } else {
          this.buscaProdutoPorCodigo(item.CdProduto);
        }

      };

      this.recalcular = function(campoAlterado) {

        if (campoAlterado === 'desconto_dinheiro') {
          $scope.produto.desconto_percent = ($scope.produto.desconto_dinheiro  * 100) / ($scope.produto.vlPreco * $scope.produto.quantidade);
        } else if (campoAlterado === 'desconto_percent' || campoAlterado === 'quantidade') {
          $scope.produto.desconto_dinheiro = ($scope.produto.vlPreco * $scope.produto.quantidade) * ($scope.produto.desconto_percent / 100);
        }

        $scope.produto.total = ($scope.produto.vlPreco * $scope.produto.quantidade) - $scope.produto.desconto_dinheiro;
      };

      this.addProduto = function(produto) {
        this.produtos.push(produto);
        this.limparProdutos();
      };

    }
  ]);
