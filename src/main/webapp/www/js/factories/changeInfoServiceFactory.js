/**********************************************************************
 * changeInfoService: Servicio que define los datos compartidos por las vistas de cambios
 ***********************************************************************/

UZCampusWebMapApp.factory('changeInfoService', function($state, $q, $window,
    notificationService) {

  var numIntervalos = 0;
  var intervalo = false;
  var cargaInicial = false;

  var estado = '';
  var estados = ['Pendiente del usuario', 'Pendiente', 'Aprobado', 'Rechazado'];
  var dimensions;
  var cambios = {};
  var cambiosNuevos = {
    'Pendiente del usuario': [],
    'Pendiente': [],
    'Aprobado': [],
    'Rechazado': []
  };
  var numCambiosNuevos = {
    'Pendiente del usuario' : 0,
    'Pendiente': 0,
    'Aprobado': 0,
    'Rechazado': 0
  };

  var loadCambiosNuevos = function() {
    return initCambios()
      .then(function() {

      // console.log("cargando nuevos cambios");

      // Actualiza el numero de cambios en cada estado
      setNumCambiosNuevos();

      // Actualiza los cambios de un estado si este no esta siendo visualizado
      loadCambiosEstado();
    });
  };

  var getEstado = function() {
    return estado;
  };
  var setEstado = function(nuevoEstado){
    estado = nuevoEstado;
  };

  var getCambios = function() {
    return cambios;
  };
  var setCambios = function(nuevosCambios){
    cambios = nuevosCambios;
  };

  var getCambiosNuevos = function() {
    return cambiosNuevos;
  };

  var setNumCambiosNuevos = function() {
    // console.log("actualizando el numero de cambios");
    numCambiosNuevos['Pendiente del usuario'] = cambiosNuevos['Pendiente del usuario'].length;
    numCambiosNuevos.Pendiente = cambiosNuevos.Pendiente.length;
    numCambiosNuevos.Aprobado = cambiosNuevos.Aprobado.length;
    numCambiosNuevos.Rechazado = cambiosNuevos.Rechazado.length;
  };

  var setNumCambiosNuevosEstado = function(estado, numCambios) {
    numCambiosNuevos[estado] = numCambios;
  };

  var getNumCambiosNuevos = function(estado) {
    return numCambiosNuevos[estado];
  };

  var loadCambiosEstado = function() {
    var vista = $state.current.name;

    if (vista.match('^app.changes')) {
      angular.forEach(estados, function(value, key) {
        var nombreEstado = value;

        if (estado != nombreEstado || estado != 'Pendiente del usuario') {
          cambios[nombreEstado] = angular.copy(cambiosNuevos[nombreEstado]);
        }
      });
    }
    else {

      // Carga todos los cambios nuevos porque el usuario esta en otra
      // pantalla distinta
      console.log("Carga todos los cambios");
      cambios = angular.copy(cambiosNuevos);
    }
  };

  //Calculates image dimensions based on device dimensions
  var calculateDimensions = function() {
      return {
          "width": $window.innerWidth,
          "height": $window.innerHeight/2
      };
  };

  var resizeImage = function(width, height) {
      var maxWidth = dimensions.width,
          maxHeight = dimensions.height,
          ratio = Math.min(maxWidth / width, maxHeight / height);

      return {
          width: width*ratio,
          height: height*ratio
      };
  };

  var initCambios = function() {
    dimensions = calculateDimensions();
    cambiosNuevos = {
      'Pendiente del usuario': [],
      'Pendiente': [],
      'Aprobado': [],
      'Rechazado': []
    };

    // Returns the promise when all changes are retrieved
    return notificationService.getMisCambios()
      .then(function(data) {

        var promises = [];

        // Fills the data structure with notifications info
        angular.forEach(data, function(value, key){

          // If a day or month are lower than 10, then it adds a '0'
          // first so it looks better
          var day = value.fecha.date.day < 10 ?
                        '0' + value.fecha.date.day :
                        value.fecha.date.day;
          var month = value.fecha.date.month < 10 ?
                        '0' + value.fecha.date.month :
                        value.fecha.date.month;
          var fecha = day + '-' + month + '-' + value.fecha.date.year;

          // Last update date and time
          var lastDay = value.fechaUltimaModificacion.date.day < 10 ?
                        '0' + value.fechaUltimaModificacion.date.day :
                        value.fechaUltimaModificacion.date.day;
          var lastMonth = value.fechaUltimaModificacion.date.month < 10 ?
                        '0' + value.fechaUltimaModificacion.date.month :
                        value.fechaUltimaModificacion.date.month;
          var lastHour = value.fechaUltimaModificacion.time.hour < 10 ?
                        '0' + value.fechaUltimaModificacion.time.hour :
                        value.fechaUltimaModificacion.time.hour;
          var lastMin = value.fechaUltimaModificacion.time.minute < 10 ?
                        '0' + value.fechaUltimaModificacion.time.minute :
                        value.fechaUltimaModificacion.time.minute;
          var lastSecond = value.fechaUltimaModificacion.time.second < 10 ?
                        '0' + value.fechaUltimaModificacion.time.second :
                        value.fechaUltimaModificacion.time.second;

          var lastFecha = lastDay + '-' + lastMonth + '-' + value.fechaUltimaModificacion.date.year +
                          ', ' + lastHour + ':' + lastMin;
          var lastFechaComp = value.fechaUltimaModificacion.date.year + '-' + lastMonth + '-' + lastDay +
                          ', ' + lastHour + ':' + lastMin + ':' + lastSecond;

          var city = value.ciudad.charAt(0) + value.ciudad.substring(1,value.ciudad.length).toLowerCase();
          var buildingParts = value.edificio.split(" ");
          var building = "";
          angular.forEach(buildingParts, function(value, key) {
            var part = value;
            building += part.charAt(0) + part.substring(1,part.length).toLowerCase();
            if (key < buildingParts.length - 1) building += " ";
          });
          var floor = value.planta < 10 ? value.planta.charAt(1) : value.planta;

          var cambio = {
            'id': value.id_notificacion,
            'tipo': value.tipo_notificacion,
            'espacio': value.espacio,
            'fecha': fecha,
            'fechaUltimaModificacion': lastFecha,
            'fechaUltimaModificacionComp': lastFechaComp,
            'descripcion': value.descripcion,
            'ngDescripcion': value.descripcion,
            'oldDescripcion': value.descripcion,
            'estado': value.estado,
            'foto': value.foto,
            'comentario_admin': value.comentario_admin,
            'ciudad': city,
            'campus': value.campus,
            'edificio': building,
            'planta': floor
          };

          // Carga la imagen del cambio seleccionado
          promises.push(notificationService.getCambioImage(cambio)
            .then(function(data) {

              var tempImage = new Image();
              tempImage.src = 'data:image/jpg;base64,' + data;

              // Guarda el cambio con la imagen asociada
              var dim = resizeImage(tempImage.width, tempImage.height);

              cambiosNuevos[cambio.estado].push(
                {
                  'cambio': cambio,
                  'imagen': {
                    src: tempImage.src,
                    width: dim.width,
                    height: dim.height
                  },
                  'oldImagen': {
                    src: tempImage.src,
                    width: dim.width,
                    height: dim.height
                  }
                }
              );
          }));
        });
        return $q.all(promises);
      });
    };

  var addIntervalo = function() {
    numIntervalos = numIntervalos + 1;
  };

  var getNumIntervalos = function() {
    return numIntervalos;
  };

  var setIntervalo = function() {
    intervalo = true;
  };

  var isIntervaloSet = function() {
    return intervalo;
  };

  var setCargaInicial = function() {
    cargaInicial = true;
  };

  var isCargaInicialSet = function() {
    return cargaInicial;
  };

  return {
    getEstado: getEstado,
    setEstado: setEstado,
    getCambios: getCambios,
    setCambios: setCambios,
    getCambiosNuevos: getCambiosNuevos,
    setNumCambiosNuevosEstado: setNumCambiosNuevosEstado,
    getNumCambiosNuevos: getNumCambiosNuevos,
    loadCambiosNuevos: loadCambiosNuevos,
    setIntervalo: setIntervalo,
    isIntervaloSet: isIntervaloSet,
    setCargaInicial: setCargaInicial,
    isCargaInicialSet: isCargaInicialSet
  };
});
