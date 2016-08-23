/**
 * Created by egmfilho on 16/08/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('Pessoa', ['DataSaida', function(data) {

    function Pessoa(pessoa) {
      this.id = pessoa ? pessoa.id : '';
      this.idLoja = pessoa ? pessoa.idLoja : '';
      this.codigo = pessoa ? pessoa.codigo : '';
      this.nome = pessoa ? pessoa.nome : '';
      this.tipo = pessoa ? pessoa.tipo : '';
      this.telefone = pessoa ? pessoa.telefone : '';
      this.celular = pessoa ? pessoa.celular : '';
      this.email = pessoa ? pessoa.email : '';
      this.ativo = pessoa ? pessoa.ativo : true;
      this.origem = pessoa ? pessoa.origem : '';
      this.cadastro = pessoa ? pessoa.cadastro : '';
    }

    Pessoa.converterEmEntrada = function(p) {
      var pessoa = { };

      pessoa.id = p.Id;
      pessoa.idLoja = p.LojaId;
      pessoa.codigo = p.Codigo;
      pessoa.nome = p.Nome;
      pessoa.tipo = p.Tp;
      pessoa.telefone = p.Telefone;
      pessoa.celular = p.Celular;
      pessoa.email = p.Email;
      pessoa.ativo = p.Ativo;
      pessoa.origem = p.Origem;
      pessoa.cadastro = new Date(p.Cadastro);

      return pessoa;
    };

    Pessoa.converterEmSaida = function(pessoa) {
      var p = { };

      p.Id = pessoa.id;
      p.LojaId = pessoa.idLoja;
      p.Codigo = pessoa.codigo;
      p.Nome = pessoa.nome;
      p.Tp = pessoa.tipo;
      p.Telefone = pessoa.telefone;
      p.Celular = pessoa.celular;
      p.Email = pessoa.email;
      p.Ativo = pessoa.ativo;
      p.Origem = pessoa.origem;
      pessoa.cadastro = data.converter(p.Cadastro);

      return p;
    };

    return Pessoa;

  }]);
