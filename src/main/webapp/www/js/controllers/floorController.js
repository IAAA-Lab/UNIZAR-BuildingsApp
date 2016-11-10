/**********************************************************************
 * PlanCtrl: Controlador del plano del edificio en  Leaflet
 ***********************************************************************/

UZCampusWebMapApp.controller('FloorCtrl',function($scope, $http, $ionicModal, $ionicLoading, $ionicPopup, geoService, infoService, poisService, sharedProperties, APP_CONSTANTS) {

    //This code will be executed every time the controller view is loaded
    $scope.$on('$ionicView.beforeEnter', function(){
        geoService.crearPlano($scope, $http, infoService, sharedProperties, poisService, $scope.openCreatePOIModal);
    });

    $scope.pois = APP_CONSTANTS.pois;

    //Define Ionic Modal for add a new POI
    $ionicModal.fromTemplateUrl('templates/addPOI.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalCreatePOI = modal;
    });

    $ionicModal.fromTemplateUrl('templates/editPOI.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalEditPOI = modal;
    });

    $scope.$on('modal.hidden', function(event, modal) {
        console.log("Modal " + modal.modalEl.id + " hide");
    });

    //Open the modal for add a POI and load data in the modal form
    $scope.openCreatePOIModal = function(latlng, id) {
        console.log("openCreatePOIModal", latlng, id, localStorage.building, localStorage.floor);

        infoService.getRoomInfo(id).then(
            function (data) {
                if (data !== null && typeof(data)!=='undefined') {
                    $ionicLoading.show({template: $scope.i18n.loading_mask.loading});
                    var floor = localStorage.floor;
                    $scope.existsCity = (data.ciudad != null && typeof data.ciudad !== 'undefined') ? true : false;
                    $scope.existsCampus = (data.campus != null && typeof data.campus !== 'undefined') ? true : false;
                    $scope.existsBuilding = (data.edificio != null && typeof data.edificio !== 'undefined') ? true : false;
                    $scope.existsAddress = (data.dir != null && typeof data.dir !== 'undefined') ? true : false;
                    $scope.existsFloor = (floor != null && typeof floor !== 'undefined') ? true : false;
                    $scope.existsRoom = (data.ID_espacio != null && typeof data.ID_espacio !== 'undefined') ? true : false;

                    var city = data.ciudad.toLowerCase();

                    $scope.data = {
                        city: city.substr(0, 1).toUpperCase() + city.substr(1),
                        campus: data.campus,
                        building: data.edificio,
                        address: data.dir,
                        floor: floor,
                        roomId: data.ID_espacio,
                        roomName: data.ID_centro,
                        room: data.ID_espacio + ' (' + data.ID_centro + ')',
                        latitude: latlng.lat,
                        longitude: latlng.lng
                    };
                    console.log("Data to modal",$scope.data);
                    $ionicLoading.hide();
                    $scope.modalCreatePOI.show().then(function(){
                        $('#add-poi-modal .form-error').each(function(el) { $(this).hide()});
                    });
                } 
            },
            function(err){
                console.log("Error on getInfoEstancia", err);
                var errorMsg = '<div class="text-center">'+$scope.i18n.errors.info.room+'</div>';
                $scope.showInfoPopup($scope.i18n.errors.error, errorMsg);
            }
        );
    };

    $scope.confirmCreatePOI = function(data) {

        var confirmCreatePOIpopup = $ionicPopup.show({
            templateUrl: 'templates/popups/confirmCreatePOI.html',
            title: $scope.i18n.pois.modals.confirm_creation.title,
            scope: $scope,
            buttons: [
                {
                    text: '<b>'+$scope.i18n.pois.modals.confirm_creation.buttons.ok+'</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        e.preventDefault();
                        var emailChecked = $('#confirm-create-poi-popup input[type="checkbox"]').is(':checked'),
                            email = $($('#confirm-create-poi-popup input')[1]).val(),
                            emailValid = infoService.isValidEmailAddress(email);

                        if (emailChecked && (email.length==0 || email==null || typeof(email)=='undefined' || !emailValid)) {
                            $ionicLoading.show({ template: $scope.i18n.loading_mask.invalid_mail, duration: 1500});
                        }
                        else {
                            data.email = email;
                            $scope.finalSubmitCreatePOI(data);
                            confirmCreatePOIpopup.close();
                        }
                    }
                },
                { 
                    text: $scope.i18n.pois.modals.confirm_creation.buttons.cancel,
                    type: 'button-assertive'
                }
            ]
        });
    };

    $scope.finalSubmitCreatePOI = function(data) {
        console.log("finalSubmitCreatePOI form",data);
        $ionicLoading.show({ template: $scope.i18n.loading_mask.sending});
        poisService.createPOI(data).then(
            function(poi) {
                console.log("Create POI success",poi);
                $ionicLoading.hide();
                var successMsg = '<div class="text-center">'+$scope.i18n.success.pois.creation+'</div>';
                $scope.showInfoPopup($scope.i18n.success.success, successMsg)
                $scope.modalCreatePOI.hide();
                geoService.updatePOIs(sharedProperties.getFloorMap(), sharedProperties);
            },
            function(err){
                console.log("Error on createPOI", err);
                $ionicLoading.hide();
                var errorMsg = '<div class="text-center">'+$scope.i18n.errors.pois.creation+'</div>';
                $scope.showInfoPopup($scope.i18n.errors.error, errorMsg);
            }
        );
    };

    $scope.openEditPOIModal = function(id){
        console.log("openEditPOIModal", id);
        $ionicLoading.show({template: $scope.i18n.loading_mask.loading});

        poisService.getInfoPOI(id).then(
            function(poi) {
                console.log("Get POI info success",poi);
                var data = poi.data;
                if (data.length === 0) $ionicLoading.hide();
                else {
                    $scope.existsCity = (data.city != null && typeof data.city !== 'undefined') ? true : false;
                    $scope.existsCampus = (data.campus != null && typeof data.campus !== 'undefined') ? true : false;
                    $scope.existsBuilding = (data.building != null && typeof data.building !== 'undefined') ? true : false;
                    $scope.existsAddress = (data.address != null && typeof data.address !== 'undefined') ? true : false;
                    $scope.existsFloor = (data.floor != null && typeof data.floor !== 'undefined') ? true : false;
                    $scope.existsRoom = (data.roomId != null && typeof data.roomId !== 'undefined') ? true : false;

                    data.room = data.roomId + ' (' + data.roomName + ')';

                    $scope.data = data;

                    console.log("Data to modal",$scope.data, $scope.pois, $scope.floors);
                    $ionicLoading.hide();
                    $scope.modalEditPOI.show().then(function(){
                        $('#edit-poi-modal .form-error').each(function(el) { $(this).hide()});
                    });
                } 
            },
            function(err){
                console.log("Error on get POI info", err);
                $ionicLoading.hide();
                var errorMsg = '<div class="text-center">'+$scope.i18n.errors.pois.get_info+'</div>';
                $scope.showInfoPopup($scope.i18n.errors.error, errorMsg);
            }
        );
    };

    $scope.$on('modalEditPOI.hidden', function() {
        console.log("Modal hide");
    });

    $scope.confirmEditPOI = function(data) {
        var confirmEditPOIpopup = $ionicPopup.show({
            templateUrl: 'templates/popups/confirmEditPOI.html',
            title: $scope.i18n.pois.modals.confirm_creation.title,
            scope: $scope,
            buttons: [
                {
                    text: '<b>'+$scope.i18n.pois.modals.confirm_creation.buttons.ok+'</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        e.preventDefault();
                        var emailChecked = $('#confirm-edit-poi-popup input[type="checkbox"]').is(':checked'),
                            email = $($('#confirm-edit-poi-popup input')[1]).val(),
                            emailValid = infoService.isValidEmailAddress(email);

                        if (emailChecked && (email.length==0 || email==null || typeof(email)=='undefined' || !emailValid)) {
                            $ionicLoading.show({ template: $scope.i18n.loading_mask.invalid_mail, duration: 1500});
                        }
                        else {
                            data.email = email;
                            $scope.finalSubmitEditPOI(data);
                            confirmEditPOIpopup.close();
                        }
                    }
                },
                { 
                    text: $scope.i18n.pois.modals.confirm_creation.buttons.cancel,
                    type: 'button-assertive'
                }
            ]
        });
    };

    $scope.finalSubmitEditPOI = function(data) {
        console.log("finalSubmitEditPOI form",data);
        $ionicLoading.show({ template: $scope.i18n.loading_mask.sending});
        $ionicLoading.hide();

        data.comment = data.comments;
        data.type = "edit";
        data.poi = data.id;

        poisService.modifyPOI(data).then(
            function(poi) {
                console.log("Request modify POI success",poi);
                $ionicLoading.hide();
                var successMsg = '<div class="text-center">'+$scope.i18n.success.pois.edition+'</div>';
                $scope.showInfoPopup($scope.i18n.success.success, successMsg)
                $scope.modalEditPOI.hide();
            },
            function(err){
                console.log("Error on finalSubmitEditPOI", err);
                $ionicLoading.hide();
                var errorMsg = '<div class="text-center">'+$scope.i18n.errors.pois.edition+'</div>';
                $scope.showInfoPopup($scope.i18n.errors.error, errorMsg);
            }
        );
    };

    $scope.confirmDeletePOI = function(data) {
        var confirmDeletePOI = $ionicPopup.show({
            templateUrl: 'templates/popups/confirmDeletePOI.html',
            title: $scope.i18n.pois.modals.confirm_delete.title,
            scope: $scope,
            buttons: [
                {
                    text: '<b>'+$scope.i18n.pois.modals.confirm_delete.buttons.ok+'</b>',
                    type: 'button-assertive',
                    onTap: function(e) {
                        e.preventDefault();
                        var emailChecked = $('#confirm-edit-poi-popup input[type="checkbox"]').is(':checked'),
                            email = $($('#confirm-delete-poi-popup input')[1]).val(),
                            emailValid = infoService.isValidEmailAddress(email),
                            reason = $('#confirm-delete-poi-popup textarea').val();

                        if (emailChecked && (email.length==0 || email==null || typeof(email)=='undefined' || !emailValid)) {
                            $ionicLoading.show({ template: $scope.i18n.loading_mask.invalid_mail, duration: 1500});
                        }
                        else if (reason.length==0 || reason==null || typeof(reason)=='undefined') {
                            $ionicLoading.show({ template: $scope.i18n.loading_mask.invalid_reason, duration: 1500});   
                        }
                        else {
                            data.email = email;
                            data.reason = reason;
                            $scope.finalSubmitDeletePOI(data);
                            confirmDeletePOI.close();
                        }
                    }
                },
                { 
                    text: $scope.i18n.pois.modals.confirm_delete.buttons.cancel,
                    type: 'button-stable'
                }
            ]
        });
    };

    $scope.finalSubmitDeletePOI = function(data) {
        console.log("finalSubmitDeletePOI form",data);
        $ionicLoading.show({ template: $scope.i18n.loading_mask.sending});
        $ionicLoading.hide();

        data.type = "delete";
        data.poi = data.id;

        poisService.modifyPOI(data).then(
            function(poi) {
                console.log("Request delete POI success",poi);
                $ionicLoading.hide();
                var successMsg = '<div class="text-center">'+$scope.i18n.success.pois.delete+'</div>';
                $scope.showInfoPopup($scope.i18n.success.success, successMsg)
                $scope.modalEditPOI.hide();
            },
            function(err){
                console.log("Error on finalSubmitDeletePOI", err);
                $ionicLoading.hide();
                var errorMsg = '<div class="text-center">'+$scope.i18n.errors.pois.delete+'</div>';
                $scope.showInfoPopup($scope.i18n.errors.error, errorMsg);
            }
        );
    };

    $scope.showInfoPopup = function(title, msg){
        $ionicPopup.alert({
            title: title,
            template: msg
        });
    };
});