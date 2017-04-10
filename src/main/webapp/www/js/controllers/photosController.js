/**************************************************************************
 * PhotosCtrl: Controlador encargado de las acciones de la vista de fotos de una estancia
 ***********************************************************************/

UZCampusWebMapApp.controller('PhotosCtrl', function($scope, $rootScope, $window, infoService, $ionicLoading, $ionicPopup, $cordovaCamera, APP_CONSTANTS){

        var photos = $rootScope.photos,
            numPhotos = photos.length,
            firstPhoto = photos[0];

        $scope.dimensions = {"width": APP_CONSTANTS.photosWidth, "height": APP_CONSTANTS.photosHeight};

        $rootScope.photoIndex = 1;

        //Calculates image dimensions based on device dimensions
        $scope.calculateDimensions = function() {
            return {
                "width": $window.innerWidth,
                "height": $window.innerHeight-150
            }
        }

        $scope.resizeImage = function(width, height) {
            var maxWidth = $scope.dimensions.width,
                maxHeight = $scope.dimensions.height,
                ratio = Math.min(maxWidth / width, maxHeight / height);

            return {
                width: width*ratio,
                height: height*ratio
            };
        }

        angular.element($window).bind('resize', function(){
            $scope.$apply(function() {
              $scope.dimensions = $scope.calculateDimensions();
            })
          });

        //This code will be executed every time the controller view is loaded
        $scope.$on('$ionicView.beforeEnter', function(){
            photos = $rootScope.photos;
            $rootScope.photoIndex = 1;
            $scope.dimensions = $scope.calculateDimensions();
        });

        $rootScope.disableBtnPrevious = true;
        $rootScope.disableBtnNext = numPhotos > 1 ? false : true;

        $scope.dimensions = $scope.calculateDimensions();

        var tempImage = new Image();
        tempImage.src = APP_CONSTANTS.URI_Photos + firstPhoto;
        tempImage.onload = function() {
            var resizedImage = $scope.resizeImage(tempImage.width, tempImage.height),
                imageWidthHeight = 'width="' + resizedImage.width + '" height="' + resizedImage.height + '"';

            $("#roomImage").html('<img src="' + APP_CONSTANTS.URI_Photos + firstPhoto + '"'+imageWidthHeight+'></img>');
            $("#photosData").html('<strong>'+$scope.i18n.photos.legend.photo + $rootScope.photoIndex + $scope.i18n.photos.legend.of + numPhotos + '</strong>');
        }

        //Click on previous photo button
        $scope.previous = function() {
            $rootScope.photoIndex -= 1;
            $scope.dimensions = $scope.calculateDimensions();

            var imagePath = APP_CONSTANTS.URI_Photos + photos[$rootScope.photoIndex-1];
            var tempImage = new Image();
            tempImage.src = imagePath;
            tempImage.onload = function() {
                var resizedImage = $scope.resizeImage(tempImage.width, tempImage.height),
                    imageWidthHeight = 'width="' + resizedImage.width + '" height="' + resizedImage.height + '"';

                var image = '<img src="' + imagePath + '"'+imageWidthHeight+'></img>';
                var imageData = '<strong>'+$scope.i18n.photos.legend.photo + $rootScope.photoIndex + $scope.i18n.photos.legend.of + numPhotos + '</strong>';

                $("#roomImage").html(image);
                $("#photosData").html(imageData);
            }

            if ($rootScope.photoIndex == 1) $rootScope.disableBtnPrevious = true;
            $rootScope.disableBtnNext = false;
        };

        //Click on next photo button
        $scope.next = function() {
            $rootScope.photoIndex += 1;
            $scope.dimensions = $scope.calculateDimensions();

            var imagePath = APP_CONSTANTS.URI_Photos + photos[$rootScope.photoIndex-1];
            var tempImage = new Image();
            tempImage.src = imagePath;
            tempImage.onload = function() {
                var resizedImage = $scope.resizeImage(tempImage.width, tempImage.height),
                    imageWidthHeight = 'width="' + resizedImage.width + '" height="' + resizedImage.height + '"';

                var image = '<img src="' + imagePath + '"'+imageWidthHeight+'></img>';
                var imageData = '<strong>'+$scope.i18n.photos.legend.photo + $rootScope.photoIndex + $scope.i18n.photos.legend.of + numPhotos + '</strong>';

                $("#roomImage").html(image);
                $("#photosData").html(imageData);
            }

            if ($rootScope.photoIndex == numPhotos) $rootScope.disableBtnNext = true;
            $rootScope.disableBtnPrevious = false;
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
        $scope.addPhoto = function(data) {

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
            }
            else {

                console.log("Abriendo galeria");

                var addPhotoPopup = $ionicPopup.show({
                    templateUrl: 'templates/popups/confirmUploadPhoto2.html',
                    title: $scope.i18n.photos.modals.confirm_upload2.title,
                    scope: $scope,
                    buttons: [
                        {
                            text: '<i class="fa fa-upload" aria-hidden="true"></i>',
                            type: 'button-positive',
                            onTap: function(e) {

                                  console.log("VAMOS A SUBIRLA");

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
                var formData = new FormData();
                formData.append('file', file);
                formData.append('name', [localStorage.room, new Date().getTime()].join('_') + '.jpg');
                formData.append('email', email);
                formData.append('mode', 'user');
                console.log("formData", formData);
                $http({
                    url :  APP_CONSTANTS.URI_API + 'photos/upload/',
                    method: "POST",
                    data : formData,
                    contentType: false,
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


        /*$scope.volver = function() {
            $window.history.back();
        };*/
    });
