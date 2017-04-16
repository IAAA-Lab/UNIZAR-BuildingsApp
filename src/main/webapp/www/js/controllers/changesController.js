/**************************************************************************
 * ChangesCtrl: Controlador encargado del listado de cambios de un usuario
 ***********************************************************************/

UZCampusWebMapApp.controller('ChangesCtrl', function($scope, $rootScope, $timeout,
    $ionicLoading, $ionicPopup, $cordovaCamera, $state, $window, infoService,
    photosService,translationService, loginService, notificationService,
    APP_CONSTANTS){
  $scope.data = [];
  $scope.cambios = {
    'Pendiente': [],
    'Aprobado': [],
    'Rechazado': [],
    'Pendiente del usuario': []
  };
  $scope.statusShown = null;

  // Define los colores a utilizar para cada estado
  $scope.listaAlpha = 0.6;
  $scope.cambioAlpha = 0.4;
  $scope.status = [
    {
      'label': 'Pendiente',
      'value': 'Esperando una respuesta',
      'color': {'r': 255, 'g': 201, 'b': 0} // amarillo
    },
    {
      'label': 'Aprobado',
      'value': 'Aprobados',
      'color': {'r': 51, 'g': 205, 'b': 95} // verde
    },
    {
      'label': 'Rechazado',
      'value': 'Rechazados',
      'color': {'r': 239, 'g': 71, 'b': 58} // rojo
    },
    {
      'label': 'Pendiente del usuario',
      'value': 'Pendientes de revisión',
      'color': {'r': 17 , 'g': 193, 'b': 243}, // azul
    }
  ];

  notificationService.getMisCambios()
    .then(function(data) {

      // Fills the data structure with notifications info
      angular.forEach(data, function(value, key){

        // If a day or month are lower than 10, then it adds a '0'
        // first so it looks better
        var day = value.fecha.date.day < 10 ?
                      '0' + value.fecha.date.day :
                      value.fecha.date.day;
        var month = value.fecha.date.month <10 ?
                      '0' + value.fecha.date.month :
                      value.fecha.date.month;
        var fecha = day + '-' + month + '-' + value.fecha.date.year;
        var cambio = {
          'id': value.id_notificacion,
          'espacio': value.espacio,
          'fecha': fecha,
          'descripcion': value.descripcion,
          'estado': value.estado,
          'foto': value.foto,
          'comentario_admin': value.comentario_admin
        };
        $scope.cambios[cambio.estado].push(cambio);
      });
  });

  $scope.getStatusRGBA = function(index){
    return 'rgba(' + $scope.status[index].color.r + ',' +
                     $scope.status[index].color.g + ',' +
                     $scope.status[index].color.b + ',' +
                     $scope.listaAlpha +
                ')';
  };

  $scope.getCambioRGBA = function(index, cambio){
    angular.forEach($scope.status, function(value,key) {
      if (cambio.estado == value.label) index = key;
    });

    return 'rgba(' + $scope.status[index].color.r + ',' +
                     $scope.status[index].color.g + ',' +
                     $scope.status[index].color.b + ',' +
                     $scope.cambioAlpha +
                ')';
  };

  $scope.getCambiosEstado = function(status){
    return $scope.cambios[status.label];
  };

  $scope.toggleStatusShown = function(status){
    if ($scope.isStatusShown(status)) {
      $scope.statusShown = null;
    }
    else {
      $scope.statusShown = status;
    }
  };

  $scope.isStatusShown = function(status){
    return $scope.statusShown == status;
  };

  $scope.isStatusEmpty = function(status){
    return $scope.cambios[status.label].length === 0;
  };

  // Redirect methods
  $scope.showDetails = function(cambio) {
    window.location = "#/app/changeDetails/" + cambio.id;
  };

  $scope.showResponse = function(cambio) {
    window.location = "#/app/changeResponse/" + cambio.id;
  };

});
