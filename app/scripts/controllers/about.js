'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the yoApp
 */
angular.module('commercialApp')
  .controller('AboutCtrl', ['$cookies', function ($cookies) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    this.teste = function(msg) {
      console.log(msg);
    };

    this.click = function(obj) {
      console.log(obj);
    };

  }]);
