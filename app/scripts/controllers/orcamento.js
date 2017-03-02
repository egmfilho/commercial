/**
 * Created by egmfilho on 14/06/16.
 */

'use strict';

angular.module('commercialApp.controllers').controller('OrcamentoCtrl', Orcamento);

Orcamento.$inject = [
  '$rootScope',
  '$scope',
  '$timeout',
  '$routeParams',
  '$location',
  '$cookies',
  'ProviderPedido',
  'ProviderPessoa',
  'ProviderProduto',
  'ProviderEndereco',
  'ProviderUsuario',
  'Usuario',
  'ItemPedido',
  'Pedido',
  'Pessoa',
  'Endereco',
  'ModalPagamento',
  'ModalBuscarPessoa',
  'ModalBuscarEndereco',
  'ModalBuscarProduto',
  'ModalBuscarPedido',
  'ModalConfirm',
  'ModalAlert',
  'ValidadorDocumento'
];

function Orcamento(
  $rootScope,
  $scope,
  $timeout,
  $routeParams,
  $location,
  $cookies,
  providerPedido,
  providerPessoa,
  providerProduto,
  providerEndereco,
  providerUsuario,
  Usuario,
  ItemPedido,
  Pedido,
  Pessoa,
  Endereco,
  modalPagamento,
  modalBuscarPessoa,
  modalBuscarEndereco,
  modalBuscarProduto,
  modalBuscarPedido,
  modalConfirm,
  modalAlert,
  ValidadorDocumento) {

  var self = this,
      user = JSON.parse(window.atob($cookies.get('currentUser')));

  $scope.backup = null;

  $scope.getHoje = function () {
    return new Date();
  };

  self.emails = [ ];
  self.contatos = [ ];
  self.usuarios = [ ];

  // retira o padding-right que compensa o scroll se o SO for um MacOS
  if (navigator.platform === 'MacIntel') {
    angular.element('#tabela-orcamento thead tr').css('padding-right', '0px');
  }

  $scope.escondeAtalhos = function() {
    jQuery('.atalhos-flutuantes').fadeOut('slow');
  };

  $scope.$on('$viewContentLoaded', function () {
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
    $scope.typeaheadCliente = {
      search: '',
      wait: 500,
      min_length: 3
    };
    $scope.typeaheadVendedor = {
      search: '',
      wait: 500,
      min_length: 3
    };

    focarVendedor();

    jQuery('body').bind('keyup', function (event) {
      // TECLA F5
      if (event.keyCode === 116) {
        self.salvar();
        event.preventDefault();
      }
    });

    if ($routeParams.action) {
      if ($routeParams.action == 'edit') {
        if (!$routeParams.code) {
          return;
        }
        $rootScope.loading.load();
        providerPedido.obterPedidoPorCodigo($routeParams.code, true, true, true, true, true, true, true).then(function(success) {
          setPedido(new Pedido(Pedido.converterEmEntrada(success.data)));
          //@ console.log(self.pedido);
          if (self.pedido.erp) {
            jQuery('#formulario-orcamento input, textarea, .input-group-btn .btn').prop('disabled', true).prop('tabindex', '-1');
          }
          $rootScope.loading.unload();
        }, function(error) {
          $rootScope.loading.unload();
        });
      } else if ($routeParams.action == 'new') {

      } else {
        $location.path('/');
      }
    }
  });

  $scope.$on("$destroy", function () {
    jQuery('body').unbind('keyup');
  });

  function getUsuarios() {
    $rootScope.loading.load();
    self.usuarios = [ ];
    providerUsuario.obterTodos().then(function(success) {
      angular.forEach(success.data, function(item, index) {
        self.usuarios.push(new Usuario(Usuario.converterEmEntrada(item)));
      });
      $rootScope.loading.unload();
    }, function(error) {
      //@ console.log(error);
      $rootScope.loading.unload();
    });
  }
  getUsuarios();

  function setContatos() {
    self.contatos = [ ];
    self.emails = [ ];
    angular.forEach(self.pedido.emailsEnviados, function(item, index) {
      self.emails.push({
        nome: item.nome,
        email: item.email,
        isTag: item.nome === 'Externo'
      })
    });
    //@ console.log(self.emails);

    angular.forEach(self.usuarios, function(item, index) {
      self.contatos.push({
        nome: item.nome,
        email: item.email,
        isTag: false
      });
    });

    if (self.pedido.cliente.email) {
      var cliente = { nome: self.pedido.cliente.nome, email: self.pedido.cliente.email, isTag: false };
      if (!self.contatos.find(function(c) {
          return c.email == cliente.email;
        })) {
        self.contatos.push(cliente);
      }
      if (!self.emails.find(function(e) {
          return e.email == cliente.email;
        })) {
        self.emails.push(cliente);
      }
    }
  }

  function focarVendedor() {
    $scope.formularios.vendedor = true;
    $scope.formularios.cliente = false;
    $scope.formularios.produtos = false;
    $scope.formularios.observacoes = false;

    $timeout(function () {
      jQuery('input[name="CdVendedor"]').focus();
    }, 350);
  }

  function focarProdutos() {
    $scope.formularios.vendedor = false;
    $scope.formularios.produtos = true;
    $scope.formularios.cliente = false;
    $scope.formularios.observacoes = false;

    $timeout(function () {
      $scope.scrollTo(null, '#form-produtos');
      jQuery('input[name="CdProduto"]').focus();
    }, 350);
  }

  function focarCliente() {
    $scope.formularios.vendedor = false;
    $scope.formularios.produtos = false;
    $scope.formularios.cliente = true;
    $scope.formularios.observacoes = false;

    $timeout(function () {
      $scope.scrollTo(null, '#form-cliente');
      jQuery('input[name="CdCliente"]').focus();
    }, 350);
  }

  function focarObservacoes() {
    $scope.formularios.vendedor = false;
    $scope.formularios.produtos = false;
    $scope.formularios.cliente = false;
    $scope.formularios.observacoes = true;

    $timeout(function () {
      $scope.scrollTo(null, '#form-observacoes');
      jQuery('textarea[name="obs"]').focus();
    }, 350);
  }

  function setPedido(pedido) {
    // self.limpar();
    $scope.formularios.vendedor = false;
    $scope.formularios.produtos = false;
    $scope.formularios.cliente = false;
    $scope.formularios.observacoes = false;
    $scope.lockCodigo = false;
    $scope.lockDescricao = false;
    $scope.cdVendedor = pedido.vendedor.codigo;
    $scope.cdCliente = pedido.cliente.codigo;
    $scope.cdCEP = pedido.cliente.endereco.cep;
    self.pedido = new Pedido(pedido);
    $scope.backup = new Pedido(pedido);

    setContatos();
  }

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

  this.buscaVendedor = function() {
    modalBuscarPessoa.show('Vendedor', $scope.typeaheadVendedor.search).then(function (result) {
      if (result) {
        self.pedido.setVendedor(result);
        $scope.cdVendedor = result.codigo;
        jQuery('input[name="CdVendedor"]').focus().select();
      }
    }, function (error) {
      jQuery('input[name="CdVendedor"]').focus().select();
    });
  };

  this.buscaVendedorPorCodigo = function (codigo) {
    if (!codigo) {
      this.buscaVendedor();

      return;
    }

    if (parseInt(codigo) == parseInt(this.pedido.vendedor.codigo)) {
      focarProdutos();
      return;
    }

    $rootScope.loading.load();
    providerPessoa.obterPessoaPorCodigo('Vendedor', codigo).then(function (success) {
      $rootScope.loading.unload();
      self.pedido.setVendedor(new Pessoa(Pessoa.converterEmEntrada(success.data)));
      $scope.cdVendedor = self.pedido.vendedor.codigo;
    }, function (error) {
      $rootScope.loading.unload();
      if (error.status == 404) {
        //@ console.log('Vendedor não encontrado!');
        $rootScope.alerta.show('Vendedor não encontrado!');
      }
    });
  };

  this.buscaVendedorPorNome = function(nome) {
    $scope.typeaheadVendedor.search = nome;
    $rootScope.loading.load();
    return providerPessoa.obterPessoasPorNome('Vendedor', nome, 10).then(function(success) {
      var vendedores = [];
      angular.forEach(success.data, function(item, index) {
        vendedores.push(new Pessoa(Pessoa.converterEmEntrada(item)));
      });
      vendedores.push({ codigo: -1, nome: 'Mais resultados...'});
      $rootScope.loading.unload();
      return vendedores;
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
      return [];
    });
  };

  this.selectVendedor = function(vendedor) {
    if (vendedor.codigo === -1) {
      this.buscaVendedor();
      this.pedido.setVendedor(new Pessoa());
    } else {
      $scope.cdVendedor = vendedor.codigo;
      self.pedido.setVendedor(new Pessoa(vendedor));
    }
  };

  this.limparVendedor = function ($event) {
    modalConfirm.show('Aviso', 'Limpar campos do Vendedor?').then(function() {
      $scope.cdVendedor = '';
      self.pedido.removeVendedor();
    });
    if ($event) $event.stopPropagation();
  };

  this.buscarCliente = function () {
    modalBuscarPessoa.show('Cliente', $scope.typeaheadCliente.search).then(function (result) {
      if (result) {
        if (!self.pedido.setCliente(result)) {
          $rootScope.alerta.show('Cliente inativo!');
        }
        $scope.cdCliente = result.codigo;
        setContatos();
        jQuery('input[name="CdCliente"]').focus().select();
      }
    }, function (error) {
      jQuery('input[name="CdCliente"]').focus().select();
    });
  };

  this.buscaClientePorCodigo = function (codigo) {
    if (!codigo) {
      this.buscarCliente();
      return;
    }

    if (parseInt(codigo) == parseInt(this.pedido.cliente.codigo)) {
      //this.salvar();
      return;
    }

    $rootScope.loading.load();
    providerPessoa.obterPessoaPorCodigo('Cliente', codigo).then(function (success) {
      $rootScope.loading.unload();
      var cliente = new Pessoa(Pessoa.converterEmEntrada(success.data));
      // if (!cliente.ativo) {
      //   $rootScope.alerta.show('Cliente inativo!');
      //   jQuery('input[name="CdCliente"]').focus().select();
      //   return;
      // }
      self.pedido.setCliente(cliente);
      $scope.cdCliente = self.pedido.cliente.codigo;
      setContatos();
    }, function (error) {
      $rootScope.loading.unload();
      if (error.status == 404) {
        //@ console.log('Cliente não encontrado!');
        $rootScope.alerta.show('Cliente não encontrado!');
        modalBuscarPessoa.show('Cliente').then(function (result) {
          if (result) {
            if (!self.pedido.setCliente(result)) {
              $rootScope.alerta.show('Cliente inativo!');
            }
            setContatos();
            $scope.cdCliente = result.codigo;
            jQuery('input[name="CdCliente"]').focus().select();
          }
        }, function (error) {
          jQuery('input[name="CdCliente"]').focus().select();
        });
      }
    });
  };

  this.buscaClientePorNome = function(nome) {
    $scope.typeaheadCliente.search = nome;
    $rootScope.loading.load();
    return providerPessoa.obterPessoasPorNome('Cliente', nome, 10).then(function(success) {
      var clientes = [];
      angular.forEach(success.data, function(item, index) {
        clientes.push(new Pessoa(Pessoa.converterEmEntrada(item)));
      });
      clientes.push({ codigo: -1, nome: 'Mais resultados...'});
      $rootScope.loading.unload();
      return clientes;
    }, function(error) {
      console.log(error);
      $rootScope.loading.unload();
      return [];
    });
  };

  this.selectCliente = function(cliente) {
    if (cliente.codigo === -1) {
      this.buscarCliente();
      this.pedido.setCliente(new Pessoa());
    } else {
      $scope.cdCliente = cliente.codigo;
      self.pedido.setCliente(new Pessoa(cliente));
      setContatos();
    }
  };

  this.limparCliente = function ($event, force) {
    function limpa() {
      $scope.cdCliente = '';
      $scope.cdCEP = '';
      self.pedido.removeCliente();

      $scope.cliente.novo ? jQuery('input[name="nome-cliente"]').focus() : jQuery('input[name="CdCliente"]').focus();

      jQuery('input[name="cpf"]').removeClass('input-error');
      jQuery('input[name="cnpj"]').removeClass('input-error');
    }

    if (!force) {
      modalConfirm.show('Aviso', 'Limpar campos do cliente?').then(limpa);
    } else {
      limpa();
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
    $rootScope.loading.load();
    //@ console.log('saida cliente', Pessoa.converterEmSaida(this.pedido.cliente));
    providerPessoa.adicionarPessoa(Pessoa.converterEmSaida(this.pedido.cliente)).then(function (success) {
      self.pedido.setIdCliente(success.data.IdPessoa);
      self.pedido.cliente.codigo = success.data.CdPessoa;
      $scope.cdCliente = self.pedido.cliente.codigo;
      $scope.cliente.novo = false;
      $rootScope.loading.unload();
    }, function (error) {
      //@ console.log(error);
      $rootScope.loading.unload();
      if (error.data.status.code == 409) {
        self.pedido.cliente.tipo == 'F' ? modalAlert.show('Aviso', 'CFP já cadastrado!') : modalAlert.show('Aviso', 'CNPJ já cadastrado!');
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

    modalConfirm.show('Aviso', 'Deseja remover todos os produtos?').then(function() {
      self.limparProdutoTemp();
      self.pedido.items = [];
    });

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

    $rootScope.loading.load();
    providerProduto.obterProdutoPorCodigo(codigo, self.pedido.id ? self.pedido.idPrecos : user.precosId).then(function (success) {
      if (!success.data.Ativo) {
        $rootScope.loading.unload();
        modalAlert.show('Aviso', 'Produto inativo!');
        return;
      }
      $scope.lockDescricao = true;
      $rootScope.loading.unload();
      $scope.item.setProduto(success.data);
      $scope.cdProduto = $scope.item.produto.codigo;
      $scope.nmProduto = $scope.item.produto.nome;
      jQuery('input[name="quantidade"]').focus().select();
    }, function (error) {
      $rootScope.loading.unload();
      if (error.status == 404) {
        //@ console.log('Produto não encontrado!');
        $rootScope.alerta.show('Produto não encontrado!');
      }
    });
  };

  this.buscaProdutoPorDescricao = function (descricao) {
    $scope.typeahead.search = descricao;
    $rootScope.loading.load();
    return providerProduto.obterProdutosPorDescricao(descricao, 10, self.pedido.id ? self.pedido.idPrecos : user.precosId).then(function (success) {
      success.data.push({NmProduto: 'Mais resultados...', CdProduto: -1});
      $rootScope.loading.unload();
      return success.data;
    }, function (err) {
      //@ console.log(err);
      $rootScope.loading.unload();
      $rootScope.alerta.show('Produto não encontrado!');
    });
  };

  this.pesquisarProdutoNoModal = function () {
    modalBuscarProduto.show($scope.typeahead.search).then(function (result) {
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
    this.pedido.removerItem(item);
  };

  this.addItem = function () {
    if ($rootScope.isLoading) return;

    if (this.pedido.contemItem($scope.item) !== -1) {
      modalAlert.show('Aviso', 'Produto já adicionado!');
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

  this.escapeCliente = function () {
    focarObservacoes();
  };

  this.limpar = function (perguntar) {

    function limpa() {
      self.pedido = new Pedido();
      $scope.item = new ItemPedido();
      $scope.cdCliente = null;
      $scope.cdVendedor = null;
      focarVendedor();
      $location.search('code', null);
      $location.path('/orcamento/new');
    }

    if (perguntar) {
      modalConfirm.show('Aviso', 'Descartar alterações?').then(function() {
        setTimeout(function() {
          limpa();
        }, 300);
      });
    } else {
      limpa();
    }
  };

  this.buscarCEP = function (forceModal) {
    $rootScope.loading.load();

    if (!$scope.cdCEP || forceModal) {
      modalBuscarEndereco.show([]).then(function (result) {
        if (result) {
          self.pedido.cliente.setEndereco(result);
          $scope.cdCEP = self.pedido.cliente.endereco.cep;
          jQuery('input[name="endNumero"]').focus();
        }
      });
    } else {
      providerEndereco.obterEnderecosPorCEP($scope.cdCEP).then(function (success) {
        if (success.data.length > 1) {
          var enderecos = [];
          angular.forEach(success.data, function (item, index) {
            enderecos.push(new Endereco(Endereco.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
          modalBuscarEndereco.show(enderecos, function (result) {
            if (result) {
              self.pedido.cliente.setEndereco(result);
              $scope.cdCEP = self.pedido.cliente.endereco.cep;
            }
          });
        } else {
          self.pedido.cliente.setEndereco(new Endereco(Endereco.converterEmEntrada(success.data[0])));
          $rootScope.loading.unload();
        }
        jQuery('input[name="endNumero"]').focus();
      }, function (error) {
        $rootScope.loading.unload();
        if (error.status == 404) {
          //@ console.log('CEP não encontrado!');
          $rootScope.alerta.show('CEP não encontrado!');
        }
      });
    }

    $rootScope.loading.unload();
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
      focarCliente();

      $rootScope.alerta.show('Cliente não informado', 'alert-danger');

      return false;
    }

    return true;
  }

  this.pagamento = function () {
    if (validar()) {
      modalPagamento.show(this.pedido, function (result) {
        // if (result && self.pedido.troco() == 0) {
        if (result) {
          self.salvar();
        }
      });
    }
  };

  this.salvar = function () {
    if (self.pedido.idStatus != 1001 || self.pedido.erp) {
      return;
    }

    if ($scope.backup) {
      if ($scope.backup.compare(this.pedido)) {
        $rootScope.alerta.show('Nenhuma alteração!');
        return;
      }
    }

    if (validar()) {

      // if (!this.pedido.pagamentos.length || this.pedido.troco() != 0) {
      //   this.pagamento();
      //   return;
      // }
      if (this.pedido.pagamentos.length) {
        if (this.pedido.troco() != 0) {
          self.pedido.pagamentos[0].valor = self.pedido.getValorTotalComDesconto();
        }
      }

      modalConfirm.show('Aviso', 'Salvar orçamento?').then(function() {
        //@ console.log('saida pedido', Pedido.converterEmSaida(self.pedido));
        // $uibModalStack.dismissAll();

        $rootScope.loading.load();

        if (!self.pedido.id && !self.pedido.codigo) { // salvar novo
          providerPedido.adicionarPedido(Pedido.converterEmSaida(self.pedido)).then(function (success) {
            var result = new Pedido(Pedido.converterEmEntrada(success.data));
            //@ console.log(result);
            $scope.backup = null;
            self.pedido.id = result.id;
            self.pedido.codigo = result.codigo;
            self.pedido.setLoja(result.loja);
            self.pedido.mensagem = result.mensagem;
            //@ console.log(self.pedido);
            $rootScope.alerta.show('Orçamento código ' + result.codigo + ' salvo!', 'alert-success');
            $rootScope.loading.unload();
            $scope.mostrarOpcoesSalvo();
          }, function (error) {
            //@ console.log(error);
            $rootScope.loading.unload();
          });
        } else { // salvar editado
          providerPedido.editarPedido(Pedido.converterEmSaida(self.pedido)).then(function (success) {
            $scope.backup = null;
            $rootScope.alerta.show('Orçamento código ' + new Pedido(Pedido.converterEmEntrada(success.data)).codigo + ' salvo!', 'alert-success');
            $rootScope.loading.unload();
            $scope.mostrarOpcoesSalvo();
          }, function (error) {
            //@ console.log(error);
            $rootScope.loading.unload();
          });
        }
      });
    }
  };

  this.imprimir = function () {
    if (!this.pedido.items.length || !this.pedido.id) {
      $scope.alerta.show('O orçamento precisa ser salvo primeiro!');
      return;
    }

    if ($scope.backup && !$scope.backup.compare(this.pedido)) {
      $scope.alerta.show('As alterações precisam ser salvas!');
      return;
    }

    window.print();
  };

  this.enviar = function () {
    if (!this.pedido.items.length || !this.pedido.id) {
      $scope.alerta.show('O orçamento precisa ser salvo primeiro!');
      return;
    }

    if ($scope.backup) {
      if (!$scope.backup.compare(this.pedido)) {
        $scope.alerta.show('O orçamento precisa ser salvo primeiro!');
        return;
      }
    }

    jQuery('#modalEmail').modal('show');
  };

  this.excluir = function () {
    if (this.pedido.erp) {
      return;
    }

    if (this.pedido.atendimentoId) {
      $rootScope.alerta.show('Não é possível excluir pois o orçamento possui um atendimento em aberto!', 'alert-danger');
      return;
    }

    if (!this.pedido.id && !this.pedido.codigo) {
      this.limpar(true);
      return;
    }

    modalConfirm.show('Aviso', 'Deseja excluir o orçamento?').then(function() {
      providerPedido.excluirPedido(self.pedido).then(function (success) {
        modalAlert.show('Aviso', 'Orçamento excluído!').then(function() {
          self.limpar();
        });
      }, function (error) {
        //@ console.log(error);
        modalAlert.show('Aviso', 'Não foi possível excluir o orçamento.');
      });
    });
  };

  $scope.mostrarOpcoesSalvo = function () {
    jQuery('.opcoes.salvo').css('display', 'inline').fadeTo('fast', 1);
  };

  $scope.mostrarOpcoesExportado = function () {
    jQuery('.opcoes.exportado').css('display', 'inline').fadeTo('fast', 1);
  };

  $scope.ocultarOpcoes = function (limpar) {
    jQuery('.opcoes').fadeTo('fast', 0, function () {
      jQuery(this).css('display', 'none');
      if (limpar) {
        setTimeout(function() {
          self.limpar();
        }, 200);
      }
    });
  };

  $scope.buscarOrcamento = function () {
    modalBuscarPedido.show('orcamento/edit');
  };

  self.abrirAtendimento = function () {
    if (self.pedido.atendimentoId) {
      $location.path('/atendimento/open').search('type', 'order').search('code', self.pedido.codigo);
    } else {
      $location.path('/atendimento/new').search('type', 'order').search('code', self.pedido.codigo);
    }
  };

  self.emailExterno = function (email) {
    return ({
      nome: 'Externo',
      email: email,
      isTag: true
    });
  };

  self.enviarEmail = function(endereco) {
    if (!this.pedido.items.length || !this.pedido.id) {
      $scope.alerta.show('O orçamento precisa ser salvo primeiro!');
      return;
    }

    if (!self.emails) {
      $scope.alerta.show('Nenhum email informado!');
      return;
    }

    var addresses = '';
    angular.forEach(self.emails, function (item, index) {
      addresses += item.nome + ':' + item.email + (index === (self.emails.length - 1) ? '' : ';');
    });

    // modalConfirm.show('Aviso', 'Enviar orçamento por email?').then(function() {
      $rootScope.loading.load();
      providerPedido.email(self.pedido.codigo, addresses).then(function(success) {
        $rootScope.loading.unload();
        $rootScope.alerta.show('Email enviado!', 'alert-success');
      }, function(error) {
        //@ console.log(error);
        $rootScope.loading.unload();
        $rootScope.alerta.show(error.data.status.message + ' ' + error.data.status.description, 'alert-danger');
      });
    // });
  };

  self.exportar = function() {
    if (self.pedido.idStatus != 1001 || self.pedido.erp) {
      return;
    }

    if (!this.pedido.items.length || !this.pedido.id) {
      $rootScope.alerta.show('O orçamento precisa ser salvo antes!');
      return;
    }

    if ($scope.backup) {
      if (!$scope.backup.compare(this.pedido)) {
        $rootScope.alerta.show('O orçamento precisa ser salvo antes!');
        return;
      }
    }

    modalConfirm.show('Exportar para venda?', 'Depois de exportado, o orçamento não poderá mais ser editado. Deseja continuar?').then(function() {
      $scope.ocultarOpcoes();
      $rootScope.loading.load();
      providerPedido.exportar(self.pedido.id).then(function(success) {
        var p = new Pedido(Pedido.converterEmEntrada(success.data));
        self.pedido.erp = p.erp;
        self.pedido.idStatus = p.idStatus;
        $rootScope.loading.unload();
        $rootScope.alerta.show('Orçamento foi exportado!', 'alert-success');
        $scope.mostrarOpcoesExportado();
      }, function(error) {
        //@ console.log(error);
        $rootScope.loading.unload();
        $rootScope.alerta.show('Não foi possível exportar o orçamento!', 'alert-danger');
      });
    });
  };
}
