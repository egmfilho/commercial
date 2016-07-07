'use strict';

/**
 * @ngdoc overview
 * @name yoApp
 * @description
 * # yoApp
 *
 * Main module of the application.
 */

angular
  .module('commercialApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controlelrAs: 'home'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/clientes', {
        templateUrl: 'views/cliente.html',
        controller: 'ClienteCtrl',
        controlelrAs: 'cliente'
      })
      .when('/orcamento', {
        templateUrl: 'views/orcamento.html',
        controller: 'OrcamentoCtrl',
        controlelrAs: 'orcamento'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if ($rootScope.globals == null || $rootScope.globals.currentUser == null) {
        if (next.templateUrl != 'views/login.html') {
          $location.path('/login');
        }
      }
    });
  }]);
