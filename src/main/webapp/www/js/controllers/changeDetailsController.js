/**************************************************************************
 * ChangeDetailsCtrl: Controlador encargado del mostrar los detalles del
 * cambio seleccionado por el usuario
 ***********************************************************************/

UZCampusWebMapApp.controller('ChangeDetailsCtrl', function($scope, $rootScope, $timeout,
    $ionicLoading, $ionicPopup, $cordovaCamera, $state, $window, $stateParams,
    $http, infoService, photosService,translationService, loginService,
    notificationService, APP_CONSTANTS){

  $scope.updated = true;

  $scope.isCambioUpToDate = function() {
    console.log("isCambioUpToDate(): " + $scope.updated);
    return $scope.updated;
  };

  $scope.setCambioUpToDate = function(state) {
    $scope.updated = state;
    console.log("setCambioUpToDate(): " + $scope.updated);
  };

  //Calculates image dimensions based on device dimensions
  $scope.calculateDimensions = function() {
      return {
          "width": $window.innerWidth,
          "height": $window.innerHeight-150
      };
  };

  $scope.resizeImage = function(width, height) {
      var maxWidth = $scope.dimensions.width,
          maxHeight = $scope.dimensions.height,
          ratio = Math.min(maxWidth / width, maxHeight / height);

          console.log("Window dimensions: width: " + maxWidth + ". height: " + maxHeight);
          console.log(width + "-" + height + "-" + ratio);

      return {
          width: width*ratio,
          height: height*ratio
      };
  };

  $scope.cambio = {};

  $scope.dimensions = $scope.calculateDimensions();
  $scope.imageWidth = 0;
  $scope.imageHeight = 0;

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

  //This code will be executed every time the controller view is loaded
  $scope.$on('$ionicView.beforeEnter', function(){

    notificationService.getMisCambios()
      .then(function(data) {

        // Fills the data structure with notifications info
        angular.forEach(data, function(value, key){
          if (value.id_notificacion == $stateParams.cambio) {

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
              'tipo': value.tipo_notificacion,
              'espacio': value.espacio,
              'fecha': fecha,
              'descripcion': value.descripcion,
              'estado': value.estado,
              'foto': value.foto,
              'comentario_admin': value.comentario_admin
            };
            $scope.cambio = cambio;
          }
        });

        // Carga la imagen del cambio seleccionado
        notificationService.getCambioImage($scope.cambio)
          .then(function(data) {

            var tempImage = new Image();
            tempImage.src = 'data:image/jpg;base64,' + data;
            tempImage.onload = function() {
                var resizedImage = $scope.resizeImage(tempImage.width, tempImage.height);
                imageWidthHeight = 'width="' + resizedImage.width + '" height="' + resizedImage.height + '"';
                $("#imageDiv").html('<img src="' + tempImage.src + '"'+imageWidthHeight+'></img>');
                $scope.imageData = tempImage;
            };
        });

      }
    );
  });

  $scope.getCambioRGBA = function(){
    var index = 0;
    angular.forEach($scope.status, function(value,key) {
      if ($scope.cambio.estado == value.label) index = key;
    });

    return 'rgba(' + $scope.status[index].color.r + ',' +
                     $scope.status[index].color.g + ',' +
                     $scope.status[index].color.b + ',' +
                     $scope.cambioAlpha +
                ')';
  };

  $scope.showListaCambios = function(){
    window.location = '#/app/changes';
  };

  // Actualiza el cambio modificado
  $scope.updateCambio = function(){

    // Si se ha incluido una nueva imagen se sube al servidor

    // console.log("y aqui que hay: " + $scope.cambio.imageInput);
    //
    // if($scope.cambio.imageInput !== undefined) {
      $scope.uploadPictureFromInput($scope.cambio.id);
    // }
    $scope.setCambioUpToDate(true);

    // Actualiza la información del cambio
    notificationService.updateNotification($scope.cambio)
      .then(function() {

        console.log("Cambio actualizado con exito");
      });
  };

  // Upload picture to server
  $scope.uploadPictureFromInput = function(id_notificacion) {
      $ionicLoading.show({template: $scope.i18n.loading_mask.sending_image});
      var file = $('input[name=photo]')[0].files[0];

      if (typeof(file) == 'undefined') {
          $ionicLoading.show({ template: $scope.i18n.loading_mask.error_select_image, duration: 1500});
      }
      else if (file.type.indexOf("image") == -1) {
          $ionicLoading.show({ template: $scope.i18n.loading_mask.error_invalid_image, duration: 1500});
      }
      else if (file.size > 1048576) {
          //TODO: [DGP] Delete condition when bug fixed on server side
          $ionicLoading.show({ template: $scope.i18n.loading_mask.error_image_size, duration: 1500});
      }
      else {
          var formData = new FormData();
          formData.append('name', [localStorage.room, new Date().getTime()].join('_') + '.jpg');
          formData.append('file', file);
          formData.append('id_notificacion', id_notificacion);

          $http({
              url :  APP_CONSTANTS.URI_API + 'notificacion/photo',
              method: "POST",
              data : formData,
              headers: {
                'Content-Type': undefined,
              },
              cache: false,
              processData: false,
              success: function(data, textStatus, jqXHR)
              {
                  console.log("Success uploading photo to server", arguments);
                  popup.close();
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                      title: $scope.i18n.photos.modals.success_upload.title,
                      template: '<p>'+$scope.i18n.photos.modals.success_upload.text+'</p>'
                  });
                  alertPopup.then(function(res){
                      if ($('.popup-container').length > 0) {
                          $('.popup-container').remove();
                      }
                  });
              },
              error: function (jqXHR, textStatus, errorThrown)
              {
                  console.log("Error uploading photo to server", arguments);
                  $ionicLoading.hide();
                  $ionicLoading.show({template: $scope.i18n.loading_mask.error_send_image, duration:1500});
              }
          })
          .then(function() {
            console.log("Success uploading photo to server", arguments);
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: $scope.i18n.cambios.success_upload.title,
                template: '<p>'+$scope.i18n.cambios.success_upload.text+'</p>'
            });
            alertPopup.then(function(res){
                if ($('.popup-container').length > 0) {
                    $('.popup-container').remove();
                }
            });
          });
      }
  };

  $scope.setPreview = function(imagePreview) {
    var tempImage = new Image();
    tempImage.src = imagePreview;
    tempImage.onload = function() {
      var resizedImage = $scope.resizeImage(tempImage.width, tempImage.height);
      imageWidthHeight = 'width="' + resizedImage.width + '" height="' + resizedImage.height + '"';
      $("#imagePreview").html('<img src="' + tempImage.src + '"'+imageWidthHeight+'></img>');
      $scope.imagePreview = tempImage;
      $scope.setCambioUpToDate(false);
    };
  };

});
