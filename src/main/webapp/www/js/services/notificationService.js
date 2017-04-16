UZCampusWebMapApp.service('notificationService', function(
    $http, $q, $ionicLoading, $cordovaCamera, $window, APP_CONSTANTS){

  this.createNotification = function(data) {
    var deferred = $q.defer();

    console.log("creando notificacion");

    // Elige el tipo de notificacion a enviar
    var tipoNotificacion = "";
    if (data.type == 1) tipoNotificacion = "cambio";
    else if (data.type == 2) tipoNotificacion = "incidencia";

    // Construye la notificacion a enviar
    var notificacion = {
      "id_espacio": data.roomId,
      "descripcion": data.comments,
      "estado": "Pendiente",
      "email_usuario": data.email || undefined
    };

    $http({
      method: 'POST',
      url: APP_CONSTANTS.URI_API + 'notificacion/' + tipoNotificacion,
      data: notificacion
    }).success(function(res) {
        deferred.resolve(res);
    }).
    error(function(err) {
        console.log("Error while creating notification");
        deferred.reject(err);
    });
    return deferred.promise;
  };

  this.updateNotification = function(data) {
    var deferred = $q.defer();

    console.log("actualizando notificacion");

    // Elige el tipo de notificacion a enviar
    var tipoNotificacion = "";
    if (data.tipo == 1) tipoNotificacion = "cambio";
    else if (data.tipo == 2) tipoNotificacion = "incidencia";

    // Construye la notifiacion a enviar
    var notificacion = {
      "descripcion": data.descripcion,
      "estado": "Pendiente",
      "foto": data.foto
    };

    $http({
      method: 'PUT',
      url: APP_CONSTANTS.URI_API + 'notificacion/' + tipoNotificacion + '/' + data.id,
      data: notificacion
    }).success(function(res) {
        deferred.resolve(res);
    }).
    error(function(err) {
        console.log("Error while updating notification");
        deferred.reject(err);
    });
    return deferred.promise;
  };

  this.getMisCambios = function() {
    var deferred = $q.defer();
    console.log("obteniendo mis cambios");

    $http({
      method: 'GET',
      url: APP_CONSTANTS.URI_API + 'notificacion/cambio/user'
    }).success(function(res) {
        deferred.resolve(res);
    }).
    error(function(err) {
        console.log("Error while obtaining user changes");
        deferred.reject(err);
    });
    return deferred.promise;
  };

  this.getCambioImage = function(cambio) {
    var deferred = $q.defer();
    console.log("obteniendo una imagen");

    $http({
      method: 'GET',
      url: APP_CONSTANTS.URI_API + 'notificacion/imagen/' + cambio.foto
    })
      .success(function(res) {
        deferred.resolve(res);
    }).
    error(function(err) {
        console.log("Error while obtaining an image");
        deferred.reject(err);
    });
    return deferred.promise;
  };

  

});
