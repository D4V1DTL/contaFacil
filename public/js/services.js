(function () {

  angular.module('examen.services', [])

    .factory('examenService', ['$http', '$q', '$filter', '$window', function ($http, $q, $filter, $window) {
      var normalize = $filter('normalize');
      var localStorage = $window.localStorage;

      function allList() {
        var deferred = $q.defer();

        $http.get('/contaFacil.json')
          .success(function (data) {
            deferred.resolve(data);
          });

        return deferred.promise;
      }

      return {
        allList: allList
      };

    }]);

})();
