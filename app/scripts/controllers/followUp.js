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
    'ProviderStatusAtendimento',
    'StatusHistoricoAtendimento',
    function ($rootScope, $scope, Atendimento, Usuario, providerAtendimento, modalAtendimento, providerStatus, StatusHistoricoAtendimento) {

      var self = this;

      $scope.$on('$viewContentLoaded', function () {
        getStatusAtendimento();
        getAtendimentos();

        // modalAtendimento.show();
        // jQuery('#modalFiltros').modal('show');
      });

      self.pagination = {
        current: 1,
        max: 15,
        total: 0
      };

      function getAtendimentos() {
        self.atendimentos = [ ];
        $rootScope.loading.load();
        providerAtendimento.obterTodos(true, true, true, true).then(function(success) {
          angular.forEach(success.data, function(item, index) {
            self.atendimentos.push(new Atendimento(Atendimento.converterEmEntrada(item)))
          });
          console.log(self.atendimentos);
          $rootScope.loading.unload();
        }, function(error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getStatusAtendimento() {
        self.statusArray = [];
        $rootScope.loading.load();
        providerStatus.obterTodos().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.statusArray.push(new StatusHistoricoAtendimento(StatusHistoricoAtendimento.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

  }]);
