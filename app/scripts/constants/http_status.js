/**
 * Created by egmfilho on 11/07/16.
 */
'use strict';

angular.module('commercialApp.constants')
  .constant('HTTP_STATUS', {
    ok: 200,
    criado: 201,
    aceito: 202,
    requisicao_invalida: 400,
    nao_autorizado: 401,
    pagamento_necessario: 402,
    proibido: 403,
    nao_encontrado: 404,
    tempo_de_requisicao_esgotado: 408,
    falha_na_expectativa: 417,
    senha_incorreta: 0
  });
