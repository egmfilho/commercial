/**
 * Created by egmfilho on 16/08/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('Pessoa', ['DataSaida', 'Endereco', function(data, Endereco) {

    function Pessoa(pessoa) {
      this.id = pessoa ? pessoa.id : '';
      this.idLoja = pessoa ? pessoa.idLoja : '';
      this.codigo = pessoa ? pessoa.codigo : '';
      this.nome = pessoa ? pessoa.nome : '';
      this.cpf = pessoa ? pessoa.cpf : '';
      this.cnpj = pessoa ? pessoa.cnpj : '';
      this.iEstadual = pessoa ? pessoa.iEstadual : '';
      this.tipo = pessoa ? pessoa.tipo : 'F';
      this.telefone = pessoa ? pessoa.telefone : '';
      this.dddCelular = pessoa ? pessoa.dddCelular : '';
      this.celular = pessoa ? pessoa.celular : '';
      this.email = pessoa ? pessoa.email : '';
      this.ativo = pessoa ? pessoa.ativo : true;
      this.origem = pessoa ? pessoa.origem : '';
      this.cadastro = pessoa ? pessoa.cadastro : new Date();
      this.enderecoId = pessoa ? pessoa.enderecoId : '';
      this.endereco = pessoa ? pessoa.endereco : new Endereco();
      this.tpPessoa = pessoa ? pessoa.tpPessoa : ''; // Cliente / Funcionario
    }

    Pessoa.prototype = {
      setEndereco: function(endereco) {
        this.enderecoId = endereco.enderecoId || '';
        this.endereco = new Endereco(endereco);

        if (!this.dddCelular) {
          this.dddCelular = endereco.ddd;
        }
      }
    };

    Pessoa.converterEmEntrada = function(p) {
      var pessoa = { };

      pessoa.id = p.Id;
      pessoa.idLoja = p.IdLoja;
      pessoa.codigo = p.Codigo;
      pessoa.nome = p.Nome;
      pessoa.tipo = p.Tp;

      if (p.Tp) {
        pessoa.cpf = p.Tp.toUpperCase() === 'F' ? p.Doc : '';
        pessoa.cnpj = p.Tp.toUpperCase() === 'J' ? p.Doc : '';
      } else {
        pessoa.cpf = '';
        pessoa.cnpj = '';
      }

      pessoa.iEstadual = p.IEstadual;
      pessoa.telefone = p.Telefone;

      if (p.Celular) {
        pessoa.celular = p.Celular.length >= 11 ? p.Celular.substr(2, 9) : '';
        pessoa.dddCelular = p.Celular.length >= 11 ? p.Celular.substr(0, 2) : '';
      } else {
        pessoa.celular = '';
        pessoa.dddCelular = '';
      }

      pessoa.email = p.Email;
      pessoa.ativo = p.Ativo === 'S';
      pessoa.origem = p.Origem;
      pessoa.cadastro = new Date(p.Cadastro);

      if (p.Cep) {
        pessoa.enderecoId = p.IdCep;
        pessoa.endereco = new Endereco(Endereco.converterEmEntrada(p.Cep));
        if (pessoa.dddCelular == '') {
          pessoa.dddCelular = p.Cep.DDD;
        }
      } else {
        pessoa.enderecoId = '';
        pessoa.endereco = new Endereco();
      }

      pessoa.tpPessoa = '';

      return pessoa;
    };

    Pessoa.converterEmSaida = function(pessoa) {
      var p = { };

      p.Id = pessoa.id;
      p.IdLoja = pessoa.idLoja;
      p.Codigo = pessoa.codigo;
      p.Nome = pessoa.nome;
      p.Tp = pessoa.tipo;
      p.Doc = pessoa.tipo == 'F' ? pessoa.cpf : pessoa.cnpj;
      p.IEstadual = pessoa.iEstadual;
      p.Telefone = pessoa.telefone;
      p.Celular = pessoa.celular.length > 0 ? pessoa.dddCelular + pessoa.celular : '';
      p.Email = pessoa.email;
      p.Ativo = pessoa.ativo;
      p.Origem = pessoa.origem;
      p.IdCep = pessoa.enderecoId;
      p.Cadastro = data.converter(pessoa.cadastro);
      p.Cep = Endereco.converterEmSaida(pessoa.endereco);

      p.TpPessoa = pessoa.tpPessoa;

      return p;
    };

    return Pessoa;

  }]);
