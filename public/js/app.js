(function () {

  var app = angular.module('examen', [
    'ngRoute',
    'examen.controllers',
    'examen.filters',
    'examen.services'
  ]);

  app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/examen.html',
        controller: 'ExamenController'
      })
      .otherwise({
        redirectTo: '/'
      });

  }]);

})();
