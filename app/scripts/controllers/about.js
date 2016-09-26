'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the yoApp
 */
angular.module('commercialApp')
  .controller('AboutCtrl', ['$cookies', 'Usuario', function ($cookies, Usuario) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    this.teste = function(msg) {
      console.log(msg);
    };

    this.click = function(obj) {
      //console.log(obj);
      prototipo();
    };





    var json = {
      "user_id": "1004",
      "user_profile_id": "1002",
      "user_session_id": null,
      "user_active": "Y",
      "user_user": "balcao",
      "user_name": "Vendas",
      "user_mail": null,
      "user_login": "2016-09-22 21:14:13",
      "user_update": null,
      "user_date": "2016-09-22 15:20:16",
      "user_current_session_id": "ih4ud9kj532kuvjn6mqcni7c30",
      "user_session": {
        "user_session_value": "ih4ud9kj532kuvjn6mqcni7c30",
        "user_session_date": "2016-09-26 08:18:09"
      },
      "user_profile": {
        "user_profile_id": "1002",
        "user_profile_name": "Vendedor",
        "user_profile_update": null,
        "user_profile_date": "2016-09-22 15:21:12",
        "user_profile_access": {
          "order": {
            "access": {
              "value": "Y",
              "data_type": "bool"
            },
            "max_al_discount": {
              "value": "10",
              "data_type": "float"
            }
          },
          "report": {
            "access": {
              "value": "Y",
              "data_type": "bool"
            }
          },
          "follow_up": {
            "access": {
              "value": "Y",
              "data_type": "bool"
            },
            "add": {
              "value": "N",
              "data_type": "bool"
            },
            "edit": {
              "value": "N",
              "data_type": "bool"
            },
            "del": {
              "value": "N",
              "data_type": "bool"
            }
          },
          "product": {
            "access": {
              "value": "Y",
              "data_type": "bool"
            }
          },
          "client": {
            "access": {
              "value": "Y",
              "data_type": "bool"
            }
          },
          "config": {
            "access": {
              "value": "Y",
              "data_type": "bool"
            }
          }
        }
      }
    };

    function prototipo() {
      var response = JSON.parse(JSON.stringify(json));

      //Usuario.converterEmEntrada(response);
      console.log(new Usuario(Usuario.converterEmEntrada(response)));

    }


  }]);
