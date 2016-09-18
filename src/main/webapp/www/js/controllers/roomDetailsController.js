/**************************************************************************
 * RoomDetailsCtrl: Controlador encargado de la página de información de una estancia
 ***********************************************************************/

UZCampusWebMapApp.controller('RoomDetailsCtrl', function($scope, $rootScope, $timeout, $ionicLoading, $ionicPopup, $cordovaCamera, infoService, photosService, APP_CONSTANTS){

        $scope.showInfoPopup = function(title, msg){
            $ionicPopup.alert({
                title: title,
                template: msg
            });
        };

        //This code will be executed every time the controller view is loaded
        $scope.$on('$ionicView.beforeEnter', function(){
            var estancia = localStorage.estancia;
            $ionicLoading.show({ template: 'Buscando...'});
            infoService.getEstancia(estancia).then(
                function (data) {
                    $scope.infoEstancia = data;
                    localStorage.lastSearch = data.ID_espacio;
                    $ionicLoading.hide();
                    $scope.data = {
                        city: data.ID_espacio,
                        estancia: data.ID_centro,
                        type: data.tipo_uso,
                        area: data.superficie
                    };
                },
                function(err){
                    console.log('Error on getEstancia', err);
                    $ionicLoading.hide();
                    var errorMsg = '<div class="text-center">Ha ocurrido un error buscando<br>';
                    errorMsg += 'la estancia '+estancia+'</div>';
                    $scope.showInfoPopup('¡Error!', errorMsg);
                    $timeout(function() {
                      $('#estancia-view .back-btn').click();
                    }, 0);
                }
            );
        });

        // Load plan of searched room
        $scope.goToRoomPlan = function(){
            var idEspacioArray = $scope.infoEstancia.ID_espacio.split('.');
            var planta = {
                floor: idEspacioArray[2],
                value: idEspacioArray.splice(0,idEspacioArray.length-1).join('_')
            }
            selectPlano(planta);
        };

        $scope.loadPhotos = function() {

            var estancia = localStorage.estancia;
            $ionicLoading.show({ template: 'Cargando...'});
            // Get count of room photos that exists on server
            photosService.count(estancia).then(
                function (data) {
                    console.log('Success getting photos: ',data);
                    $ionicLoading.hide();
                    if (data.length === 0) {
                        $scope.popupNoPhotosFound();
                    }
                    else {
                        $rootScope.photos = data;
                        window.location = '#/app/photos';
                    }
                },
                function(err){
                    console.log('Error getting photos: ',err);
                    $ionicLoading.hide();
                    var errorMsg = '<div class="text-center">Ha ocurrido un error buscando<br>';
                    errorMsg += 'las fotos del espacio seleccionado</div>';
                    $scope.showInfoPopup('¡Error!', errorMsg);
                }
            );
        };

        //Function to check is email has been checked and is a valid one
        function checkEmail() {
            var emailChecked = $('#confirm-upload-photo-popup input[type="checkbox"]').is(':checked'),
                email = $($('#confirm-upload-photo-popup input')[1]).val(),
                emailValid = infoService.isValidEmailAddress(email);

            if (!emailChecked) {
                return 1;
            }
            else if (emailChecked && (email.length==0 || email==null || typeof(email)=='undefined' || !emailValid)) {
                $ionicLoading.show({ template: 'Introduzca un email válido', duration: 1500});
                return 0;
            }
            else {
                return email;
            }
        };

        //Open popup for adding a photo
        $scope.popupNoPhotosFound = function(data) {

            $scope.hideNoPhotosText = false;

            var addPhotoPopup = $ionicPopup.show({
                templateUrl: 'templates/popups/confirmUploadPhoto.html',
                title: 'No hay fotos',
                scope: $scope,
                buttons: [
                    {
                        text: '<i class="fa fa-camera" aria-hidden="true"></i>',
                        type: 'button-positive',
                        onTap: function(e) {
                            e.preventDefault();
                            var email = checkEmail();
                            if (email != 0) {
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
                            var email = checkEmail();
                            if (email != 0) {
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
        };

        //Open camera or gallery to select a photo
        $scope.selectPicture = function(email, popup, mode) {

            var destinationType = (mode === 'CAMERA') ? Camera.DestinationType.FILE_URL : Camera.DestinationType.FILE_URI;
            var sourceType = (mode === 'CAMERA') ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY;
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
                    $scope.ftLoad = true;
                    $scope.uploadPicture(email,popup);
                },
                function(err){
                    console.log('Error selecting picture', err);
                    if (err != 'Camera cancelled') {
                        $ionicLoading.show({template: 'Error al cargar la imagen', duration:1500});
                    }
            });
        };

        //Upload picture to server
        $scope.uploadPicture = function(email, popup) {
            $ionicLoading.show({template: 'Enviando la foto...'});
            var fileURL = $scope.picURL;
            var options = new FileUploadOptions();
            options.fileKey = 'file';
            options.fileName = [localStorage.estancia, new Date().getTime()].join('_') + '.jpg';
            options.mimeType = 'image/jpeg';
            options.httpMethod = 'POST';
            options.chunkedMode = true;

            var serverURL = APP_CONSTANTS.URI_API + 'photos/upload/';

            var params = {};
            params.name = options.fileName;
            params.email = email;
            params.mode = 'user';

            options.params = params;

            var ft = new FileTransfer();
            ft.upload(fileURL, serverURL, 
                function(){
                    console.log("Success uploading photo to server", arguments);
                    popup.close();
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Foto subida con éxito',
                        template: '<p>La imagen se ha enviado con éxito. Recuerde que primero deberá ser aprobada por un administrador</p>'
                    });
                    alertPopup.then(function(res){
                        if ($('.popup-container').length > 0) {
                            $('.popup-container').remove();
                        }
                    });
                },
                function(){
                    console.log("Error uploading photo to server", arguments);
                    $ionicLoading.hide();
                    $ionicLoading.show({template: 'Error al enviar la imagen', duration:1500});
                }, options, true);
        };

        /*$scope.back = function() {
            estancia = undefined;
            window.history.back();
        };*/
    });