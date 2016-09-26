/**
 * Created by egmfilho on 26/09/16.
 */

'use strict';

angular.module('commercialApp.constants')
  .constant('PERMISSOES', {
    modulo: {
      orcamento: 'order',
      relatorios: 'report',
      followUp: 'follow_up',
      produtos: 'product',
      clientes: 'client',
      configuracoes: 'config'
    },
    permissao: {
      acessar: 'access',
      maxDescontoPercent: 'max_al_discount',
      adicionar: 'add',
      editar: 'edit',
      remover: 'del'
    }
  });
