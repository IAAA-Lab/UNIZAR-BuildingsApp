/**********************************************************************
 * infoService: Servicio que define todas las llamadas al web service para recoger los datos
 ***********************************************************************/

UZCampusWebMapApp.factory('infoService', function($http, $q, $timeout, $state, $rootScope, APP_CONSTANTS) {

        //Llamada AJAX al web service para recoger los codigos de espacio para rellenar el SELECT de busqueda avanzada
        var getAllRoomsCodes = function () {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_API + 'busquedas/codigoespacios',
                contentType: 'application/json',
                dataType: "json"
            };
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log("Error getAllRoomsCodes: ",err);
                        deferred.reject(err);
                    }
                );
            });
            return deferred.promise;
        };

        //Llamada AJAX al web service para recoger los campus segun la ciudad del SELECT de busqueda
        var getCityCampus = function (city) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_API + 'busquedas/campus?ciudad='+city,
                contentType: 'application/json',
                dataType: "json"
            };
            console.log(request);
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log("Error getCityCampus: ",err);
                        deferred.reject(err);
                    }
                );
            });
            return deferred.promise;
        };

        //Llamada AJAX al web service para recoger los edificios segun el campus del SELECT de busqueda
        var getCampusBuildings = function (campus) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_API + 'busquedas/edificio?campus='+campus,
                contentType: 'application/json',
                dataType: "json"
            };
            console.log(request);
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log("Error getCampusBuildings: ",err);
                        deferred.reject(err);
                    }
                );
            });
            return deferred.promise;
        };

        //Llamada AJAX al web service para recoger la informacion del edificio(nombre, direccion y numero de plantas)
        var getBuildingInfo = function (buildingId) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_API + 'busquedas/infoEdificio?id='+buildingId,
                contentType: 'application/json',
                dataType: "json"
            };
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log("Error getBuildingInfo: ",err);
                        deferred.reject(err);
                    }
                );
            });
            return deferred.promise;
        };

        var getRoomInfo = function (roomId) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_API + 'estancias/id_estancia?estancia='+roomId,
                contentType: 'application/json',
                dataType: "json"
            };
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log("Error getRoomInfo: ",err);
                        deferred.reject(err);
                    }
                );
            });
            return deferred.promise;
        };

        var getRoom = function (roomId) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_API + 'estancias/getEstancia?estancia='+roomId,
                contentType: 'application/json',
                dataType: "json"
            };
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log("Error getRoom: ",err);
                        deferred.reject(err);
                    }
                );
            });
            return deferred.promise;
        };

        var getAllRooms = function (roomId) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_API + 'estancias/getAllEstancias?estancia='+roomId,
                contentType: 'application/json',
                dataType: "json"
            };
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log("Error getAllRooms: ",err);
                        deferred.reject(err);
                    }
                );
            });
            return deferred.promise;
        };

        var getBuildingCoordinates = function (buildingId) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_API + 'estancias/'+buildingId+'/coordinates',
                contentType: 'application/json',
                dataType: "json"
            };
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        console.log("Success getBuildingCoordinates: ",result.data);
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log("Error getBuildingCoordinates: ",err);
                        deferred.reject(err);
                    }
                );
            });
            return deferred.promise;
        };

        var getRoomCentrePoint = function (roomId) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_API + 'estancias/'+roomId+'/center',
                contentType: 'application/json',
                dataType: "json"
            };
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        console.log("Success getRoomCentrePoint: ",result.data);
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log("Error getRoomCentrePoint: ",err);
                        deferred.reject(err);
                    }
                );
            });
            return deferred.promise;
        };

        var isValidEmailAddress = function(emailAddress) {
            var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
            return pattern.test(emailAddress);
        };

        //Definición de las funciones anteriores para poder ser utilizadas
        return {
            getAllRoomsCodes: getAllRoomsCodes,
            getCityCampus: getCityCampus,
            getCampusBuildings: getCampusBuildings,
            getBuildingInfo:getBuildingInfo,
            getRoomInfo:getRoomInfo,
            getRoom:getRoom,
            getAllRooms:getAllRooms,
            getBuildingCoordinates: getBuildingCoordinates,
            getRoomCentrePoint: getRoomCentrePoint,
            isValidEmailAddress: isValidEmailAddress
        };
    });