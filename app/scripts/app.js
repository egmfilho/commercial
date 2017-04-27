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
    'egmfilho.inputFilters',
    'ui.bootstrap',
    'ui.mask',
    'ds.clock',
    'ui.select',
    'colorpicker.module'
  ])
  .config(['$httpProvider', '$locationProvider', function ($httpProvider, $locationProvider) {
    $httpProvider.interceptors.push('SessionInjector');
    //$httpProvider.defaults.withCredentials = true;
    $locationProvider.hashPrefix('');
  }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        modulo: 'home',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      //.when('/signup', {
      //  templateUrl: 'views/signup.html'
      //})
      .when('/login', {
        modulo: 'login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/logout', {
        modulo: 'logout',
        template: '<h3>Logging out...</h3>',
        controller: 'LogoutCtrl'
      })
      .when('/clientes', {
        modulo: 'client',
        templateUrl: 'views/clientes.html',
        controller: 'ClientesCtrl',
        controllerAs: 'clientes'
      })
      .when('/buscar-orcamento', {
        module: 'order',
        templateUrl: 'views/buscarPedido.html',
        controller: 'BuscarPedidoCtrl',
        controllerAs: 'busca'
      })
      .when('/orcamento/:action', {
        modulo: 'order',
        templateUrl: 'views/orcamento.html',
        controller: 'OrcamentoCtrl',
        controllerAs: 'orcamento'
      })
      .when('/orcamento/impressao/:code', {
        templateUrl: 'partials/impressaoOrcamento.html',
        controller: 'ImpressaoCtrl',
        controllerAs: 'orcamento'
      })
      .when('/follow-up', {
        modulo: 'follow_up',
        templateUrl: 'views/follow_up.html',
        controller: 'FollowUpCtrl',
        controllerAs: 'followUp'
      })
      .when('/follow-up/orcamentos', {
        modulo: 'follow_up',
        templateUrl: 'views/followUpEmLote.html',
        controller: 'FollowUpEmLoteCtrl',
        controllerAs: 'emLote'
      })
      .when('/atendimento/:action', {
        modulo: 'follow_up',
        templateUrl: 'views/atendimento.html',
        controller: 'AtendimentoCtrl',
        controllerAs: 'atendimento'
      })
      .when('/configuracoes', {
        modulo: 'config',
        templateUrl: 'views/configuracoes.html',
        controller: 'ConfiguracoesCtrl',
        controllerAs: 'configuracoes'
      })
      // .when('/about', {
      //   templateUrl: 'views/about.html',
      //   controller: 'AboutCtrl',
      //   controllerAs: 'about'
      // })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(['$rootScope', 'ArrayPrototype', function ($rootScope, ArrayPrototype) {
    $rootScope.hoje = new Date();

    ArrayPrototype.contains();

    // para ser usado no ng-repeat
    $rootScope.getNumber = function (num) {
      return new Array(num);
    };

    $rootScope.versao = '1.2.4';

    $rootScope.loading = {
      count: 0,
      isLoading: function() { return this.count > 0 },
      load: function() { this.count++ },
      unload: function() { this.count--; this.count < 0 ? this.count = 0 : null; }
    };

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
        if (next && next.templateUrl) {
          if (next.templateUrl !== 'views/login.html' && next.templateUrl.indexOf('impressaoOrcamento.html') < 0) {
            $location.path('/login');
          }
          return;
        }
      }

      // Bloqueia acessos pelas permissoes
      if ($cookies.get('currentUser')) {
        var user = JSON.parse(window.atob($cookies.get('currentUser')));
        if (next.modulo && user.perfil.permissoes.hasOwnProperty(next.modulo)) {
          if (!user.perfil.permissoes[next.modulo].permissoes['access'].valor) {
            $rootScope.alerta.show('Acesso não autorizado!', 'alert-danger');
            $location.path('/home');
          }
        }
      }

    });

  }]);
