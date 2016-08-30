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

        $scope.busquedaEspacios = function() {
            $ionicLoading.show({ template: 'Cargando...'});
            infoService.getEspacios().then(
                function (data) {
                    $rootScope.codigoEspacios = data;
                    $ionicLoading.hide();
                    if (data.length == 0){
                        $rootScope.resultadoCodigoEspacioVacio = true;
                    }
                },
                function(err){
                    console.log("Error on busquedaEspacios", err);
                    $ionicLoading.hide();
                    var errorMsg = '<div class="text-center">Ha ocurrido un error<br>';
                    errorMsg += 'buscando los espacios</div>';
                    $scope.showInfoPopup('¡Error!', errorMsg);
                }
            );
            //Mostar el select con el codigo de espacio después de pulsar el boton y rellenarlo
            document.getElementById('codEspacio').style.display= 'block' ;
        };

        //Once a city is selected, search its Campus
        $scope.selectCampus = function(ciudad) {
            $ionicLoading.show({ template: 'Cargando...'});
            infoService.getCampus(ciudad).then(
                function (data) {
                    $rootScope.Campus = data;
                    $ionicLoading.hide();
                    console.log(data);
                    if (data.length == 0){
                        $rootScope.resultadoCampusVacio = true;
                    }
                },
                function(err){
                    console.log("Error on selectCampus", err);
                    $ionicLoading.hide();
                    var errorMsg = '<div class="text-center">Ha ocurrido un error buscando<br>';
                    errorMsg += 'los campus de la ciudad</div>';
                    $scope.showInfoPopup('¡Error!', errorMsg);
                }
            );
        };

        //Once a Campus is selected, search its buildings
        $scope.selectEdificio = function(campus) {
            $ionicLoading.show({ template: 'Cargando...'});
            infoService.getEdificio(campus).then(
                function (data) {
                    $rootScope.Edificio = data;
                    $ionicLoading.hide();
                    console.log(data);
                    if (data.length == 0){
                        $rootScope.resultadoEdificioVacio = true;
                    }
                },
                function(err){
                    console.log("Error on selectEdificio", err);
                    $ionicLoading.hide();
                    var errorMsg = '<div class="text-center">Ha ocurrido un error buscando<br>';
                    errorMsg += 'los edificios del campus</div>';
                    $scope.showInfoPopup('¡Error!', errorMsg);
                }
            );
        };

        //Once a Building is selected, search it number of floors
        $scope.selectPlanta = function(edif) {
            for (x=0;x<$rootScope.Edificio.length;x++){
                if($rootScope.Edificio[x].ID_Edificio==edif){
                    $rootScope.EdificioEscogido = edif;
                    $rootScope.Planta = $rootScope.Edificio[x].plantas;
                }
            }
        };

        //Once a Floor is selected, search its rooms
        $scope.selectEstancia = function(planta) {
            $ionicLoading.show({ template: 'Cargando...'});
            infoService.getAllEstancias($rootScope.EdificioEscogido+planta).then(
                function (data) {
                    $rootScope.Estancias = data;
                    $ionicLoading.hide();
                    console.log(data);
                    if (data.length == 0){
                        $rootScope.resultadoEstanciasVacio = true;
                    }
                },
                function(err){
                    console.log("Error on selectEstancia", err);
                    $ionicLoading.hide();
                    var errorMsg = '<div class="text-center">Ha ocurrido un error buscando<br>';
                    errorMsg += 'los espacios de la planta</div>';
                    $scope.showInfoPopup('¡Error!', errorMsg);
                }
            );
        };

        //Go to room view and show information
        $scope.busqueda = function() {
            if(($("#selectCiudad option:selected").text().trim() == "")||($("#selectCampus option:selected").text().trim() == "")||
                ($("#selectEdificio option:selected").text().trim() == "")|| ($("#selectPlanta option:selected").text().trim() == "")||
                ($("#selectEstancia option:selected").text().trim() == "")){//Comprobar que no haya ningún select vacio
                alert($scope.translation.ALERT_SELECT);
            }
            else{
                localStorage.estancia = $("#selectEstancia option:selected").val().trim();
                $window.location = "#/app/estancia";
            }
        };
    });