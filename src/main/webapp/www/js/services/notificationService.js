UZCampusWebMapApp.service('notificationService', function(
    $http, $q, $ionicLoading, $cordovaCamera, APP_CONSTANTS){

  this.createNotification = function(data) {
    var deferred = $q.defer();

    console.log("creando notificacion");

    // Elige el tipo de notificacion a enviar
    var tipoNotificacion = "";
    if (data.type == 1) tipoNotificacion = "cambio";
    else if (data.type == 2) tipoNotificacion = "incidencia";

    // Construye la notifiacion a enviar
    var notificacion = {
      "id_espacio": data.roomId,
      "descripcion": data.comments,
      "estado": "Pendiente",
      "email_usuario": data.email || undefined
    };

    $http({
      method: 'POST',
      url: APP_CONSTANTS.URI_API + 'notificacion/' + tipoNotificacion,
      data: notificacion
    }).success(function(res) {
        deferred.resolve(res);
    }).
    error(function(err) {
        console.log("Error while obtaining user info");
        deferred.reject(err);
    });
    return deferred.promise;
  };

  this.getMisCambios = function() {
    var deferred = $q.defer();
    console.log("obteniendo mis cambios");

    $http({
      method: 'GET',
      url: APP_CONSTANTS.URI_API + 'notificacion/cambio/user'
    }).success(function(res) {
        deferred.resolve(res);
    }).
    error(function(err) {
        console.log("Error while obtaining user changes");
        deferred.reject(err);
    });
    return deferred.promise;
  };

  // // Open camera or gallery to select a photo
  // this.selectPicture = function() {
  //     var mode = 'PHOTOLIBRARY';
  //
  //     var destinationType = (mode == 'CAMERA') ? Camera.DestinationType.FILE_URL : Camera.DestinationType.FILE_URL;
  //     var sourceType = (mode == 'CAMERA') ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY;
  //     var options = {
  //         quality: 20,
  //         saveToPhotoAlbum: true,
  //         allowEdit: false,
  //         encondingType: Camera.EncodingType.JPEG,
  //         destinationType: destinationType,
  //         sourceType: sourceType
  //     };
  //
  //     $cordovaCamera.getPicture(options).then(
  //         function(imageData) {
  //             console.log('Image', imageData);
  //             $scope.picURL = imageData;
  //             $scope.ftLoad = true;
  //             $scope.uploadPicture();
  //         },
  //         function(err){
  //             console.log('Error selecting picture', err);
  //             if (err != 'Camera cancelled') {
  //                 $ionicLoading.show({template: $scope.i18n.loading_mask.error_load_image, duration:1500});
  //             }
  //     });
  // };
  //
  // // Upload notification photo content to server
  // this.uploadPicture = function(id_notificacion) {
  //     $ionicLoading.show({template: $scope.i18n.loading_mask.sending_image});
  //     var fileURL = $scope.picURL;
  //     var options = new FileUploadOptions();
  //     options.fileKey = 'file';
  //     options.fileName = [localStorage.room, new Date().getTime()].join('_') + '.jpg';
  //     options.mimeType = 'image/jpeg';
  //     options.httpMethod = 'POST';
  //     options.chunkedMode = true;
  //
  //     var serverURL = APP_CONSTANTS.URI_API + 'notificacion/photo';
  //
  //     var params = {};
  //     params.name = options.fileName;
  //     // params.id_notificacion = id_notificacion
  //
  //     options.params = params;
  //
  //     var ft = new FileTransfer();
  //     ft.upload(fileURL, serverURL,
  //       function(){
  //           console.log("Success uploading photo to server", arguments);
  //           popup.close();
  //           $ionicLoading.hide();
  //           var alertPopup = $ionicPopup.alert({
  //               title: $scope.i18n.photos.modals.success_upload.title,
  //               template: '<p>'+$scope.i18n.photos.modals.success_upload.text+'</p>'
  //           });
  //           alertPopup.then(function(res){
  //               if ($('.popup-container').length > 0) {
  //                   $('.popup-container').remove();
  //               }
  //           });
  //       },
  //       function(){
  //           console.log("Error uploading photo to server", arguments);
  //           $ionicLoading.hide();
  //           $ionicLoading.show({template: $scope.i18n.loading_mask.error_send_image, duration:1500});
  //       }, options, true);
  //   };
});
