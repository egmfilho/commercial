/**
 * Created by egmfilho on 05/07/16.
 */

'use strict';

angular.module('commercialApp')
  .constant('LOGIN_STATUS', {
    sucesso: 200,
    usuario_nao_encontrado: 404,
    senha_incorreta: 0
  })
  .constant('URLS', {
    root: 'http://enterprise/commercial/public/',
    login: 'http://enterprise/commercial/public/login.php'
  });
