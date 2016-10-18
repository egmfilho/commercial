/**
 * Created by egmfilho on 18/10/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('AtendimentoCtrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    'ProviderAtendimento',
    'Atendimento',
    function($rootScope, $scope, $routeParams, providerAtendimento, Atendimento) {

      var self = this;

      $scope.dt = new Date();

      self.options = {
        // customClass: getDayClass,
        minDate: new Date(),
        showWeeks: false
      };

      self.usuarios = [
        {
          usuario: 'zé gotinha'
        },
        {
          usuario: 'lucilei'
        },
        {
          usuario: 'zina'
        },
        {
          usuario: 'bacuri'
        },
        {
          usuario: 'biricutico'
        },
        {
          usuario: 'gasparzinho'
        },
        {
          usuario: 'zidane'
        },
        {
          usuario: 'sassá'
        },
        {
          usuario: 'all day'
        }
      ];

      if ($routeParams.codigo) {
        $rootScope.isLoading = true;
        providerAtendimento.obterPorCodigo($routeParams.codigo, true, true, true, true).then(function(success) {
          self.atendimento = new Atendimento(Atendimento.converterEmEntrada(success.data));
          console.log(self.atendimento);
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      } else {
        console.log('novo atendimento');
        self.atendimento = new Atendimento();
      }

    }]);
