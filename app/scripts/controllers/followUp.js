/**
 * Created by egmfilho on 13/10/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('FollowUpCtrl', [
    '$rootScope',
    '$scope',
    'Atendimento',
    'Usuario',
    'ProviderAtendimento',
    'ModalAtendimento',
    function ($rootScope, $scope, Atendimento, Usuario, providerAtendimento, modalAtendimento) {

      var self = this;

      $scope.$on('$viewContentLoaded', function () {
        getAtendimentos();

        // modalAtendimento.show();
        // jQuery('#modalFiltros').modal('show');
      });

      function getAtendimentos() {
        self.atendimentos = [ ];
        $rootScope.isLoading = true;
        providerAtendimento.obterTodos(true, true, true, true).then(function(success) {
          angular.forEach(success.data, function(item, index) {
            self.atendimentos.push(new Atendimento(Atendimento.converterEmEntrada(item)))
          });
          console.log(self.atendimentos);
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

  }]);
