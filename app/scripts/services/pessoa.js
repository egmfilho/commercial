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
      this.doc = pessoa ? pessoa.doc : '';
      this.tipo = pessoa ? pessoa.tipo : '';
      this.telefone = pessoa ? pessoa.telefone : '';
      this.celular = pessoa ? pessoa.celular : '';
      this.email = pessoa ? pessoa.email : '';
      this.ativo = pessoa ? pessoa.ativo : true;
      this.origem = pessoa ? pessoa.origem : '';
      this.cadastro = pessoa ? pessoa.cadastro : '';
      this.cepId = pessoa ? pessoa.cepId : '';
      this.endereco = pessoa ? pessoa.endereco : new Endereco();
    }

    Pessoa.converterEmEntrada = function(p) {
      var pessoa = { };

      pessoa.id = p.Id;
      pessoa.idLoja = p.IdLoja;
      pessoa.codigo = p.Codigo;
      pessoa.nome = p.Nome;
      pessoa.doc = p.Doc;
      pessoa.tipo = p.Tp;
      pessoa.telefone = p.Telefone;
      pessoa.celular = p.Celular;
      pessoa.email = p.Email;
      pessoa.ativo = p.Ativo;
      pessoa.origem = p.Origem;
      pessoa.cadastro = new Date(p.Cadastro);

      if (p.Cep) {
        pessoa.enderecoId = p.IdCep;
        pessoa.endereco = new Endereco(Endereco.converterEmEntrada(p.Cep));
      } else {
        pessoa.enderecoId = '';
        pessoa.endereco = new Endereco();
      }

      return pessoa;
    };

    Pessoa.prototype = {
      setEndereco: function(endereco) {
        this.enderecoId = endereco.enderecoId;
        this.endereco = new Endereco(endereco);
      }
    };

    Pessoa.converterEmSaida = function(pessoa) {
      var p = { };

      p.Id = pessoa.id;
      p.IdLoja = pessoa.idLoja;
      p.Codigo = pessoa.codigo;
      p.Nome = pessoa.nome;
      p.Doc = pessoa.doc;
      p.Tp = pessoa.tipo;
      p.Telefone = pessoa.telefone;
      p.Celular = pessoa.celular;
      p.Email = pessoa.email;
      p.Ativo = pessoa.ativo;
      p.Origem = pessoa.origem;
      p.IdCep = pessoa.enderecoId;
      p.Cadastro = data.converter(pessoa.cadastro);
      p.Cep = Endereco.converterEmSaida(pessoa.endereco);

      return p;
    };

    return Pessoa;

  }]);
