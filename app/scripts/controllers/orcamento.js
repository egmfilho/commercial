/**
 * Created by egmfilho on 14/06/16.
 */

'use strict';

angular.module('commercialApp')
  .controller('OrcamentoCtrl', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$templateCache',
    '$uibModalStack',
    'ProviderPessoa',
    'ProviderProduto',
    'ProviderEndereco',
    'ProviderPedido',
    'ItemPedido',
    'Pedido',
    'Pessoa',
    'Endereco',
    'ModalPagamento',
    'ModalBuscarPessoa',
    'ModalBuscarEndereco',
    'ModalBuscarProduto',
    'ModalBuscarPedido',
    'ValidadorDocumento',
    function($rootScope, $scope, $timeout, $templateCache, $uibModalStack, providerPessoa, providerProduto, providerEndereco, providerPedido, ItemPedido, Pedido, Pessoa, Endereco, modalPagamento, modalBuscarPessoa, modalBuscarEndereco, modalBuscarProduto, modalBuscarPedido, ValidadorDocumento) {

      var self = this, backup = null;

      $scope.getHoje = function() {
        return new Date();
      };

      // retira o padding-right que compensa o scroll se o SO for um MacOS
      if (navigator.platform === 'MacIntel') {
        angular.element('#tabela-orcamento thead tr').css('padding-right', '0px');
      }

      function focarVendedor() {
        $scope.formularios.vendedor = true;
        $scope.formularios.cliente = false;
        $scope.formularios.produtos = false;

        $timeout(function () {
          jQuery('input[name="CdVendedor"]').focus();
        }, 350);
      }

      function focarProdutos() {
        $scope.formularios.vendedor = false;
        $scope.formularios.produtos = true;
        $scope.formularios.cliente = false;

        $timeout(function () {
          $scope.scrollTo(null, '#form-produtos');
          jQuery('input[name="CdProduto"]').focus();
        }, 350);
      }

      function focarCliente() {
        $scope.formularios.vendedor = false;
        $scope.formularios.produtos = false;
        $scope.formularios.cliente = true;

        $timeout(function () {
          $scope.scrollTo(null, '#form-cliente');
          jQuery('input[name="CdCliente"]').focus();
        }, 350);
      }

      $scope.$on('$viewContentLoaded', function () {
        console.log('oi orcamento');
        self.pedido = new Pedido();
        $scope.item = new ItemPedido();
        $scope.cliente = {novo: false};
        $scope.lockCodigo = false;
        $scope.lockDescricao = false;
        $scope.typeahead = {
          search: '',
          wait: 100,
          min_length: 3
        };

        focarVendedor();

        jQuery('body').bind('keyup', function (event) {
          if (event.keyCode === 116) {
            self.salvar();
            event.preventDefault();
          }
        });
      });

      $scope.$on("$destroy", function(){
        console.log('tchau orcamento');
        jQuery('body').unbind('keyup');
      });

      $scope.blurCdVendedor = function () {
        if (self.pedido.vendedor.codigo) {
          if ($scope.cdVendedor != self.pedido.vendedor.codigo) {
            setTimeout(function () {
              $scope.cdVendedor = self.pedido.vendedor.codigo;
            }, 100);
          }
        }
      };

      $scope.blurCdCliente = function () {
        if (self.pedido.cliente.codigo) {
          if ($scope.cdCliente != self.pedido.cliente.codigo) {
            setTimeout(function () {
              $scope.cdCliente = self.pedido.cliente.codigo;
            }, 100);
          }
        }
      };

      $scope.blurProduto = function () {
        if ($scope.item.produto.codigo) {
          if ($scope.cdProduto != $scope.item.produto.codigo) {
            setTimeout(function () {
              $scope.cdProduto = $scope.item.produto.codigo;
            }, 100);
          }
        }

        if ($scope.item.produto.nome) {
          if ($scope.nmProduto != $scope.item.produto.nome) {
            setTimeout(function () {
              $scope.nmProduto = $scope.item.produto.nome;
            }, 100);
          }
        }
      };

      $scope.blurCdCEP = function () {
        if (self.pedido.cliente.endereco.cep) {
          if ($scope.cdCEP != parseInt(self.pedido.cliente.endereco.cep)) {
            setTimeout(function () {
              $scope.cdCEP = parseInt(self.pedido.cliente.endereco.cep);
            }, 100);
          }
        }
      };

      $scope.onchangeCPF = function () {
        if (!self.pedido.cliente.cpf) {
          jQuery('input[name="cpf"]').removeClass('input-error');
          return;
        }

        if (self.pedido.cliente.cpf.length == 0) {
          jQuery('input[name="cpf"]').removeClass('input-error');
          return;
        }

        if (!ValidadorDocumento(self.pedido.cliente.cpf)) {
          if (!jQuery('input[name="cpf"]').is('input-error')) {
            jQuery('input[name="cpf"]').addClass('input-error');
          }
        }
      };

      $scope.onchangeCNPJ = function () {
        if (!self.pedido.cliente.cnpj) {
          jQuery('input[name="cnpj"]').removeClass('input-error');
          return;
        }

        if (self.pedido.cliente.cnpj.length == 0) {
          jQuery('input[name="cnpj"]').removeClass('input-error');
          return;
        }

        if (!ValidadorDocumento(self.pedido.cliente.cnpj)) {
          if (!jQuery('input[name="cnpj"]').is('input-error')) {
            jQuery('input[name="cnpj"]').addClass('input-error');
          }
        }
      };

      $scope.scrollTo = function ($event, id) {
        var container = jQuery('body'),
          scrollTo = $event ? jQuery('#' + $event.currentTarget.id) : jQuery(id);

        container.animate({
          scrollTop: scrollTo.offset().top - 20// - container.offset().top + container.scrollTop()
        });
      };

      this.buscaVendedorPorCodigo = function (codigo) {
        if (!codigo) {
          modalBuscarPessoa.show('Vendedor', function (result) {
            if (result) {
              self.pedido.setVendedor(result);
              $scope.cdVendedor = result.codigo;
            }
          });

          return;
        }

        if (parseInt(codigo) == parseInt(this.pedido.vendedor.codigo)) {
          focarProdutos();
          return;
        }

        $rootScope.isLoading = true;
        providerPessoa.obterPessoaPorCodigo('Vendedor', codigo).then(function (success) {
          $rootScope.isLoading = false;
          self.pedido.setVendedor(new Pessoa(Pessoa.converterEmEntrada(success.data)));
          $scope.cdVendedor = self.pedido.vendedor.codigo;
        }, function (error) {
          $rootScope.isLoading = false;
          if (error.status == 404) {
            console.log('Vendedor não encontrado!');
            $rootScope.alerta.show('Vendedor não encontrado!');
          }
        });
      };

      this.limparVendedor = function ($event) {
        if (confirm('Limpar campos do Vendedor?')) {
          $scope.cdVendedor = '';
          this.pedido.removeVendedor();
        }
        if ($event) $event.stopPropagation();
      };

      this.buscaClientePorCodigo = function (codigo) {
        if (!codigo) {
          modalBuscarPessoa.show('Cliente', function (result) {
            if (result) {
              self.pedido.setCliente(result);
              $scope.cdCliente = result.codigo;
            }
          });

          return;
        }

        if (parseInt(codigo) == parseInt(this.pedido.cliente.codigo)) {
          //this.salvar();
          return;
        }

        $rootScope.isLoading = true;
        providerPessoa.obterPessoaPorCodigo('Cliente', codigo).then(function (success) {
          $rootScope.isLoading = false;
          self.pedido.setCliente(new Pessoa(Pessoa.converterEmEntrada(success.data)));
          $scope.cdCliente = self.pedido.cliente.codigo;
        }, function (error) {
          $rootScope.isLoading = false;
          if (error.status == 404) {
            console.log('Cliente não encontrado!');
            $rootScope.alerta.show('Cliente não encontrado!');
            modalBuscarPessoa.show('Cliente', function (result) {
              if (result) {
                self.pedido.setCliente(result);
                $scope.cdCliente = result.codigo;
              }
            });
          }
        });
      };

      this.limparCliente = function ($event, force) {
        if (force ? true : confirm('Limpar campos do cliente?')) {
          $scope.cdCliente = '';
          $scope.cdCEP = '';
          this.pedido.removeCliente();

          $scope.cliente.novo ? jQuery('input[name="nome-cliente"]').focus() : jQuery('input[name="CdCliente"]').focus();

          jQuery('input[name="cpf"]').removeClass('input-error');
          jQuery('input[name="cnpj"]').removeClass('input-error');
        }
        if ($event) $event.stopPropagation();
      };

      this.novoCliente = function () {
        $scope.cliente.novo = true;
        $scope.cdCliente = null;
        this.pedido.cliente = new Pessoa();
        jQuery('input[name="nome-cliente"]').focus();
      };

      function validarCliente() {
        if (!self.pedido.cliente.nome) {
          $rootScope.alerta.show('Preencha todos os campos obrigatórios', 'alert-danger');
          return false;
        }

        if (self.pedido.cliente.tipo == 'F') {
          if (!self.pedido.cliente.cpf) {
            return false;
          } else {
            if (!ValidadorDocumento(self.pedido.cliente.cpf)) {
              $rootScope.alerta.show('CPF Inválido', 'alert-danger');
              return false;
            }
          }
        } else {
          if (!self.pedido.cliente.cnpj || !self.pedido.cliente.iEstadual) {
            return false;
          } else {
            if (!ValidadorDocumento(self.pedido.cliente.cnpj)) {
              $rootScope.alerta.show('CNPJ Inválido', 'alert-danger');
              return false;
            }
          }
        }

        if (!self.pedido.cliente.telefone && (!self.pedido.cliente.dddCelular || !self.pedido.cliente.celular) && !self.pedido.cliente.email) {
          $rootScope.alerta.show('Necessário pelo menos 1 forma de contato', 'alert-danger');
          return false;
        }

        if (!self.pedido.cliente.endereco.cep && !self.pedido.cliente.endereco.logradouro) {
          $rootScope.alerta.show('Preencha todos os campos obrigatórios', 'alert-danger');
          return false;
        }

        if (!self.pedido.cliente.endereco.numero) {
          $rootScope.alerta.show('Preencha todos os campos obrigatórios', 'alert-danger');
          return false;
        }

        return true;
      }

      this.cadastrarCliente = function () {
        if (!validarCliente()) {
          return;
        }

        this.pedido.cliente.tpPessoa = 'Cliente';
        $rootScope.isLoading = true;
        console.log('saida cliente', Pessoa.converterEmSaida(this.pedido.cliente));
        providerPessoa.adicionarPessoa(Pessoa.converterEmSaida(this.pedido.cliente)).then(function (success) {
          self.pedido.setIdCliente(success.data.IdPessoa);
          self.pedido.cliente.codigo = success.data.CdPessoa;
          $scope.cdCliente = self.pedido.cliente.codigo;
          $scope.cliente.novo = false;
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
          if (error.data.status.code == 409) {
            self.pedido.cliente.tipo == 'F' ? alert('CFP já cadastrado!') : alert('CNPJ já cadastrado!');
          }
        });
      };

      this.cancelarCadastroCliente = function () {
        $scope.cliente.novo = false;
        this.limparCliente();
      };

      this.limparProdutos = function ($event) {
        if (!this.pedido.items.length) {
          if ($event) $event.stopPropagation();
          return;
        }

        if (confirm('Deseja remover todos os produtos?')) {
          this.limparProdutoTemp();
          this.pedido.items = [];
        }
        if ($event) $event.stopPropagation();
      };

      this.limparProdutoTemp = function () {
        $scope.item = new ItemPedido();
        $scope.lockDescricao = false;
        $scope.lockCodigo = false;
        $scope.cdProduto = '';
        $scope.nmProduto = '';
        $scope.typeahead.search = '';
        jQuery('input[name="CdProduto"]').focus();
      };

      this.buscaProdutoPorCodigo = function (codigo) {
        if (!codigo || !codigo.length) {
          jQuery('input[name="NmProduto"]').focus();
          return;
        }

        $rootScope.isLoading = true;
        providerProduto.obterProdutoPorCodigo(codigo).then(function (success) {
          if (!success.data.Ativo) {
            $rootScope.isLoading = false;
            alert('Produto inativo!');
            return;
          }
          $scope.lockDescricao = true;
          $rootScope.isLoading = false;
          $scope.item.setProduto(success.data);
          $scope.cdProduto = $scope.item.produto.codigo;
          $scope.nmProduto = $scope.item.produto.nome;
          jQuery('input[name="quantidade"]').focus().select();
        }, function (error) {
          $rootScope.isLoading = false;
          if (error.status == 404) {
            console.log('Produto não encontrado!');
            $rootScope.alerta.show('Produto não encontrado!');
          }
        });
      };

      this.buscaProdutoPorDescricao = function (descricao) {
        $scope.typeahead.search = descricao;
        return providerProduto.obterProdutosPorDescricao(descricao, 10).then(function (success) {
          success.data.push({NmProduto: 'Mais resultados...', CdProduto: -1});
          return success.data;
        }, function (err) {
          console.log(err);
          $rootScope.alerta.show('Produto não encontrado!');
          return;
        });
      };

      this.pesquisarProdutoNoModal = function () {
        modalBuscarProduto.show($scope.typeahead.search, function (result) {
          if (result) {
            self.buscaProdutoPorCodigo(result.codigo);
          }
        });
        this.limparProdutoTemp();
      };

      this.selectProduto = function (item) {
        if (item.CdProduto === -1) {
          this.pesquisarProdutoNoModal();
        } else {
          this.buscaProdutoPorCodigo(item.CdProduto);
          $scope.lockCodigo = true;
        }
      };

      this.removerItem = function (item) {
        if (confirm('Deseja excluir o produto?')) {
          this.pedido.removerItem(item);
        }
      };

      this.addItem = function () {
        if ($rootScope.isLoading) return;

        if (this.pedido.contemItem($scope.item) !== -1) {
          alert('Produto já adicionado!');
          return;
        }

        if (!$scope.item.produto.codigo || !$scope.item.produto.nome) {
          jQuery('input[name="CdProduto"]').focus();
          return;
        }

        this.pedido.addItem($scope.item);
        this.limparProdutoTemp();
        $scope.lockDescricao = false;
        $scope.lockCodigo = false;
        jQuery('input[name="CdProduto"]').focus();
      };

      this.avancar = function (elem, name) {
        jQuery(elem + '[name="' + name + '"]').focus().select();
      };

      this.escapeProdutos = function () {
        focarCliente();
      };

      this.escapeVendedor = function () {
        focarProdutos();
      };

      this.limpar = function (perguntar) {
        var resposta = true;

        if (perguntar) {
          resposta = confirm('Descartar alterações?');
        }

        if (resposta) {
          this.pedido = new Pedido();
          $scope.item = new ItemPedido();
          $scope.cdCliente = null;
          $scope.cdVendedor = null;
          focarVendedor();
        }
      };

      this.buscarCEP = function (forceModal) {
        $rootScope.isLoading = true;

        if (!$scope.cdCEP || forceModal) {
          modalBuscarEndereco.show([], function (result) {
            if (result) {
              self.pedido.cliente.setEndereco(result);
              $scope.cdCEP = self.pedido.cliente.endereco.cep;
            }
          });
        } else {
          providerEndereco.obterEnderecosPorCEP($scope.cdCEP).then(function (success) {
            if (success.data.length > 1) {
              var enderecos = [];
              angular.forEach(success.data, function (item, index) {
                enderecos.push(new Endereco(Endereco.converterEmEntrada(item)));
              });
              $rootScope.isLoading = false;
              modalBuscarEndereco.show(enderecos, function (result) {
                if (result) {
                  self.pedido.cliente.setEndereco(result);
                  $scope.cdCEP = self.pedido.cliente.endereco.cep;
                }
              });
            } else {
              self.pedido.cliente.setEndereco(new Endereco(Endereco.converterEmEntrada(success.data[0])));
              $rootScope.isLoading = false;
            }
            jQuery('input[name="endNumero"]').focus();
          }, function (error) {
            $rootScope.isLoading = false;
            if (error.status == 404) {
              console.log('CEP não encontrado!');
              $rootScope.alerta.show('CEP não encontrado!');
            }
          });
        }

        $rootScope.isLoading = false;
      };

      function validar() {
        if (!self.pedido.idVendedor) {
          focarVendedor();

          $rootScope.alerta.show('Vendedor não informado', 'alert-danger');

          return false;
        }

        if (self.pedido.items.length == 0) {
          focarProdutos();

          $rootScope.alerta.show('Orçamento vazio', 'alert-danger');

          return false;
        }

        if (!self.pedido.idCliente && !self.pedido.cliente.nome) {
          //if (!self.pedido.cliente.telefone && !self.pedido.cliente.celular && !self.pedido.cliente.email) {
          focarCliente();

          $rootScope.alerta.show('Cliente não informado', 'alert-danger');

          return false;
          //}
        }

        return true;
      }

      this.pagamento = function () {
        if (validar()) {
          modalPagamento.show(this.pedido, function (result) {
            if (result && self.pedido.troco() == 0) {
              self.salvar();
            }
          });
        }
      };


      this.salvar = function () {
        if (backup.compare(this.pedido)) {
          $rootScope.alerta.show('Nenhuma alteração!');
          return;
        }

        if (!this.pedido.pagamentos.length || this.pedido.troco() != 0) {
          this.pagamento();
          return;
        }

        if (confirm('Salvar orçamento?')) {
          console.log('saida pedido', Pedido.converterEmSaida(this.pedido));
          $uibModalStack.dismissAll();

          $rootScope.isLoading = true;

          if (!this.pedido.id && !this.pedido.codigo) { // salvar novo
            providerPedido.adicionarPedido(Pedido.converterEmSaida(this.pedido)).then(function (success) {
              var result = new Pedido(Pedido.converterEmEntrada(success.data));
              backup = null;
              self.pedido.id = result.id;
              self.pedido.codigo = result.codigo;
              $rootScope.alerta.show('Orçamento código ' + result.codigo + ' salvo!', 'alert-success');
              $rootScope.isLoading = false;
              $scope.mostrarOpcoes();
            }, function (error) {
              console.log(error);
              $rootScope.isLoading = false;
            });
          } else { // salvar editado
            providerPedido.editarPedido(Pedido.converterEmSaida(this.pedido)).then(function (success) {
              backup = null;
              $rootScope.alerta.show('Orçamento código ' + new Pedido(Pedido.converterEmEntrada(success.data)).codigo + ' salvo!', 'alert-success');
              $rootScope.isLoading = false;
              $scope.mostrarOpcoes();
            }, function (error) {
              console.log(error);
              $rootScope.isLoading = false;
            });
          }
        }
      };

      this.imprimir = function () {
        if (!this.pedido.items.length || !this.pedido.id) {
          $scope.alerta.show('O orçamento precisa ser salvo primeiro!');
          return;
        }

        if (backup && !backup.compare(this.pedido)) {
          $scope.alerta.show('As alterações precisam ser salvas!');
          return;
        }

        window.print();
      };

      this.enviar = function () {
        alert('Em breve!');
      };

      this.excluir = function () {
        if (!this.pedido.id && !this.pedido.codigo) {
          this.limpar(true);
          return;
        }

        if (confirm('Deseja excluir o orçamento?')) {
          providerPedido.excluirPedido(self.pedido).then(function (success) {
            self.limpar();
            alert('Orçamento excluído!');
          }, function (error) {
            console.log(error);
            alert('Não foi possível excluir o orçamento.');
          });
        }
      };

      $scope.mostrarOpcoes = function () {
        jQuery('.opcoes').css('display', 'inline').fadeTo('fast', 1);
      };

      $scope.ocultarOpcoes = function () {
        self.limpar();
        jQuery('.opcoes').fadeTo('fast', 0, function () {
          jQuery(this).css('display', 'none');
        });
      };

      $scope.lista = function () {
        modalBuscarPedido.show(null, function (result) {
          if (result) {
            self.limpar();
            $scope.formularios.vendedor = false;
            $scope.formularios.produtos = false;
            $scope.formularios.cliente = false;
            $scope.lockCodigo = false;
            $scope.lockDescricao = false;
            $scope.cdVendedor = result.vendedor.codigo;
            $scope.cdCliente = result.cliente.codigo;
            $scope.cdCEP = result.cliente.endereco.cep;
            self.pedido = new Pedido(result);
            backup = new Pedido(result);
          }
        });
      };
    }]);
