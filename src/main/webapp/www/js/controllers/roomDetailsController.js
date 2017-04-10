/**************************************************************************
 * RoomDetailsCtrl: Controlador encargado de la página de información de una estancia
 ***********************************************************************/

UZCampusWebMapApp.controller('RoomDetailsCtrl', function($scope, $rootScope,
    $timeout, $ionicLoading, $ionicPopup, $cordovaCamera, $http, infoService,
    photosService, translationService, APP_CONSTANTS){

        translationService.getTranslation($scope, localStorage.selectedLanguage);

        $scope.showInfoPopup = function(title, msg){
            $ionicPopup.alert({
                title: title,
                template: msg
            });
        };

        //This code will be executed every time the controller view is loaded
        $scope.$on('$ionicView.beforeEnter', function(){
            var roomId = localStorage.room;
            $ionicLoading.show({ template: $scope.i18n.loading_mask.searching});
            infoService.getRoom(roomId).then(
                function (data) {
                    $scope.infoRoom = data;
                    localStorage.lastSearch = data.ID_espacio;
                    $ionicLoading.hide();
                    $scope.data = {
                        id: data.ID_espacio,
                        room: data.ID_centro,
                        type: data.tipo_uso,
                        area: data.superficie
                    };
                },
                function(err){
                    console.log('Error on getEstancia', err);
                    $ionicLoading.hide();
                    var errorMsg = '<div class="text-center">'+$scope.i18n.errors.search.room+roomId+'</div>';
                    $scope.showInfoPopup($scope.i18n.errors.error, errorMsg);
                    $timeout(function() {
                      $('#estancia-view .back-btn').click();
                    }, 0);
                }
            );
        });

        // Load plan of searched room
        $scope.goToRoomPlan = function(){
            localStorage.lastSearch = $scope.infoRoom.ID_espacio;
            var idEspacioArray = $scope.infoRoom.ID_espacio.split('.');
            var floorData = {
                floor: idEspacioArray[2],
                building: idEspacioArray.splice(0,idEspacioArray.length-2).join('.') + '.'
            };
            goToFloorMap(floorData);
        };

        $scope.loadPhotos = function() {
            $ionicLoading.show({ template: $scope.i18n.loading_mask.loading});
            // Get count of room photos that exists on server
            photosService.count(localStorage.room).then(
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
                    var errorMsg = '<div class="text-center">'+$scope.i18n.errors.search.photos+'</div>';
                    $scope.showInfoPopup($scope.i18n.errors.error, errorMsg);
                }
            );
        };

        //Function to check is email has been checked and is a valid one
        function checkEmail(emailChecked, email) {
            var emailValid = infoService.isValidEmailAddress(email);

            if (!emailChecked) {
                return 1;
            }
            else if (emailChecked && (email.length==0 || email==null || typeof(email)=='undefined' || !emailValid)) {
                $ionicLoading.show({ template: $scope.i18n.loading_mask.invalid_mail, duration: 1500});
                return 0;
            }
            else {
                return email;
            }
        };

        //Open popup for adding a photo
        $scope.popupNoPhotosFound = function(data) {

            $scope.hideNoPhotosText = false;
            if (typeof(Camera) !== 'undefined') {
                var addPhotoPopup = $ionicPopup.show({
                    templateUrl: 'templates/popups/confirmUploadPhoto.html',
                    title: $scope.i18n.photos.modals.confirm_upload1.title,
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
                                var emailChecked = $('#confirm-upload-photo-popup input[type="checkbox"]').is(':checked'),
                                    emailValue = $($('#confirm-upload-photo-popup input')[1]).val();
                                var email = checkEmail(emailChecked, emailValue);
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
            } else {
                var addPhotoPopup = $ionicPopup.show({
                    templateUrl: 'templates/popups/confirmUploadPhoto2.html',
                    title: $scope.i18n.photos.modals.confirm_upload2.title,
                    scope: $scope,
                    buttons: [
                        {
                            text: '<i class="fa fa-upload" aria-hidden="true"></i>',
                            type: 'button-positive',
                            onTap: function(e) {
                                e.preventDefault();
                                var emailChecked = $('#confirm-upload-photo2-popup input[type="checkbox"]').is(':checked'),
                                    emailValue = $($('#confirm-upload-photo2-popup input')[1]).val();
                                var email = checkEmail(emailChecked, emailValue);
                                if (email != 0) {
                                    if (email == 1) email = '';
                                    $scope.uploadPictureFromInput(email,addPhotoPopup);
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
                        $ionicLoading.show({template: $scope.i18n.loading_mask.error_load_image, duration:1500});
                    }
            });
        };

        //Upload picture to server
        $scope.uploadPicture = function(email, popup) {
            $ionicLoading.show({template: $scope.i18n.loading_mask.sending_image});
            var fileURL = $scope.picURL;
            var options = new FileUploadOptions();
            options.fileKey = 'file';
            options.fileName = [localStorage.room, new Date().getTime()].join('_') + '.jpg';
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
                        title: $scope.i18n.photos.modals.success_upload.title,
                        template: '<p>'+$scope.i18n.photos.modals.success_upload.text+'</p>'
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
                    $ionicLoading.show({template: $scope.i18n.loading_mask.error_send_image, duration:1500});
                }, options, true);
        };

        //Upload picture to server
        $scope.uploadPictureFromInput = function(email, popup) {
            $ionicLoading.show({template: $scope.i18n.loading_mask.sending_image});
            var file = $('input[name=imageUpload]')[0].files[0];

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

                // var params = {
                //   file: file,
                //   name: [localStorage.room, new Date().getTime()].join('_') + '.jpg',
                //   email: email,
                //   mode: 'user'
                // };

                var formData = new FormData();
                formData.append('file', file);
                formData.append('name', [localStorage.room, new Date().getTime()].join('_') + '.jpg');
                formData.append('email', email);
                formData.append('mode', 'user');
                console.log("formData", formData);
                $http({
                    url :  APP_CONSTANTS.URI_API + 'photos/upload/',
                    method: "POST",
                    data: formData,
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
                });
            }
        };

        /*$scope.back = function() {
            estancia = undefined;
            window.history.back();
        };*/
    });
