/**************************************************************************
 * ChangesCtrl: Controlador encargado del listado de cambios de un usuario
 ***********************************************************************/

UZCampusWebMapApp.controller('ChangesCtrl', function($scope, $rootScope, $timeout,
    $ionicLoading, $ionicPopup, $cordovaCamera, $state, $window, $ionicScrollDelegate,
    $http, $q, $ionicSideMenuDelegate, infoService, photosService,translationService,
    loginService, notificationService, changeInfoService, APP_CONSTANTS){

  console.log("Changes controller");
  $ionicSideMenuDelegate.canDragContent(true);
  $scope.mostrado = false;
  $scope.popupActive = false;

  //Calculates image dimensions based on device dimensions
  $scope.calculateDimensions = function() {
      return {
          "width": $window.innerWidth,
          "height": $window.innerHeight/2
      };
  };

  $scope.resizeImage = function(width, height) {
      var maxWidth = $scope.dimensions.width,
          maxHeight = $scope.dimensions.height,
          ratio = Math.min(maxWidth / width, maxHeight / height);

          // console.log("Window dimensions: width: " + maxWidth + ". height: " + maxHeight);
          // console.log(width + "-" + height + "-" + ratio);

      return {
          width: width*ratio,
          height: height*ratio
      };
  };

  $scope.initChanges = function () {
    $scope.cargar = true;
    // console.log("init");
    $scope.dimensions = $scope.calculateDimensions();
    $scope.data = [];
    $scope.estados = ['Pendiente del usuario', 'Pendiente', 'Aprobado', 'Rechazado'];
    $scope.cambios = {
      'Pendiente del usuario': [],
      'Pendiente': [],
      'Aprobado': [],
      'Rechazado': []
    };

    $scope.originalCambios = {
      'Pendiente del usuario': [],
      'Pendiente': [],
      'Aprobado': [],
      'Rechazado': []
    };

    // Obtiene el estado de los cambios actuales del servicio compartido
    $scope.statusShown = changeInfoService.getEstado();
    $scope.seeDetails = -1;
    $scope.currentChange = -1;
    $scope.cambiosCargados = false;
    $scope.difNumCambiosNuevos = undefined;

    // Define los colores a utilizar para cada estado
    $scope.listaAlpha = 0.6;
    $scope.cambioAlpha = 0.4;
    $scope.status = [
      {
        'label': 'Pendiente del usuario',
        'value': 'Pendientes de revisión',
        'color': {'r': 17 , 'g': 193, 'b': 243}, // azul
      },
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
      }
    ];

    // Returns the promise when all changes are retrieved
    return notificationService.getMisCambios()
      .then(function(data) {
        var promises = [];

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

          // Last update date and time
          var lastDay = value.fechaUltimaModificacion.date.day < 10 ?
                        '0' + value.fechaUltimaModificacion.date.day :
                        value.fechaUltimaModificacion.date.day;
          var lastMonth = value.fechaUltimaModificacion.date.month < 10 ?
                        '0' + value.fechaUltimaModificacion.date.month :
                        value.fechaUltimaModificacion.date.month;
          var lastHour = value.fechaUltimaModificacion.time.hour < 10 ?
                        '0' + value.fechaUltimaModificacion.time.hour :
                        value.fechaUltimaModificacion.time.hour;
          var lastMin = value.fechaUltimaModificacion.time.minute < 10 ?
                        '0' + value.fechaUltimaModificacion.time.minute :
                        value.fechaUltimaModificacion.time.minute;
          var lastSecond = value.fechaUltimaModificacion.time.second < 10 ?
                        '0' + value.fechaUltimaModificacion.time.second :
                        value.fechaUltimaModificacion.time.second;

          var lastFecha = lastDay + '-' + lastMonth + '-' + value.fechaUltimaModificacion.date.year +
                          ', ' + lastHour + ':' + lastMin;
          var lastFechaComp = value.fechaUltimaModificacion.date.year + '-' + lastMonth + '-' + lastDay +
                          ', ' + lastHour + ':' + lastMin + ':' + lastSecond;

          var city = value.ciudad.charAt(0) + value.ciudad.substring(1,value.ciudad.length).toLowerCase();
          var buildingParts = value.edificio.split(" ");
          var building = "";
          angular.forEach(buildingParts, function(value, key) {
            var part = value;
            building += part.charAt(0) + part.substring(1,part.length).toLowerCase();
            if (key < buildingParts.length - 1) building += " ";
          });
          var floor = value.planta < 10 ? value.planta.charAt(1) : value.planta;

          console.log(value);

          var cambio = {
            'id': value.id_notificacion,
            'tipo': value.tipo_notificacion,
            'id_espacio': value.id_espacio,
            'espacio': value.espacio,
            'fecha': fecha,
            'fechaUltimaModificacion': lastFecha,
            'fechaUltimaModificacionComp': lastFechaComp,
            'descripcion': value.descripcion,
            'ngDescripcion': value.descripcion,
            'oldDescripcion': value.descripcion,
            'estado': value.estado,
            'foto': value.foto,
            'comentario_admin': value.comentario_admin,
            'ciudad': city,
            'campus': value.campus,
            'edificio': building,
            'planta': floor
          };

          console.log("cambio " + cambio.id + ", fechaUltimaModificacion: " + cambio.fechaUltimaModificacionComp);
          console.log(value.fechaUltimaModificacion.time);

          // Carga la imagen del cambio seleccionado
          promises.push(notificationService.getCambioImage(cambio)
            .then(function(data) {

              var tempImage = new Image();
              tempImage.src = 'data:image/jpg;base64,' + data;

              // Guarda el cambio con la imagen asociada
              var dim = $scope.resizeImage(tempImage.width, tempImage.height);

              $scope.cambios[cambio.estado].push(
                {
                  'cambio': cambio,
                  'imagen': {
                    src: tempImage.src,
                    width: dim.width,
                    height: dim.height
                  },
                  'oldImagen': {
                    src: tempImage.src,
                    width: dim.width,
                    height: dim.height
                  }
                }
              );
          }));
        });
        return $q.all(promises);
      });
    };

  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.cambios = changeInfoService.getCambios();

    // $ionicScrollDelegate.getScrollView().options.speedMultiplier = 5;

    // if ($scope.cambios == {}) {

      console.log("Cargando cambios");

      return $scope.initChanges()
        .then(function(){

          console.log("Cambios cargados con exito");


          // Ordena los cambios por fecha de ultima modificacion
          console.log($scope.cambios);

          // Carga los cambios (con imagenes asociadas) en el servicio
          changeInfoService.setCambios($scope.cambios);

          // Carga los numeros de cambios de cada estado
          angular.forEach($scope.estados, function(value, key) {
            changeInfoService.setNumCambiosNuevosEstado(value, $scope.cambios[value].length);
          });

          // $ionicLoading.hide();
          $scope.cargar = false;
          $scope.cambiosCargados = true;
        });
    // }
    // else {
    //   console.log("Carga innecesaria");
    // }
  });

  // Funciones auxiliares

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

  $scope.getCambiosEstado = function(){
    var estadoActual = changeInfoService.getEstado();
    return $scope.cambios[estadoActual];
  };

  $scope.isStatusShown = function(status){
    var estadoActual = changeInfoService.getEstado();
    return estadoActual == status;
  };

  $scope.isStatusEmpty = function(){
    if ($scope.cambiosCargados) {
      var estadoActual = changeInfoService.getEstado();
      if ($scope.cambios[estadoActual] !== undefined) {
        return $scope.cambios[estadoActual].length === 0;
      }
      else {
        return true;
      }
    }
  };

  $scope.showDetails = function(_event, cambio, index) {

    setTimeout(function() {

      // Stores original change info so it can be reset if
      // user cancels the update
      $scope.originalCambio = angular.copy(cambio);
      $scope.imagePreview = angular.copy(cambio.imagen);
      $scope.seeDetails = index;

      _event.stopPropagation();
      $scope.$apply();
    }, 0);
  };

  $scope.hideDetails = function(index) {
    var estadoActual = changeInfoService.getEstado();

    // Resets original change info
    $scope.cambios[estadoActual][index] = angular.copy($scope.originalCambio);
    $scope.originalCambio = undefined;

    // Hides details and scrolls up to the item resumend view
    $scope.seeDetails = -1;
    $ionicScrollDelegate.scrollTop();
  };

  $scope.resetDetails = function(index) {
    var estadoActual = changeInfoService.getEstado();
    $scope.cambios[estadoActual][index].cambio.descripcion =
      $scope.cambios[estadoActual][index].cambio.oldDescripcion;

    $scope.cambios[estadoActual][index].imagen.src =
      angular.copy($scope.cambios[estadoActual][index].oldImagen.src);
  };

  $scope.saveDetails = function() {
    $scope.originalCambio = undefined;
    $scope.seeDetails = -1;
    $ionicScrollDelegate.scrollTop();
  };

  $scope.isDescripcionUpdated = function(index) {
    var estadoActual = changeInfoService.getEstado();
    if ($scope.cambios[estadoActual][index] !== undefined) {
      return $scope.cambios[estadoActual][index].cambio.descripcion !=
             $scope.cambios[estadoActual][index].cambio.oldDescripcion;
    }
    else {
      return false;
    }
  };

  $scope.isImagenUpdated = function(index) {
    var estadoActual = changeInfoService.getEstado();
    // console.log(estadoActual + " - " + estado);
    if ($scope.cambios[estadoActual][index] !== undefined) {
      return $scope.cambios[estadoActual][index].imagen.src !=
             $scope.cambios[estadoActual][index].oldImagen.src;
    }
    else {
      return false;
    }
  };

  $scope.isChangeUpdated = function(index) {
    return $scope.isImagenUpdated(index) || $scope.isDescripcionUpdated(index);
  };

  $scope.areDetailsShown = function(index) {
    return $scope.seeDetails == index;
  };

  // Actualiza el cambio modificado
  $scope.updateCambio = function(cambio, index){

    // Si se ha incluido una nueva imagen se sube al servidor
    if ($scope.isDescripcionUpdated(index)) {
      // No hace falta hacer nada especial
    }

    if ($scope.isImagenUpdated(index)) {

      // Sube la imagen al servidor
      $scope.uploadPictureFromInput(cambio.cambio.id, cambio.cambio.id_espacio, index);
    }

    // Actualiza la información del cambio
    // console.log("datos cambio: " + JSON.stringify(cambio.cambio));
    notificationService.updateNotification(cambio.cambio)
      .then(function() {

        $scope.saveDetails();
        console.log("Cambio actualizado con exito");

        var alertPopup = $ionicPopup.alert({
          title: $scope.i18n.changes.modals.success_upload.title,
          template: '<p>'+$scope.i18n.changes.modals.success_upload.text+'</p>'
        });
        $scope.popupActive = true;

        alertPopup.then(function(res){
          if ($('.popup-container').length > 0) {
            $('.popup-container').remove();

            // $scope.popupActive = false;
            $scope.updateChangeList(cambio);
            // $scope.refreshCambios();
          }
        });
      });
  };

  // Upload picture to server
  $scope.uploadPictureFromInput = function(id_notificacion, id_espacio, index) {
      $ionicLoading.show({template: $scope.i18n.loading_mask.sending_image});
      var file = $('input[id=imageInput' + index + ']')[0].files[0];

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
          formData.append('name', [id_espacio, new Date().getTime()].join('_') + '.jpg');
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
                  // var alertPopup = $ionicPopup.alert({
                  //     title: $scope.i18n.photos.modals.success_upload.title,
                  //     template: '<p>'+$scope.i18n.photos.modals.success_upload.text+'</p>'
                  // });
                  // alertPopup.then(function(res){
                  //     if ($('.popup-container').length > 0) {
                  //         $('.popup-container').remove();
                  //     }
                  // });
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
            // var alertPopup = $ionicPopup.alert({
            //     title: $scope.i18n.cambios.success_upload.title,
            //     template: '<p>'+$scope.i18n.cambios.success_upload.text+'</p>'
            // });
            // alertPopup.then(function(res){
            //     if ($('.popup-container').length > 0) {
            //         $('.popup-container').remove();
            //     }
            // });
          });
      }
  };

  $scope.setPreview = function(imagePreview, index) {
    var tempImage = new Image();
    tempImage.src = imagePreview;
    tempImage.onload = function() {
      var resizedImage = $scope.resizeImage(tempImage.width, tempImage.height);
      imageWidthHeight = 'width="' + resizedImage.width + '" height="' + resizedImage.height + '"';
      $scope.cambios[$scope.statusShown][index].imagen.src = angular.copy(tempImage.src);
      $scope.$apply();
    };
  };

  //Open popup for adding a photo
  $scope.addPhoto = function(index) {

      console.log("ADDING PHOTO");

      $scope.hideNoPhotosText = true;
      if (typeof(Camera) !== 'undefined') {
          var addPhotoPopup = $ionicPopup.show({
              templateUrl: 'templates/popups/confirmUploadPhoto.html',
              title: $scope.i18n.photos.modals.confirm_upload1.title_upload,
              scope: $scope,
              buttons: [
                  {
                      text: '<i class="fa fa-camera" aria-hidden="true"></i>',
                      type: 'button-positive',
                      onTap: function(e) {
                          e.preventDefault();
                          var emailChecked = $('#confirm-upload-photo-popup input[type="checkbox"]').is(':checked'),
                              emailValue = $($('#confirm-upload-photo-popup input')[1]).val();
                          var email = checkEmail(emailChecked, emailValue);
                          if (email !== 0) {
                              if (email == 1) email = '';
                              $scope.selectPicture(email, addPhotoPopup, 'CAMERA');
                          }
                      }
                  },
                  {
                      text: '<i class="fa fa-folder-open-o" aria-hidden="true"></i>',
                      type: 'button-positive',
                      onTap: function(e) {
                          e.preventDefault();
                          var emailChecked = $('#confirm-upload-photo-popup input[type="checkbox"]').is(':checked'),
                              emailValue = $($('#confirm-upload-photo-popup input')[1]).val();
                          var email = checkEmail(emailChecked, emailValue);
                          if (email !== 0) {
                              if (email == 1) email = '';
                              $scope.selectPicture(email, addPhotoPopup, 'PHOTOLIBRARY');
                          }
                      }
                  },
                  {
                      text: '<i class="fa fa-times-circle-o" aria-hidden="true"></i>',
                      type: 'button-assertive'
                  }
              ]
          });
      }
      else {

          // No hay ninguna camara definida
          // console.log("Abriendo galeria");
          //
          // // Obtiene la imagen en formato 'file'
          // console.log('id=photo' + index);
          // var inputName = 'photo';
          // var fileInput = document.getElementById('imageInput' + index)[0];
          //
          // console.log(fileInput);
          // var file = fileInput.files[0];
          //
          // console.log("Imagen obtenida");
          //
          // // Convierte la imagen
          // var imageSrc = file.getAsDataURL();
          //
          // console.log("Imagen as URL");

          // La guarda asociada a su cambio
          // $scope.cambios[$scope.statusShown][index].imagen.src = $scope.newImageData;
          // console.log($scope.cambios[$scope.statusShown][index].cambio.src == $scope.newImageData);
      }
  };

  //Open camera or gallery to select a photo
  $scope.selectPicture = function(popup, mode) {

      var destinationType = (mode == 'CAMERA') ? Camera.DestinationType.FILE_URL : Camera.DestinationType.FILE_URL;
      var sourceType = (mode == 'CAMERA') ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY;
      var options = {
          quality: 20,
          saveToPhotoAlbum: true,
          allowEdit: false,
          encondingType: Camera.EncodingType.JPEG,
          destinationType: destinationType,
          sourceType: sourceType
      };

      $cordovaCamera.getPicture(options).then(
          function(imageData) {
              console.log('Image', imageData);
              $scope.picURL = imageData;
          },
          function(err){
              console.log('Error selecting picture', err);
              if (err != 'Camera cancelled') {
                  $ionicLoading.show({template: $scope.i18n.loading_mask.error_load_image, duration:1500});
              }
      });
  };

  $scope.setCurrentChange = function(index) {

    console.log("SETTING: " + index);

    // Click event triggers twice (from Label and from the Input inside it)
    // so it only listens to the LABEL (where the $index is correct)
    if( event.target.tagName === "LABEL" ) {
      $scope.currentChange = index;
    }
  };

  $scope.getCurrentChange = function() {
    return $scope.currentChange;
  };

  $scope.isStatus = function(estado) {
    var estadoActual = changeInfoService.getEstado();
    // console.log(estadoActual + " - " + estado);
    return estadoActual == estado;
  };

  $scope.refreshCambios = function() {
    console.log("Toca refrescar cambios");
    $scope.cambiosCargados = false;
    return $scope.initChanges()
      .then(function() {

        // Guarda los cambios actualizados en el servicio
        changeInfoService.setCambios($scope.cambios);
        $ionicLoading.hide();
        $scope.cambiosCargados = true;
      });
  };

  $scope.areChangesToLoad = function() {
    if ($scope.cambiosCargados) {
      var estado = changeInfoService.getEstado();
      var numCambios = changeInfoService.getNumCambiosNuevos(estado);
      var cambios = changeInfoService.getCambios();
      $scope.difNumCambiosNuevos = numCambios - cambios[estado].length;

      if (cambios[estado] !== undefined) {
      // console.log(numCambios + " - " + cambios[estado].length);
        return numCambios != cambios[estado].length;
      }
      else {
        return false;
      }
    }
    else return false;
  };

  $scope.showNewChanges = function() {
    var estado = changeInfoService.getEstado();
    // var numCambios = changeInfoService.getNumCambiosNuevos(estado);
    var cambios = changeInfoService.getCambios();
    var cambiosNuevos = changeInfoService.getCambiosNuevos();

    console.log("showNewChanges()");
    console.log(cambios[estado]);
    console.log(cambiosNuevos[estado]);

    // Compara los cambios actuales con los nuevos
    angular.forEach(cambios[estado], function(value, key){

      // comprueba si el cambio actual esta entre los nuevos
      var cambioActual = value;
      var esNuevo = false;
      var index = key;
      var cambioNuevo;
      angular.forEach(cambiosNuevos[estado], function(value, key){
        console.log("cambioActual: " + cambioActual.cambio.id + " =? " + value.cambio.id);

        if (cambioActual.cambio.id != value.cambio.id) {
          // Elimina el cambio de la lista de cambios actuales
          console.log("hayQueQuitarlo, cambioID: " + cambioActual.cambio.id);
        }
        else {
          // El cambio esta entre los nuevos cambios (hay que actualizar)
          console.log("cambioActual se mantiene: " + cambioActual.cambio.id);
          esNuevo = true;
          cambioNuevo = value;
        }
      });

      // Elimina el cambio actual de la lista de cambios si no esta entre los nuevos
      if (!esNuevo) {
        cambios[estado].splice(index, 1);
        console.log("cambio eliminado: " + cambioActual.cambio.id);
      }
      else {

        // Mantiene el cambio en la lista (no lo elimina)
        console.log("Cambio correcto: " + cambioNuevo.cambio.id);
      }
    });

    console.log("1er paso done");
    console.log(cambios);

    // Compara los cambios nuevos con los actuales
    angular.forEach(cambiosNuevos[estado], function(value, key){

      // comprueba si el cambio nuevo esta entre los actuales
      var cambioNuevo = value;
      var esNuevo = true;
      var index = key;
      angular.forEach(cambios[estado], function(value, key){
        console.log("cambioNuevo: " + cambioNuevo.cambio.id + " =? " + value.cambio.id);
        if (cambioNuevo.cambio.id != value.cambio.id) {
          // Incluye el cambio de la lista de cambios nuevos
          console.log("cambio a incluir: " + cambioNuevo.cambio.id);
        }
        else {

          // El cambio nuevo ya estaba entre los cambios actuales (no hay que actualizar)
          console.log("cambio a NO incluir: " + cambioNuevo.cambio.id);
          esNuevo = false;
        }
      });

      if (esNuevo) {

        // Incluye el nuevo cambio en la lista de actuales
        console.log("Cambio nuevo añadido");
        cambios[estado].splice(0, 0, cambioNuevo);
      }
    });

    console.log("2º paso done");
    console.log(cambios);

  };

  $scope.updateChangeList = function(cambio) {
    var estado = changeInfoService.getEstado();
    var cambios = changeInfoService.getCambios();
    var cambiosNuevos = changeInfoService.getCambiosNuevos();

    // Elimina el cambio del estado pendiente del usuario
    cambios[estado] = cambios[estado].filter(function(item) {
      return item.cambio.id != cambio.cambio.id;
    });
    changeInfoService.setNumCambiosNuevosEstado(estado, cambios[estado].length);

    // Comprueba si hay que incluir el cambio en la lista de cambios pendientes del admin,
    // porque acaba de ser actualizado por el usuario y todavia no se ha refrescado
    var cambioEsta = false;
    angular.forEach(cambios.Pendiente, function(value, key) {
      if (value.cambio.id == cambio.cambio.id) cambioEsta = true;
    });

    if (!cambioEsta) {

      // El cambio ya ha sido incluido en la lista y por lo tanto no hay que añadirlo
      cambios.Pendiente.splice(0, 0, cambio);
      console.log(cambios);
      changeInfoService.setNumCambiosNuevosEstado('Pendiente', cambios.Pendiente.length);
    }
    $scope.popupActive = false;
  };

  $scope.getScrollPosition = function(){
   if (!$scope.mostrado) {
    //  console.log($ionicScrollDelegate.getScrollPosition());
    //  console.log($ionicScrollDelegate.getScrollView().options);
    //  console.log($ionicScrollDelegate.$getByHandle('mainScroll')._instances[1].getScrollView());
    //  $ionicScrollDelegate.$getByHandle('mainScroll')._instances[1].getScrollView().options.speedMultiplier = 50;
    //  $ionicScrollDelegate.getScrollView().options.wheelDampen = 20;
    //  console.log($ionicScrollDelegate.getScrollView().options.wheelDampen);
    //  $ionicScrollDelegate.scrollBy(0,20,true);
    //  $scope.mostrado = true;
   }
  };

  $scope.isPopupAcive = function() {
    return $scope.popupActive;
  };

  $scope.showDebug = function(debugInfo){
    console.log(debugInfo);
  };
});
