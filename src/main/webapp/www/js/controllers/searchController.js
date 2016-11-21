/**************************************************************************
 * SearchCtrl: Controlador encargado de las acciones de la vista de busqueda de estancias
 ***********************************************************************/

UZCampusWebMapApp.controller('SearchCtrl', function($scope, $rootScope, infoService, $window, $ionicLoading, $ionicPopup) {

        $scope.showInfoPopup = function(title, msg){
            $ionicPopup.alert({
                title: title,
                template: msg
            });
        };

        // For advanced search --> get codes for all existing rooms
        $scope.searchAllRoomsCodes = function() {
            $ionicLoading.show({ template: $scope.i18n.loading_mask.loading});
            infoService.getAllRoomsCodes().then(
                function (data) {
                    console.log("Success on searchAllRoomsCodes()", data);
                    $rootScope.codigoEspacios = data;
                    $ionicLoading.hide();
                },
                function(err){
                    console.log("Error on searchAllRoomsCodes", err);
                    $ionicLoading.hide();
                    var errorMsg = '<div class="text-center">'+$scope.i18n.errors.search.rooms+'</div>';
                    $scope.showInfoPopup($scope.i18n.errors.error, errorMsg);
                }
            );
            //Mostar el select con el codigo de espacio después de pulsar el boton y rellenarlo
            document.getElementById('codEspacio').style.display= 'block' ;
        };

        //Once a city is selected, search its Campus
        $scope.selectCampus = function(ciudad) {
            $ionicLoading.show({ template: $scope.i18n.loading_mask.loading});
            infoService.getCityCampus(ciudad).then(
                function (data) {
                    console.log("selectCampus(): Success on select " + ciudad + " campus", data);
                    $rootScope.Campus = data;
                    $ionicLoading.hide();
                },
                function(err){
                    console.log("selectCampus(): Error on select " + ciudad + " campus", err);
                    $ionicLoading.hide();
                    var errorMsg = '<div class="text-center">'+$scope.i18n.errors.search.campus+'</div>';
                    $scope.showInfoPopup($scope.i18n.errors.error, errorMsg);
                }
            );
        };

        //Once a Campus is selected, search its buildings
        $scope.selectEdificio = function(campus) {
            $ionicLoading.show({ template: $scope.i18n.loading_mask.loading});
            infoService.getCampusBuildings(campus).then(
                function (data) {
                    console.log("selectEdificio(): Success on select " + campus + " buildings", data);
                    $rootScope.buildings = data;
                    $ionicLoading.hide();
                },
                function(err){
                    console.log("selectEdificio(): Error on search " + campus + " buildings", err);
                    $ionicLoading.hide();
                    var errorMsg = '<div class="text-center">'+$scope.i18n.errors.search.buildings+'</div>';
                    $scope.showInfoPopup($scope.i18n.errors.error, errorMsg);
                }
            );
        };

        //Once a Building is selected, search it number of floors
        $scope.selectPlanta = function(buildingId) {
            for (x=0;x<$rootScope.buildings.length;x++){
                if($rootScope.buildings[x].ID_Edificio === buildingId){
                    $rootScope.selectedBuilding = buildingId;
                    $rootScope.floors = $rootScope.buildings[x].plantas;
                }
            }
        };

        //Once a Floor is selected, search its rooms
        $scope.selectEstancia = function(floorId) {
            $ionicLoading.show({ template: $scope.i18n.loading_mask.loading});
            infoService.getAllRooms($rootScope.selectedBuilding+floorId).then(
                function (data) {
                    console.log("selectEstancia(): Success on select floor rooms", data);
                    $rootScope.rooms = data;
                    $ionicLoading.hide();
                },
                function(err){
                    console.log("selectEstancia(): Error on select floor rooms", err);
                    $ionicLoading.hide();
                    var errorMsg = '<div class="text-center">'+$scope.i18n.errors.search.floor+'</div>';
                    $scope.showInfoPopup($scope.i18n.errors.error, errorMsg);
                }
            );
        };

        //Go to room view and show information
        $scope.search = function() {
            if(($("#selectCiudad option:selected").text().trim() == "")||($("#selectCampus option:selected").text().trim() == "")||
                ($("#selectEdificio option:selected").text().trim() == "")|| ($("#selectPlanta option:selected").text().trim() == "")||
                ($("#selectEstancia option:selected").text().trim() == "")) {
                var errorMsg = '<div class="text-center">'+$scope.i18n.errors.search.invalid_form+'</div>';
                $scope.showInfoPopup($scope.i18n.errors.warning, errorMsg);
            }
            else{
                localStorage.room = $("#selectEstancia option:selected").val().trim();
                $window.location = "#/app/roomDetails";
            }
        };
    });