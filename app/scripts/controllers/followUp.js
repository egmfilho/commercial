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
    'ModalAtendimento',
    '$http',
    function ($rootScope, $scope, Atendimento, Usuario, modalAtendimento, $http) {

      var self = this;

      $scope.$on('$viewContentLoaded', function () {
        getAtendimentos();

        modalAtendimento.show();
      });

      function getAtendimentos() {
        self.atendimentos = [ ];
        $http.get('../../teste.json').then(function(success) {
          self.atendimentos.push(new Atendimento(Atendimento.converterEmEntrada(success.data)))
          console.log('TESTE', self.atendimentos);
        });
      }

  }]);
