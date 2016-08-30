/**************************************************************************
 * EstanciaCtrl: Controlador encargado de la página de información de una estancia
 ***********************************************************************/

UZCampusWebMapApp.controller('EstanciaCtrl', function($scope, $rootScope, $ionicPopup, geoService, infoService, sharedProperties, APP_CONSTANTS){

        //This code will be executed every time the controller view is loaded
        $scope.$on('$ionicView.beforeEnter', function(){
            var estancia=localStorage.estancia;
            infoService.getEstancia(estancia).then(
                function (data) {
                    $scope.infoEstancia = data;
                    localStorage.lastSearch = data.ID_espacio;
                    $scope.data = {
                        city: data.ID_espacio,
                        estancia: data.ID_centro,
                        type: data.tipo_uso,
                        area: data.superficie
                    };
                }
            );
        });

        //Load the plan of the searched room
        $scope.verMapa = function(){
            var idEspacioArray = $scope.infoEstancia.ID_espacio.split('.');
            var planta = {
                floor: idEspacioArray[2],
                value: idEspacioArray.splice(0,idEspacioArray.length-1).join('_')
            }
            selectPlano(planta);
        };

        $scope.mostrarFoto = function() {//Comprueba si hay imagenes para dicha estancia, si no hay muestra un error, si lo hay, lo carga al usuario
            var fotos = 0,
                salirbucle = false,
                url = "";

            for (i = 1; i <= 6 && !salirbucle; i++) {//Menor que 6 porque es el maximo de fotos de las que se dispone de una misma estancia
                url = APP_CONSTANTS.URI_fotos + estancia + "(" + i + ") [640x480].jpg";
                $.ajax({
                    url: url,
                    type: 'HEAD',
                    async: false,
                    error: function () {
                        if (i == 1) alert($scope.translation.NOPHOTO);//Si no hay ninguna foto mostrar alerta
                        salirbucle = true;
                    },
                    success: function () {
                        fotos++;
                    }
                });
            }
            $rootScope.numeroFotos = fotos;
            if (fotos > 0) {
                url = APP_CONSTANTS.URI_fotos + estancia + "(";
                console.log(url);
                $rootScope.urlFoto = url;
                $rootScope.fotoSelecionada = Number(1);//Para empezar mostrando la imagen primera
                //$window.location.href = url;
                window.location = "#/app/foto";

            }
        };

        $scope.volver = function() {
            estancia = undefined;
            window.history.back();
        };

        $scope.favoritos = function() {
            localStorage.favoritos+=estancia;
            var alertPopup = $ionicPopup.alert({
                title: $scope.translation.ADDFAVOURITE
            });
            alertPopup.then(function(res) {
                //console.log('Thank you for not eating my delicious ice cream cone');
            });
        };
    });