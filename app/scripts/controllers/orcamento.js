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
    'ProviderEndereco',
    'ItemPedido',
    'Pedido',
    'Pessoa',
    'Endereco',
    'ModalPagamento',
    'ModalBuscarPessoa',
    'ModalBuscarEndereco',
    function($rootScope, $scope, $timeout, providerPessoa, providerProduto, providerEndereco, ItemPedido, Pedido, Pessoa, Endereco, modalPagamento, modalBuscarPessoa, modalBuscarEndereco) {

      var self = this;

      // retira o padding-right que compensa o scroll se o SO for um MacOS
      if (navigator.platform === 'MacIntel') {
        angular.element('#tabela-orcamento thead tr').css('padding-right', '0px');
      }

      function focarVendedor() {
        $scope.formularios.vendedor = true;
        $scope.formularios.cliente = false;
        $scope.formularios.produtos = false;

        $timeout(function() {
          jQuery('input[name="CdVendedor"]').focus();
        }, 500);
      }

      function focarProdutos() {
        $scope.formularios.vendedor = false;
        $scope.formularios.produtos = true;
        $scope.formularios.cliente = false;

        $timeout(function() {
          jQuery('input[name="CdProduto"]').focus();
        }, 500);
      }

      function focarCliente() {
        $scope.formularios.vendedor = false;
        $scope.formularios.produtos = false;
        $scope.formularios.cliente = true;

        $timeout(function() {
          jQuery('input[name="CdCliente"]').focus();
        }, 500);
      }

      $scope.$on('$viewContentLoaded', function() {
        self.pedido = new Pedido();
        $scope.item = new ItemPedido();
        $scope.cliente = { novo: false };
        $scope.lockCodigo = false;
        $scope.lockDescricao = false;

        focarVendedor();
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

      $scope.blurProduto = function() {
        if ($scope.cdProduto && $scope.item.produto.codigo) {
          if ($scope.cdProduto != parseInt($scope.item.produto.codigo)) {
            $scope.cdProduto = parseInt($scope.item.produto.codigo);
          }
        }

        if ($scope.nmProduto && $scope.item.produto.nome) {
          if ($scope.nmProduto != $scope.item.produto.nome) {
            $scope.nmProduto = $scope.item.produto.nome;
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
          focarProdutos();
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

      this.limparVendedor = function($event) {
        $scope.cdVendedor = '';
        this.pedido.removeVendedor();
        $event.stopPropagation();
      };

      this.buscaClientePorCodigo = function(codigo) {
        if (!codigo) {
          modalBuscarPessoa.show('Cliente', function(result) {
            if (result) {
              self.pedido.setCliente(result);
              $scope.cdCliente = parseInt(result.codigo);
            }
          });

          return;
        }

        if (parseInt(codigo) == parseInt(this.pedido.cliente.codigo)) {
          this.salvar();
          return;
        }

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

      this.limparCliente = function($event) {
        $scope.cdCliente = '';
        this.pedido.removeCliente();
        if ($event) $event.stopPropagation();
        jQuery('input[name="CdCliente"]').focus();
      };

      this.novoCliente = function() {
        $scope.cliente.novo = true;
        $scope.cdCliente = null;
        this.pedido.cliente = new Pessoa();
        jQuery('input[name="nome-cliente"]').focus();
      };

      this.cadastrarCliente = function() {
        this.pedido.cliente.tipo = 'Cliente';
        console.log(Pessoa.converterEmSaida(this.pedido.cliente));
        $rootScope.isLoading = true;
        providerPessoa.adicionarPessoa(Pessoa.converterEmSaida(this.pedido.cliente)).then(function(success) {
          console.log(success.data);
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      this.limparProduto = function() {
        $scope.item = new ItemPedido();
        $scope.lockDescricao = false;
        $scope.lockCodigo = false;
        $scope.cdProduto = '';
        $scope.nmProduto = '';
        jQuery('input[name="CdProduto"]').focus();
      };

      this.buscaProdutoPorCodigo = function(codigo) {
        if (!codigo) return;

        $rootScope.isLoading = true;
        providerProduto.obterProdutoPorCodigo(codigo).then(function(success) {
          $scope.lockDescricao = true;
          $rootScope.isLoading = false;
          $scope.item.setProduto(success.data);
          $scope.cdProduto = parseInt($scope.item.produto.codigo);
          $scope.nmProduto = $scope.item.produto.nome;
          jQuery('input[name="quantidade"]').focus();
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
          $scope.lockCodigo = true;
        }
      };

      this.removerItem = function(item) {
        if (confirm('Deseja excluir o produto?')) {
          this.pedido.removerItem(item);
        }
      };

      this.addItem = function() {
        if (this.carregandoProdutos) return;

        if (this.pedido.contemItem($scope.item) !== -1) {
          alert('Produto já adicionado!');
          return;
        }

        if (!$scope.item.produto.codigo || !$scope.item.produto.nome) {
          jQuery('input[name="CdProduto"]').focus();
          return;
        }

        this.pedido.addItem($scope.item);
        this.limparProduto();
        $scope.lockDescricao = false;
        $scope.lockCodigo = false;
        jQuery('input[name="CdProduto"]').focus();
      };

      this.avancar = function(name) {
        jQuery('input[name="' + name + '"]').focus().select();
      };

      this.escapeProdutos = function() {
        focarCliente();
      };

      this.escapeVendedor = function() {
        focarProdutos();
      };

      this.limpar = function() {
        this.pedido = new Pedido();
        $scope.item = new ItemPedido();
        $scope.cdCliente = null;
        $scope.cdVendedor = null;

        focarVendedor();
      };

      this.buscarCEP = function() {

        if (!this.pedido.cliente.endereco.cep) return;

        $rootScope.isLoading = true;
        providerEndereco.obterEnderecosPorCEP(this.pedido.cliente.endereco.cep).then(function(success) {
          if (success.data.length > 1) {
            var enderecos = [ ];
            angular.forEach(success.data, function(item, index) {
              enderecos.push(new Endereco(Endereco.converterEmEntrada(item)));
            });
            modalBuscarEndereco.show(enderecos, function(result) {
              if (result) {
                self.pedido.cliente.setEndereco(result);
                $rootScope.isLoading = false;
              }
            });
          } else {
            self.pedido.cliente.setEndereco(new Endereco(Endereco.converterEmEntrada(success.data[0])));
            $rootScope.isLoading = false;
          }
        }, function(error) {
          $rootScope.isLoading = false;
          console.log(error);
        });
      };

      function validar() {
        if (!self.pedido.idVendedor) {
          focarVendedor();

          alert('Vendedor não informado!');

          return false;
        }

        if (self.pedido.items.length == 0) {
          focarProdutos();

          alert('Orçamento vazio!');

          return false;
        }

        if (!self.pedido.idCliente && !self.pedido.cliente.nome) {
          //if (!self.pedido.cliente.telefone && !self.pedido.cliente.celular && !self.pedido.cliente.email) {
            focarCliente();

            alert('Cliente não informado!');

            return false;
          //}
        }

        return true;
      }

      this.salvar = function() {
        if (validar()) {
          modalPagamento.show(this.pedido, function(result) {
            if (result) {
              alert('Orçamento gravado!');
              self.limpar();
            }
          });
        }
      };

    }
  ]);
