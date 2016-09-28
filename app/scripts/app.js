'use strict';

angular.module('commercialApp.constants', []);
angular.module('commercialApp.filters', []);
angular.module('commercialApp.services', []);
angular.module('commercialApp.directives', []);
angular.module('commercialApp.controllers', []);
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
    'egmfilho.keys',
    'ui.bootstrap',
    'ui.mask'
  ])
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('SessionInjector');
    //$httpProvider.defaults.withCredentials = true;
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
      .when('/logout', {
        template: '<h3>Logging out...</h3>',
        controller: 'LogoutCtrl'
      })
      .when('/clientes', {
        templateUrl: 'views/clientes.html',
        controller: 'ClientesCtrl',
        controllerAs: 'clientes'
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
  .run(['$rootScope', 'ArrayPrototype', function ($rootScope, ArrayPrototype) {
    ArrayPrototype.contains();

    // para ser usado no ng-repeat
    $rootScope.getNumber = function (num) {
      return new Array(num);
    };

    $rootScope.versao = '0.7.4';

    $rootScope.isLoading = false;

    $rootScope.alerta = {
      mensagem: '',
      classe: 'alert-warning',
      elem: jQuery('.alerta'),
      hide: null,
      show: function (mensagem, classe) {
        if (mensagem) this.mensagem = mensagem;
        this.classe = classe || 'alert-warning';

        if (this.hide) {
          clearTimeout(this.hide);
          this.hide = null;
        }

        var self = this;
        this.elem.css('opacity', '0');
        this.elem.css('display', 'inline');
        this.elem.fadeTo('slow', 1, function () {
          self.hide = setTimeout(function () {
            self.elem.fadeTo('slow', 0, function () {
              self.elem.css('display', 'none');
            });
          }, 3000);
        });
      }
    };
  }])
  .run(['$rootScope', '$location', '$cookies', '$uibModalStack', function ($rootScope, $location, $cookies, $uibModalStack) {

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      $uibModalStack.dismissAll();
      $rootScope.currentPath = $location.path();

      // Bloqueia acesso de usuarios nao logados
      if (!$cookies.get('COMMERCIAL') || !$cookies.get('currentUser') || $cookies.get('COMMERCIAL') != JSON.parse(window.atob($cookies.get('currentUser'))).sessao) {
        if (next.templateUrl !== 'views/login.html') {
          $location.path('/login');
        }
        return;
      }

      // Bloqueia acessos pelas permissoes
      var user = JSON.parse(window.atob($cookies.get('currentUser')));
      if (user.perfil.permissoes[next.controllerAs]) {
        if (!user.perfil.permissoes[next.controllerAs].acessar) {
          $rootScope.alerta.show('Acesso não autorizado!', 'alert-danger');
          $location.path('/home');
        }
      }
    });

  }]);
