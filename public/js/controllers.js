(function (_) {

  angular.module('examen.controllers', [])
    .controller('ExamenController', ['$scope', '$routeParams', 'examenService', function ($scope, $routeParams, examenService) {

      $scope.filtro = {
        family: 1,
        metrica: 'total',
        year: '2021'
      }

      $scope.asientosMensuales = [
        {mes: 'Enero', mesnum:1, total:0},
        {mes: 'Febrero', mesnum:2, total:0},
        {mes: 'Marzo', mesnum:3, total:0},
        {mes: 'Abril', mesnum:4, total:0},
        {mes: 'Mayo', mesnum:5, total:0},
        {mes: 'Junio', mesnum:6, total:0},
        {mes: 'Julio', mesnum:7, total:0},
        {mes: 'Agosto', mesnum:8, total:0},
        {mes: 'Septiembre', mesnum:9, total:0},
        {mes: 'Octubre', mesnum:10, total:0},
        {mes: 'Noviembre', mesnum:11, total:0},
        {mes: 'Diciembre', mesnum:12, total:0}
      ]

      examenService.allList().then(function (data) {
        $scope.asientos = data;
        $scope.familias = filtrarCombo('family',data);
        $scope.metricas = [{value: "total", descripcion:"Total"}, {value: "promedio", descripcion:"Promedio"}, {value: "maximo", descripcion:"Máximo"}, {value: "minimo", descripcion:"Mínimo"}]
        $scope.years = filtrarCombo('date',data);

        $scope.Filtrar();

      });


      $scope.Filtrar = function () {
        asientos();
      };
      
      function asientos(){
        $scope.asientosMensuales = $scope.asientosMensuales.map(x => {
          switch ($scope.filtro.metrica) {
            case 'total':
              x.total = calculateTotal(x.mesnum);
              break;
            case 'promedio':
              x.total = calculateTotal(x.mesnum) / getDayMonth(x.mesnum, $scope.filtro.year);
              break;
            case 'minimo':
              let listMinimo = filtrarMN(x.mesnum) || [];
              x.total = listMinimo[0] ? listMinimo.sort((a,b) => (a.amount > b.amount) ? 1 : ((b.amount > a.amount) ? -1 : 0))[0]['amount'] : 0;
              break;
            case 'maximo':
              let listMaximo = filtrarMN(x.mesnum) || [];
              x.total = listMaximo[0] ? listMaximo.sort((a,b) => (b.amount > a.amount) ? 1 : ((a.amount > b.amount) ? -1 : 0))[0]['amount'] : 0;           
              break;
          
            default:
              x.total = calculateTotal(x.mesnum);
              break;
          }
          
          return x;
        });
      }
      
      function getDayMonth(month, year){
        let d = new Date(year, month, 0);
        let fecha = d.toJSON();
        fecha = fecha.split('-')[2];
        let day = fecha.split('T')[0]
        return Number(day)
      }


      function calculateTotal(mesnum){
        const filterAsientos = $scope.asientos.filter( x => {
          let año = new Date(x.date).getFullYear().toString();
          let mes = new Date(x.date).getMonth() + 1;
          return x.family == $scope.filtro.family && año == $scope.filtro.year && mes == mesnum
        });
        return filterAsientos.reduce( (a,b) => a + b.amount, 0);;
         
      }
      function filtrarMN(mesnum){
        return $scope.asientos.filter( x => {
          let año = new Date(x.date).getFullYear().toString();
          let mes = new Date(x.date).getMonth() + 1;
          return x.family == $scope.filtro.family && año == $scope.filtro.year && mes == mesnum
        });
      }

      function filtrarCombo(name, data){
        let arrayCombo = data.map( (x) => {
          let dato = x[name];
          if (name == 'date'){
            dato = new Date(x.date).getFullYear().toString();
          }          
          return{value: dato, descripcion:dato}
        });
        const val = [];
        const res = [];
        arrayCombo.forEach(x => {
          if(!val.includes(x.value)){
            val.push(x.value)
            res.push(x);
          }
        });
        return res;
      }

    }])


})(_);
