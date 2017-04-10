/**************************************************************************
 * LoginCtrl: Controlador encargado del inicio de sesión de un usuario
 ***********************************************************************/

UZCampusWebMapApp.controller('ChangesCtrl', function($scope, $rootScope, $timeout,
    $ionicLoading, $ionicPopup, $cordovaCamera, $state, infoService, photosService,
    translationService, loginService, notificationService, APP_CONSTANTS){
  $scope.data = [];

  notificationService.getMisCambios()
    .then(function(data) {
      $scope.cambios = data;

      // Fills the data structure with notifications info
      angular.forEach($scope.cambios, function(value, key){
        
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
          'espacio': value.id_espacio,
          'fecha': fecha,
          'descripcion': value.descripcion,
          'validado': value.validado,
          'foto': value.foto
        };
        $scope.data.push(cambio);
      });
  });

  $scope.getStatus = function(cambio){
    var status = '';
    if (cambio.validado == 1) status = 'card-yellow';                 // Pendiente
    else if (cambio.validado == 2) status = 'card-green';               // Aprobado
    else if (cambio.validado == 3) status = 'card-red';              // Rechazado
    else if (cambio.validado == 4) status = 'card-orange';  // Pendiente del usuario
    console.log("Estado: " + status);
    return status;
  };

  $scope.isUserPending = function(cambio){
    return cambio.validado == 4;
  };
});
