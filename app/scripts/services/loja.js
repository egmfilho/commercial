/**
 * Created by egmfilho on 24/11/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('Loja', Loja);

Loja.$inject = [ 'Endereco' ];

function Loja(Endereco) {

  function Loja(loja) {
    this.id = loja ? loja.id : '';
    this.codigo = loja ? loja.codigo : '';
    this.cnpj = loja ? loja.cnpj : '';
    this.nome = loja ? loja.nome : '';
    this.telefone = loja ? loja.telefone : '';
    this.endereco = loja ? loja.endereco : new Endereco();
    this.complemento = loja ? loja.complemento : '';
  }

  Loja.converterEmEntrada = function(shop) {
    var loja = { };

    loja.id = shop.shop_id;
    loja.codigo = shop.shop_code;
    loja.cnpj = shop.shop_cnpj;
    loja.nome = shop.shop_name;
    loja.telefone = shop.shop_phone;
    loja.complemento = shop.shop_complement;

    if (shop.shop_cep) {
      loja.endereco = new Endereco(Endereco.converterEmEntrada(shop.shop_cep));
    } else {
      loja.endereco = new Endereco();
    }

    return loja;
  };

  Loja.converterEmSaida = function(loja) {
    var shop = { };

    shop.shop_id = loja.id;
    shop.shop_code = loja.codigo;
    shop.shop_cnpj = loja.cnpj;
    shop.shop_name = loja.nome;
    shop.shop_phone = loja.telefone;
    shop.shop_cep = Endereco.converterEmSaida(loja.endereco);
    shop.shop_complement = loja.complemento;

    return shop;
  };

  return Loja;

}
