'use strict';

angular.module('commercialApp.constants', [ ]);
angular.module('commercialApp.filters', [ ]);
angular.module('commercialApp.services', [ ]);
angular.module('commercialApp.directives', [ ]);
angular.module('commercialApp.controllers', [ ]);
angular
  .module('commercialApp', [
    'commercialApp.constants',
    'commercialApp.filters',
    'commercialApp.services',
    'commercialApp.directives',
    'commercialApp.controllers',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ui.mask'
  ])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('SessionInjector');
  }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/clientes', {
        templateUrl: 'views/cliente.html',
        controller: 'ClienteCtrl',
        controllerAs: 'cliente'
      })
      .when('/orcamento', {
        templateUrl: 'views/orcamento.html',
        controller: 'OrcamentoCtrl',
        controllerAs: 'orcamento'
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

    $rootScope.isLoading = false;

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      $rootScope.currentPath = $location.path();

      //if ($rootScope.globals === null || $rootScope.globals.currentUser === null) {
      //  if (next.templateUrl !== 'views/login.html') {
          //$location.path('/login');
        //}
      //}
    });

  }]);
