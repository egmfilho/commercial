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

    $rootScope.alerta = {
      mensagem: '',
      classe: 'alert-warning',
      elem: jQuery('.alerta'),
      hide: null,
      show: function(mensagem, classe) {
        if (mensagem) this.mensagem = mensagem;
        if (classe) this.classe = classe;

        if(this.hide) {
          clearTimeout(this.hide);
          this.hide = null;
        }

        var self = this;
        this.elem.css('opacity', '0');
        this.elem.css('display', 'inline');
        this.elem.fadeTo('slow', 1, function() {
          self.hide = setTimeout(function() {
            self.elem.fadeTo('slow', 0, function() { self.elem.css('display', 'none'); });
          }, 3000);
        });
      }
    };


    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      $rootScope.currentPath = $location.path();

      //if ($rootScope.globals === null || $rootScope.globals.currentUser === null) {
      //  if (next.templateUrl !== 'views/login.html') {
          //$location.path('/login');
        //}
      //}
    });

  }]);
