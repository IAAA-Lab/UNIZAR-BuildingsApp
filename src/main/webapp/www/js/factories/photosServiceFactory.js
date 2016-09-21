/**********************************************************************
 * infoService: Servicio que define todas las llamadas al web service para recoger los datos
 ***********************************************************************/

UZCampusWebMapApp.factory('photosService', function($http, $q, $timeout, $state, $rootScope, APP_CONSTANTS) {

        var count = function (roomId) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_API + 'photos/approved/'+roomId+'/',
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
                        console.log("Error count photos: ",err);
                        deferred.reject(err);
                    }
                );
            });
            return deferred.promise;
        };

        //Definición de las funciones anteriores para poder ser utilizadas
        return {
            count: count
        };
    });