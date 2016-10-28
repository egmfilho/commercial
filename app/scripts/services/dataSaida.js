/**
 * Created by egmfilho on 16/08/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('DataSaida', ['$filter', function($filter) {

    return {
      converter: function(data) {
        if (!angular.isDate(data)) {
          return null;
        }

        return $filter('date')(new Date(data), 'yyyy-MM-dd HH:mm:ss');
      }

    };

  }]);
