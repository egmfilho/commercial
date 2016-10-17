/**
 * Created by egmfilho on 13/10/16.
 */

// NAO USADO MAIS

angular.module('commercialApp.services')
  .factory('CRFollowUp', [function () {

    function CRFollowUp(tipo) {
      this.id = tipo ? tipo.id : '';
      this.codigo = tipo ? tipo.codigo : '';
      this.nome = tipo ? tipo.nome : '';
      this.dataCadastro = tipo ? tipo.dataCadastro : new Date();
      this.dataUpdate = tipo ? tipo.dataUpdate : new Date();
    }

    return CRFollowUp;

  }]);
