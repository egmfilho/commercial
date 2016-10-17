/**
 * Created by egmfilho on 13/10/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('TipoFollowUp', [function () {

    function TipoFollowUp(tipo) {
      this.id = tipo ? tipo.id : '';
      this.codigo = tipo ? tipo.codigo : '';
      this.nome = tipo ? tipo.nome : '';
      this.dataCadastro = tipo ? tipo.dataCadastro : new Date();
      this.dataUpdate = tipo ? tipo.dataUpdate : new Date();
    }

    return TipoFollowUp;

  }]);
