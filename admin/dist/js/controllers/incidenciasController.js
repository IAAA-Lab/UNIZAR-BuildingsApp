$(function() {
    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            checkToken();
        }
    };

    $('#admin-incidencias-error').hide();
    $('#admin-incidencias-success').hide();

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
                    selCampus = $('#'+mode+'-incidencia-campus');
                    selCampus.empty();
                    data.forEach(function(campus){
                        selCampus.append('<option value="' + campus.ID + '">' + campus.campus + '</option>');
                    });
                    if (reload) selCampus.val(data[0].ID).change();
                    else searchBuildings(mode, reload, null, row_data, data, callback);
                },
                function(jqXHR, textStatus, errorThrown){
                    $('body').unmask();
                    $('#admin-incidencias-error-text').text(jqXHR.responseText);
                    $('#admin-incidencias-error').show();
                    setTimeout(function(){
                        if ($('#admin-incidencias-error').is(':visible'))
                            $('#admin-incidencias-error').hide();
                    }, 30000);
                });
        };

        var searchBuildings = function(mode, reload, campus, row_data, campusValues, callback){
            var campusId = reload ? campus : getCampusId(campusValues,row_data.campus);
            getBuildings(
                campusId,
                function(data){
                    selBuilding = $('#'+mode+'-incidencia-edificio');
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
                    $('#admin-incidencias-error-text').text(jqXHR.responseText);
                    $('#admin-incidencias-error').show();
                    setTimeout(function(){
                        if ($('#admin-incidencias-error').is(':visible'))
                            $('#admin-incidencias-error').hide();
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
                selFloor = $('#'+mode+'-incidencia-planta');
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
                    selRoom = $('#'+mode+'-incidencia-espacio');
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
                    $('#admin-incidencias-error-text').text(jqXHR.responseText);
                    $('#admin-incidencias-error').show();
                    setTimeout(function(){
                        if ($('#admin-incidencias-error').is(':visible'))
                            $('#admin-incidencias-error').hide();
                    }, 30000);
                });
        };

        var fillModal = function(mode, reload, incidenciaData, callback){

            console.log("Filling modal");

            var selCity = $('#'+mode+'-incidencia-ciudad'),
                selCampus = $('#'+mode+'-incidencia-campus'),
                selStatus = $('#'+mode+'-incidencia-estado');

            if (mode === 'edit' && !reload) {

                $('#'+mode+'-incidencia-modal-title').text('');
                $('#'+mode+'-incidencia-modal-title').text('Revisar datos del incidencia - ID: ' + incidenciaData.id_notificacion);

                selCity.empty();
                getConstants('cities').forEach(function(city){
                    selCity.append('<option value="' + city.value + '">' + city.label + '</option>');
                });
                selStatus.empty();
                getConstants('incidencia_status').forEach(function(status){
                    selStatus.append('<option value="' + status.value + '">' + status.label + '</option>');
                });
            } else if (mode === 'delete' && !reload) {
                $('#'+mode+'-incidencia-modal-title').text('');
                $('#'+mode+'-incidencia-modal-title').text('Eliminar incidencia - ID: ' + incidenciaData.id_notificacion);
            }

            //Load data into selects fields
            if (!reload) {
                for (var key in incidenciaData) {
                    if ($('#'+mode+'-incidencia-'+key).length > 0){

                        if (key == 'espacio') {
                            $('#'+mode+'-incidencia-'+key).val(incidenciaData.espacio + ' ('+incidenciaData.id_espacio+')');
                        }
                        else if (key == 'campus'){
                            var campus = null;
                            campusArray.forEach(function(c){
                                if (c.campus === incidenciaData.campus) {
                                    campus = (mode === 'edit') ? c.ID : c.campus;
                                }
                            });
                            selCampus.val(campus);
                        }
                        else if (key == 'ciudad') {
                            selCity.val(incidenciaData.ciudad[0] + incidenciaData.ciudad.substr(1).toLowerCase());
                        }
                        else {
                          $('#'+mode+'-incidencia-'+key).val(incidenciaData[key]);
                        }
                    }
                }
            }

            if (callback !== null) callback();
        };

        var selCity = $('#edit-incidencia-ciudad'),
            selCampus = $('#edit-incidencia-campus'),
            selBuilding = $('#edit-incidencia-edificio'),
            selFloor = $('#edit-incidencia-planta'),
            selStatus = $('#edit-incidencia-estado');

        var loadMask = function() { $('body').mask('Cargando...'); };
        var unloadMask = function(err) {
            if (err) {
                $('#admin-incidencias-error-text').text(err);
                $('#admin-incidencias-error').show();
                setTimeout(function(){
                    if ($('#admin-incidencias-error').is(':visible'))
                        $('#admin-incidencias-error').hide();
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
            if (selStatus.val() === 'Rejected') $('#edit-incidencia-reason-form-group').show();
            else $('#edit-incidencia-reason-form-group').hide();
        });

        //Define table configuration
        var incidenciasTable = $('#dataTable-incidencias').DataTable({
            ajax: {
                url: getConstants('API_URL') + '/notificacion/incidencia',
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
                        $('#dataTable-incidencias').DataTable().ajax.reload();
                    }
                },
                {
                    text: 'Ver foto',
                    action: function ( e, dt, node, config ) {
                        if ($('#dataTable-incidencias').DataTable().rows({ selected: true })[0].length == 1) {
                            var incidenciaData = $('#dataTable-incidencias').DataTable().rows({ selected: true }).data()[0];
                            var imagePath = getConstants('PHOTOS_BASE_URL') + incidenciaData.name;
                            var tempImage = new Image();
                            tempImage.src = imagePath;
                            tempImage.onload = function() {
                                console.log('tempImage ', tempImage.width, tempImage.height);
                                var resizedImage = resizeImage(tempImage.width, tempImage.height);
                                console.log('resizedImage', resizedImage);
                                $('#image-preview-modal').modal('show');
                                $('#image-preview').css('width', resizedImage.width);
                                $('#image-preview').css('height',resizedImage.height);
                                $('#image-preview').attr('src', imagePath);
                            };
                        }
                    }
                },
                {
                    text: 'Revisar',
                    action: function ( e, dt, node, config ) {
                        if ($('#dataTable-incidencias').DataTable().rows({ selected: true })[0].length == 1) {
                            $('body').mask('Cargando...');
                            var incidenciaData = $('#dataTable-incidencias').DataTable().rows({ selected: true }).data()[0];
                            searchCampus('edit', null, null, incidenciaData, function(){
                                $('#edit-incidencia-modal').modal({
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
                        if ($('#dataTable-incidencias').DataTable().rows({ selected: true })[0].length == 1) {
                            $('body').mask('Cargando...');
                            var incidenciaData = $('#dataTable-incidencias').DataTable().rows({ selected: true }).data()[0];
                            searchCampus('delete', null, null, incidenciaData, function(){
                                $('#delete-incidencia-modal').modal({
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
                { data: 'estado', defaultContent: '', render: function(data) {
                  var vistaEstado = data;
                  if (data == 'Aprobado') vistaEstado = 'Aprobada';
                  else if (data == 'Rechazado') vistaEstado = 'Rechazada';
                  return vistaEstado;
                }},
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
                { data: 'direccion', defaultContent: 'No disponible' },
                { data: 'email_usuario', defaultContent: 'Anónimo'}
            ]
        });
    });

    //Define action on click Save button for modify incidencia data
    $('#edit-incidencia-btn').click(function(){
        $('body').mask('Enviando...');

        var originalIncidenciaData = $('#dataTable-incidencias').DataTable().rows({ selected: true }).data()[0],
            sendData = {};

        //Fill data to send
        for (var key in originalIncidenciaData) {
            if ($('#edit-incidencia-'+key).length > 0){
                sendData[key] = $('#edit-incidencia-'+key).val();
            }else
                sendData[key] = originalIncidenciaData[key];
        }

        // Adds the commentary of the admin if there is one
        if ($('#edit-incidencia-comentario_admin').val().length > 0) {
          sendData.comentario_admin = $('#edit-incidencia-comentario_admin').val();
        }

        updateIncidencia(
            sendData,
            function(data){
                $('#dataTable-incidencias').DataTable().ajax.reload();
                $('#edit-incidencia-modal .close').click();
                $('#admin-incidencias-success-text').text('Información de la incidencia actualizada correctamente');
                $('#admin-incidencias-success').show();
                $('body').unmask();

                // Envía un correo al usuario creador de la incidencia para avisarle
                // de su resolucion (si se ha cambiado el estado de la misma)
                if (sendData.estado != originalIncidenciaData.estado &&
                    originalIncidenciaData.email_usuario !== undefined) {
                      
                  sendEmail({
                    "mensaje": sendData.comentario_admin,
                    "destinatario": originalIncidenciaData.email_usuario
                  });
                }
            },
            function(jqXHR, textStatus, errorThrown){
                $('body').unmask();
                $('#edit-incidencia-modal .close').click();
                $('#admin-incidencias-error-text').text('Error editando la información de la incidencia: ' + jqXHR.responseText);
                $('#admin-incidencias-error').show();
                setTimeout(function(){
                    if ($('#admin-incidencias-error').is(':visible'))
                        $('#admin-incidencias-error').hide();
                }, 30000);
            });
    });

    //Define action on click 'Eliminar' button for delete a incidencia
    $('#delete-incidencia-btn').click(function(){
        $('body').mask('Enviando...');

        var incidenciaData = $('#dataTable-incidencias').DataTable().rows({ selected: true }).data()[0];

        deleteIncidencia(
            incidenciaData.id_notificacion,
            function(data){
                $('#dataTable-incidencias').DataTable().ajax.reload();
                $('#delete-incidencia-modal .close').click();
                $('#admin-incidencias-success-text').text('Incidencia eliminada con éxito');
                $('#admin-incidencias-success').show();
                $('body').unmask();
            },
            function(jqXHR, textStatus, errorThrown){
                $('body').unmask();
                $('#delete-incidencia-modal .close').click();
                $('#admin-incidencias-error-text').text('Error eliminando la incidencia: ' + jqXHR.responseText);
                $('#admin-incidencias-error').show();
                setTimeout(function(){
                    if ($('#admin-incidencias-error').is(':visible'))
                        $('#admin-incidencias-error').hide();
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

    $('#preview-edit-incidencia-btn').on('click', function() {
        var imagePath = getConstants('PHOTOS_BASE_URL') + $('#edit-incidencia-name').val();
        var tempImage = new Image();
        tempImage.src = imagePath;
        tempImage.onload = function() {
            var resizedImage = resizeImage(tempImage.width, tempImage.height);
            $('#image-preview-modal').modal('show');
            $('#image-preview').css('width', resizedImage.width);
            $('#image-preview').css('height',resizedImage.height);
            $('#image-preview').attr('src', imagePath);
        };
    });

    $('#preview-delete-incidencia-btn').on('click', function() {
        var imagePath = getConstants('PHOTOS_BASE_URL') + $('#delete-incidencia-name').val();
        var tempImage = new Image();
        tempImage.src = imagePath;
        tempImage.onload = function() {
            var resizedImage = resizeImage(tempImage.width, tempImage.height);
            $('#image-preview-modal').modal('show');
            $('#image-preview').css('width', resizedImage.width);
            $('#image-preview').css('height',resizedImage.height);
            $('#image-preview').attr('src', imagePath);
        };
    });
});
