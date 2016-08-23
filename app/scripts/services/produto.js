/**
 * Created by egmfilho on 16/08/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('Produto', [function() {

    function Produto(produto) {
      this.id = produto ? produto.id : '';
      this.codigo = produto ? produto.codigo : '';
      this.nome = produto ? produto.nome : '';
      this.marca = produto ? produto.marca : '';
      this.referencia = produto ? produto.referencia : '';
      this.codBarras = produto ? produto.codBarras : '';
      this.qtdEstoque = produto ? produto.qtdEstoque : '';
      this.preco = produto ? produto.preco : '';
      this.unidade = produto ? produto.unidade : '';
      this.ativo = produto ? produto.ativo : '';
    }

    Produto.converterEmEntrada = function(p) {
      var produto = { };

      produto.id = p.IdProduto;
      produto.codigo = p.CdProduto;
      produto.nome = p.NmProduto;
      produto.marca = p.NmMarca;
      produto.referencia = p.Ref;
      produto.codBarras = p.EAN;
      produto.qtdEstoque = p.QtEstoque;
      produto.preco = p.VlPreco;
      produto.unidade = p.Unidade;
      produto.ativo = p.Ativo;
      produto.dataPreco = p.DataPreco;

      return produto;
    };

    Produto.converterEmSaida = function(produto) {
      var p = { };

      p.IdProduto = produto.id;
      p.CdProduto = produto.codigo;
      p.NmProduto = produto.nome;
      p.NmMarca = produto.marca;
      p.Ref = produto.referencia;
      p.EAN = produto.codBarras;
      p.QtEstoque = produto.qtdEstoque;
      p.VlPreco = produto.preco;
      p.Unidade = produto.unidade;
      p.Ativo = produto.ativo;
      p.DtPreco = new Date(produto.dataPreco);

      return p;
    };

    return Produto;

  }]);
