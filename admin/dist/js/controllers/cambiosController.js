$(function() {
    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            // if (typeof Cookies.get('session-admin-cookie') == 'undefined'){
            //     $('body').mask('Loading...');
            //     window.location.href = 'login.html';
            // }
            checkToken();
        }
    };

    $('#admin-cambios-error').hide();
    $('#admin-cambios-success').hide();

    var buildingsArray = [],
        campusArray = [],
        selectedBuilding = null;

    $(document).ready( function () {

        var getCityId = function(city){
            var cityId = '',
                cityName = city[0] + city.toLowerCase().substr(1);
            getConstants('cities').forEach(function(city){ if (city.value==cityName) { cityId = city.id;}});
            return cityId;
        };

        var getCampusId = function(campusValues, campusName){
            var campusId = '';
            campusValues.forEach(function(campus){ if (campus.campus==campusName) { campusId = campus.ID;}});
            return campusId;
        };

        var searchCampus = function(mode, reload, city, row_data, callback){
            var cityId = reload ? getCityId(city) : getCityId(row_data.ciudad);
            getCampus(
                cityId,
                function(data){
                    campusArray = data;
                    selCampus = $('#'+mode+'-cambio-campus');
                    selCampus.empty();
                    data.forEach(function(campus){
                        selCampus.append('<option value="' + campus.ID + '">' + campus.campus + '</option>');
                    });
                    if (reload) selCampus.val(data[0].ID).change();
                    else searchBuildings(mode, reload, null, row_data, data, callback);
                },
                function(jqXHR, textStatus, errorThrown){
                    $('body').unmask();
                    $('#admin-cambios-error-text').text(jqXHR.responseText);
                    $('#admin-cambios-error').show();
                    setTimeout(function(){
                        if ($('#admin-cambios-error').is(':visible'))
                            $('#admin-cambios-error').hide();
                    }, 30000);
                });
        };

        var searchBuildings = function(mode, reload, campus, row_data, campusValues, callback){
            var campusId = reload ? campus : getCampusId(campusValues,row_data.campus);
            getBuildings(
                campusId,
                function(data){
                    selBuilding = $('#'+mode+'-cambio-edificio');
                    selBuilding.empty();
                    data.forEach(function(building){
                        selBuilding.append('<option value="' + building.edificio + '">' + building.edificio + '</option>');
                    });
                    buildingsArray = data;
                    if (reload) selBuilding.val(data[0].edificio).change();
                    else searchFloors(mode, reload, null, row_data, callback);
                },
                function(jqXHR, textStatus, errorThrown){
                    $('body').unmask();
                    $('#admin-cambios-error-text').text(jqXHR.responseText);
                    $('#admin-cambios-error').show();
                    setTimeout(function(){
                        if ($('#admin-cambios-error').is(':visible'))
                            $('#admin-cambios-error').hide();
                    }, 30000);
                });
        };

        var searchFloors = function(mode, reload, building, row_data, callback){
            var floors = null,
                buildingId = null,
                buildingSelected = reload ? building : row_data.edificio;

            buildingsArray.forEach(function(building){
                if (building.edificio == buildingSelected) {
                    floors = building.plantas;
                    buildingId = building.ID_Edificio;
                }
            });

            if (!buildingId) callback('Error: No se ha encontrado información sobre el edificio');
            else {
                selectedBuilding = buildingId;
                selFloor = $('#'+mode+'-cambio-planta');
                selFloor.empty();
                floors.forEach(function(floor){
                    selFloor.append('<option value="' + floor + '">' + floor + '</option>');
                });

                if (reload) selFloor.val(floors[0]).change();
                else searchRooms(mode, reload, row_data, null, buildingId, callback);
            }
        };

        var searchRooms = function(mode, reload, row_data, floorId, buildingId, callback){
            var room = reload ? buildingId + floorId : buildingId + row_data.planta;
            getRooms(
                room,
                function(data){
                    selRoom = $('#'+mode+'-cambio-espacio');
                    selRoom.empty();
                    data.forEach(function(room){
                        room = room.ID_centro +' ('+ room.ID_espacio + ')';
                        selRoom.append('<option value="' + room + '">' + room + '</option>');
                    });
                    $('body').unmask();
                    if (mode !== 'reload') fillModal(mode, reload, row_data, callback);
                },
                function(jqXHR, textStatus, errorThrown){
                    $('body').unmask();
                    $('#admin-cambios-error-text').text(jqXHR.responseText);
                    $('#admin-cambios-error').show();
                    setTimeout(function(){
                        if ($('#admin-cambios-error').is(':visible'))
                            $('#admin-cambios-error').hide();
                    }, 30000);
                });
        };

        var fillModal = function(mode, reload, cambioData, callback){

            console.log("Filling modal");

            var selCity = $('#'+mode+'-cambio-ciudad'),
                selCampus = $('#'+mode+'-cambio-campus'),
                selStatus = $('#'+mode+'-cambio-estado');

            if (mode === 'edit' && !reload) {

                $('#'+mode+'-cambio-modal-title').text('');
                $('#'+mode+'-cambio-modal-title').text('Revisar datos del cambio - ID: ' + cambioData.id_notificacion);

                selCity.empty();
                getConstants('cities').forEach(function(city){
                    selCity.append('<option value="' + city.value + '">' + city.label + '</option>');
                });
                selStatus.empty();
                getConstants('cambio_status').forEach(function(status){
                    selStatus.append('<option value="' + status.value + '">' + status.label + '</option>');
                });
            } else if (mode === 'delete' && !reload) {
                $('#'+mode+'-cambio-modal-title').text('');
                $('#'+mode+'-cambio-modal-title').text('Eliminar cambio - ID: ' + cambioData.id_notificacion);
            }

            //Load data into selects fields
            if (!reload) {
                for (var key in cambioData) {
                    if ($('#'+mode+'-cambio-'+key).length > 0){

                        if (key == 'espacio') {
                            $('#'+mode+'-cambio-'+key).val(cambioData.espacio + ' ('+cambioData.id_espacio+')');
                        }
                        else if (key == 'campus'){
                            var campus = null;
                            campusArray.forEach(function(c){
                                if (c.campus === cambioData.campus) {
                                    campus = (mode === 'edit') ? c.ID : c.campus;
                                }
                            });
                            selCampus.val(campus);
                        }
                        else if (key == 'ciudad') {
                            selCity.val(cambioData.ciudad[0] + cambioData.ciudad.substr(1).toLowerCase());
                        }
                        else {
                          $('#'+mode+'-cambio-'+key).val(cambioData[key]);
                        }
                    }
                }
            }

            if (callback !== null) callback();
        };

        var selCity = $('#edit-cambio-ciudad'),
            selCampus = $('#edit-cambio-campus'),
            selBuilding = $('#edit-cambio-edificio'),
            selFloor = $('#edit-cambio-planta'),
            selStatus = $('#edit-cambio-estado');

        var loadMask = function() { $('body').mask('Cargando...'); };
        var unloadMask = function(err) {
            if (err) {
                $('#admin-cambios-error-text').text(err);
                $('#admin-cambios-error').show();
                setTimeout(function(){
                    if ($('#admin-cambios-error').is(':visible'))
                        $('#admin-cambios-error').hide();
                }, 30000);
            }
            $('body').unmask();
        };

        selCity.change(function(){
            loadMask();
            searchCampus('edit', true, selCity.val(), null, unloadMask);
        });
        selCampus.change(function(){
            loadMask();
            searchBuildings('edit', true, selCampus.val(), null, unloadMask);
        });
        selBuilding.change(function(){
            loadMask();
            searchFloors('edit', true, selBuilding.val(), null, unloadMask);
        });
        selFloor.change(function(){
            loadMask();
            searchRooms('edit', true, null, selFloor.val(), selectedBuilding, null, unloadMask);
        });
        selStatus.change(function(){
            if (selStatus.val() === 'Rejected') $('#edit-cambio-reason-form-group').show();
            else $('#edit-cambio-reason-form-group').hide();
        });

        //Define table configuration
        var cambiosTable = $('#dataTable-cambios').DataTable({
            ajax: {
                url: getConstants('API_URL') + '/notificacion/cambio',
                dataSrc: ''
            },
            language: getTranslation('editor'),
            dom: 'Bfrtip',
            responsive: true,
            scrollX: true,
            paging: true,
            select: {
                style: 'single'
            },
            sort: true,
            lengthMenu: [
                [10,25,50],
                ['10','25','50']
            ],
            buttons: [
                'pageLength',
                {
                    text: 'Refresh',
                    action: function ( e, dt, node, config ) {
                        $('#dataTable-cambios').DataTable().ajax.reload();
                    }
                },
                {
                    text: 'Ver foto',
                    action: function ( e, dt, node, config ) {
                        if ($('#dataTable-cambios').DataTable().rows({ selected: true })[0].length == 1) {
                            var cambioData = $('#dataTable-cambios').DataTable().rows({ selected: true }).data()[0];

                            // Obtiene la imagen asociada a ese cambio si es que existe
                            if (cambioData.foto !== undefined) {

                              getFoto(cambioData.foto,
                                function(imageData) {
                                  // var imagePath = getConstants('PHOTOS_BASE_URL') + cambioData.name;
                                  var tempImage = new Image();
                                  tempImage.src = 'data:image/jpg;base64,' + imageData;
                                  tempImage.onload = function() {
                                      console.log('tempImage ', tempImage.width, tempImage.height);
                                      var resizedImage = resizeImage(tempImage.width, tempImage.height);
                                      console.log('resizedImage', resizedImage);
                                      $('#image-preview-modal').modal('show');
                                      $('#image-preview').css('width', resizedImage.width);
                                      $('#image-preview').css('height',resizedImage.height);
                                      $('#image-preview').attr('src', tempImage.src);
                                  };
                                },
                                function(jqXHR, textStatus, errorThrown){
                                    $('body').unmask();
                                    // $('#edit-cambio-modal .close').click();
                                    $('#admin-cambios-error-text').text('Error obteniendo la imagen del cambio: ' + jqXHR.responseText);
                                    $('#admin-cambios-error').show();
                                    setTimeout(function(){
                                        if ($('#admin-cambios-error').is(':visible'))
                                            $('#admin-cambios-error').hide();
                                    }, 30000);
                                });
                              }
                        }
                    }
                },
                {
                    text: 'Revisar',
                    action: function ( e, dt, node, config ) {
                        if ($('#dataTable-cambios').DataTable().rows({ selected: true })[0].length == 1) {
                            $('body').mask('Cargando...');
                            var cambioData = $('#dataTable-cambios').DataTable().rows({ selected: true }).data()[0];
                            searchCampus('edit', null, null, cambioData, function(){
                                $('#edit-cambio-modal').modal({
                                    keyboard: true,
                                    backdrop: 'static',
                                    show:true,
                                });

                                $('body').unmask();
                            });
                        }
                    }
                },
                {
                    text: 'Eliminar',
                    action: function ( e, dt, node, config ) {
                        if ($('#dataTable-cambios').DataTable().rows({ selected: true })[0].length == 1) {
                            $('body').mask('Cargando...');
                            var cambioData = $('#dataTable-cambios').DataTable().rows({ selected: true }).data()[0];
                            searchCampus('delete', null, null, cambioData, function(){
                                $('#delete-cambio-modal').modal({
                                    keyboard: true,
                                    backdrop: 'static',
                                    show:true,
                                });

                                $('body').unmask();
                            });
                        }
                    }
                }
            ],
            columns: [
                { data: 'id_notificacion' },
                { data: 'estado', defaultContent: '' },
                { data: 'descripcion', defaultContent: '' },
                { data: 'fecha', defaultContent: 'No disponible', render: function(data, type, full, meta){
                    var month = data.date.month < 10 ? '0' + data.date.month : data.date.month,
                        day = data.date.day < 10 ? '0' + data.date.day : data.date.day,
                        hour = data.time.hour < 10 ? '0' + data.time.hour : data.time.hour,
                        minute = data.time.minute < 10 ? '0' + data.time.minute : data.time.minute,
                        second = data.time.second < 10 ? '0' + data.time.second : data.time.second,
                        date = [data.date.year,month,day].join('-'),
                        time = [hour,minute,second].join(':');
                    return date + ' ' + time;
                }},
                { data: 'foto' , defaultContent: 'No disponible'},
                { data: 'ciudad' , defaultContent: 'No disponible', render: function(data, type, full, meta){
                    if (data !== undefined) {
                      return data[0] + data.toLowerCase().substr(1);
                    }
                }},
                { data: 'campus', defaultContent: 'No disponible' },
                { data: 'edificio', defaultContent: 'No disponible' },
                { data: 'planta', type: 'num', defaultContent: 'No disponible' },
                { data: 'espacio', defaultContent: 'No disponible' },
                { data: 'id_espacio', defaultContent: '' },
                { data: 'direccion', defaultContent: 'No disponible' }
            ]
        });
    });

    //Define action on click Save button for modify cambio data
    $('#edit-cambio-btn').click(function(){
        $('body').mask('Enviando...');

        var originalCambioData = $('#dataTable-cambios').DataTable().rows({ selected: true }).data()[0],
            sendData = {};

        //Fill data to send
        for (var key in originalCambioData) {
            if ($('#edit-cambio-'+key).length > 0){
                sendData[key] = $('#edit-cambio-'+key).val();
            }else
                sendData[key] = originalCambioData[key];
        }

        // Adds the commentary of the admin if there is one
        if ($('#edit-cambio-comentario_admin').val().length > 0) {
          sendData.comentario_admin = $('#edit-cambio-comentario_admin').val();
        }

        updateCambio(
            sendData,
            function(data){
                $('#dataTable-cambios').DataTable().ajax.reload();
                $('#edit-cambio-modal .close').click();
                $('#admin-cambios-success-text').text('Información del cambio actualizada correctamente');
                $('#admin-cambios-success').show();
                $('body').unmask();
            },
            function(jqXHR, textStatus, errorThrown){
                $('body').unmask();
                $('#edit-cambio-modal .close').click();
                $('#admin-cambios-error-text').text('Error editando la información del cambio: ' + jqXHR.responseText);
                $('#admin-cambios-error').show();
                setTimeout(function(){
                    if ($('#admin-cambios-error').is(':visible'))
                        $('#admin-cambios-error').hide();
                }, 30000);
            });
    });

    //Define action on click 'Eliminar' button for delete a cambio
    $('#delete-cambio-btn').click(function(){
        $('body').mask('Enviando...');

        var cambioData = $('#dataTable-cambios').DataTable().rows({ selected: true }).data()[0];

        deleteCambio(
            cambioData.id_notificacion,
            function(data){
                $('#dataTable-cambios').DataTable().ajax.reload();
                $('#delete-cambio-modal .close').click();
                $('#admin-cambios-success-text').text('Cambio eliminado con éxito');
                $('#admin-cambios-success').show();
                $('body').unmask();
            },
            function(jqXHR, textStatus, errorThrown){
                $('body').unmask();
                $('#delete-cambio-modal .close').click();
                $('#admin-cambios-error-text').text('Error eliminando el cambio: ' + jqXHR.responseText);
                $('#admin-cambios-error').show();
                setTimeout(function(){
                    if ($('#admin-cambios-error').is(':visible'))
                        $('#admin-cambios-error').hide();
                }, 30000);
            });
    });

    var resizeImage = function(width, height) {
        var maxWidth = getConstants('preview_sizes').maxWidth,
            maxHeight = getConstants('preview_sizes').maxHeight,
            ratio = Math.min(maxWidth / width, maxHeight / height);

        return {
            width: width*ratio,
            height: height*ratio
        };
    };

    $('#preview-edit-cambio-photo-btn').on('click', function() {
      var cambioData = $('#dataTable-cambios').DataTable().rows({ selected: true }).data()[0];

      // Obtiene la imagen asociada a ese cambio si es que existe
      if (cambioData.foto !== undefined) {

        getFoto(cambioData.foto,
          function(imageData) {
            // var imagePath = getConstants('PHOTOS_BASE_URL') + cambioData.name;
            var tempImage = new Image();
            tempImage.src = 'data:image/jpg;base64,' + imageData;
            tempImage.onload = function() {
                console.log('tempImage ', tempImage.width, tempImage.height);
                var resizedImage = resizeImage(tempImage.width, tempImage.height);
                console.log('resizedImage', resizedImage);
                $('#image-preview-modal').modal('show');
                $('#image-preview').css('width', resizedImage.width);
                $('#image-preview').css('height',resizedImage.height);
                $('#image-preview').attr('src', tempImage.src);
            };
          },
          function(jqXHR, textStatus, errorThrown){
              $('body').unmask();
              $('#admin-cambios-error-text').text('Error obteniendo la imagen del cambio: ' + jqXHR.responseText);
              $('#admin-cambios-error').show();
              setTimeout(function(){
                  if ($('#admin-cambios-error').is(':visible'))
                      $('#admin-cambios-error').hide();
              }, 30000);
          });
        }
    });

    $('#preview-delete-cambio-photo-btn').on('click', function() {
      var cambioData = $('#dataTable-cambios').DataTable().rows({ selected: true }).data()[0];

      // Obtiene la imagen asociada a ese cambio si es que existe
      if (cambioData.foto !== undefined) {

        getFoto(cambioData.foto,
          function(imageData) {
            // var imagePath = getConstants('PHOTOS_BASE_URL') + cambioData.name;
            var tempImage = new Image();
            tempImage.src = 'data:image/jpg;base64,' + imageData;
            tempImage.onload = function() {
                console.log('tempImage ', tempImage.width, tempImage.height);
                var resizedImage = resizeImage(tempImage.width, tempImage.height);
                console.log('resizedImage', resizedImage);
                $('#image-preview-modal').modal('show');
                $('#image-preview').css('width', resizedImage.width);
                $('#image-preview').css('height',resizedImage.height);
                $('#image-preview').attr('src', tempImage.src);
            };
          },
          function(jqXHR, textStatus, errorThrown){
              $('body').unmask();
              $('#admin-cambios-error-text').text('Error obteniendo la imagen del cambio: ' + jqXHR.responseText);
              $('#admin-cambios-error').show();
              setTimeout(function(){
                  if ($('#admin-cambios-error').is(':visible'))
                      $('#admin-cambios-error').hide();
              }, 30000);
          });
        }
    });
});
