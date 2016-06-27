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
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controlelrAs: 'home'
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
  });
