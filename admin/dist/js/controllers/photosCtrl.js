$(function() {
    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            if (typeof Cookies.get('session-admin-cookie') == 'undefined'){
                $('body').mask('Loading...');
                window.location.href = 'login.html';
            }
        }
    };

    $('#admin-photos-error').hide();
    $('#admin-photos-success').hide();

    var buildingsArray = [],
        campusArray = [],
        selectedBuilding = null;

    $(document).ready( function () {

        var getCityId = function(city){
            var cityId = '',
                cityName = city[0] + city.toLowerCase().substr(1);
            getConstants('cities').forEach(function(city){ if (city.value==cityName) { cityId = city.id;}});
            return cityId;
        }

        var getCampusId = function(campusValues, campusName){
            var campusId = '';
            campusValues.forEach(function(campus){ if (campus.campus==campusName) { campusId = campus.ID;}});
            return campusId;
        }

        var searchCampus = function(mode, reload, city, row_data, callback){
            var cityId = reload ? getCityId(city) : getCityId(row_data.city);
            getCampus(
                cityId,
                function(data){
                    campusArray = data;
                    selCampus = $('#'+mode+'-photo-campus');
                    selCampus.empty();
                    data.forEach(function(campus){
                        selCampus.append('<option value="' + campus.ID + '">' + campus.campus + '</option>');
                    });
                    if (reload) selCampus.val(data[0].ID).change();
                    else searchBuildings(mode, reload, null, row_data, data, callback);
                },
                function(jqXHR, textStatus, errorThrown){
                    $('body').unmask();
                    $('#admin-photos-error-text').text(jqXHR.responseText);
                    $('#admin-photos-error').show();
                    setTimeout(function(){
                        if ($('#admin-photos-error').is(':visible'))
                            $('#admin-photos-error').hide();
                    }, 30000);
                });
        };

        var searchBuildings = function(mode, reload, campus, row_data, campusValues, callback){
            var campusId = reload ? campus : getCampusId(campusValues,row_data.campus);
            getBuildings(
                campusId,
                function(data){
                    selBuilding = $('#'+mode+'-photo-building');
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
                    $('#admin-photos-error-text').text(jqXHR.responseText);
                    $('#admin-photos-error').show();
                    setTimeout(function(){
                        if ($('#admin-photos-error').is(':visible'))
                            $('#admin-photos-error').hide();
                    }, 30000);
                });
        };

        var searchFloors = function(mode, reload, building, row_data, callback){
            var floors = null,
                buildingId = null,
                buildingSelected = reload ? building : row_data.building;

            buildingsArray.forEach(function(building){
                if (building.edificio == buildingSelected) {
                    floors = building.plantas;
                    buildingId = building.ID_Edificio;
                }
            });

            if (!buildingId) callback('Error: No se ha encontrado información sobre el edificio');
            else {
                selectedBuilding = buildingId;
                selFloor = $('#'+mode+'-photo-floor');
                selFloor.empty();
                floors.forEach(function(floor){
                    selFloor.append('<option value="' + floor + '">' + floor + '</option>');
                });

                if (reload) selFloor.val(floors[0]).change();
                else searchRooms(mode, reload, row_data, null, buildingId, callback);
            }
        }

        var searchRooms = function(mode, reload, row_data, floorId, buildingId, callback){
            var room = reload ? buildingId + floorId : buildingId + row_data.floor;
            getRooms(
                room,
                function(data){
                    selRoom = $('#'+mode+'-photo-roomName');
                    selRoom.empty();
                    data.forEach(function(room){
                        var room = room.ID_centro +' ('+ room.ID_espacio + ')';
                        selRoom.append('<option value="' + room + '">' + room + '</option>');
                    });
                    $('body').unmask();
                    if (mode !== 'reload') fillModal(mode, reload, row_data, callback);
                },
                function(jqXHR, textStatus, errorThrown){
                    $('body').unmask();
                    $('#admin-photos-error-text').text(jqXHR.responseText);
                    $('#admin-photos-error').show();
                    setTimeout(function(){
                        if ($('#admin-photos-error').is(':visible'))
                            $('#admin-photos-error').hide();
                    }, 30000);
                });
        };

        var fillModal = function(mode, reload, photoData, callback){
            
            var selCity = $('#'+mode+'-photo-city'),
                selCampus = $('#'+mode+'-photo-campus'),
                selStatus = $('#'+mode+'-photo-status');

            if (mode === 'edit' && !reload) {
                
                $('#'+mode+'-photo-modal-title').text('');
                $('#'+mode+'-photo-modal-title').text('Editar datos de la imagen - ID: ' + photoData.id);

                selCity.empty();
                getConstants('cities').forEach(function(city){
                    selCity.append('<option value="' + city.value + '">' + city.label + '</option>');
                });
                selStatus.empty();
                getConstants('photo_status').forEach(function(status){
                    selStatus.append('<option value="' + status.value + '">' + status.label + '</option>');
                });
            } else if (mode === 'delete' && !reload) {
                $('#'+mode+'-photo-modal-title').text('');
                $('#'+mode+'-photo-modal-title').text('Eliminar imagen - ID: ' + photoData.id);
            }

            //Load data into selects fields
            if (!reload) {
                for (var key in photoData) {
                    if ($('#'+mode+'-photo-'+key).length > 0){
                        if (key == 'roomName') {
                            $('#'+mode+'-photo-'+key).val(photoData['roomName'] + ' ('+photoData['roomId']+')');
                        }
                        else if (key == 'campus'){
                            var campus = null;
                            campusArray.forEach(function(c){
                                if (c.campus === poiData.campus) {
                                    campus = (mode === 'edit') ? c.ID : c.campus;
                                }
                            });
                            selCampus.val(campus);
                        }
                        else if (key == 'city') {
                            selCity.val(photoData.city[0] + photoData.city.substr(1).toLowerCase());
                        }
                        else {
                            $('#'+mode+'-photo-'+key).val(photoData[key]);
                        }
                    }
                }
            }

            if (callback != null) callback();
        }

        var selCity = $('#edit-photo-city'),
            selCampus = $('#edit-photo-campus'),
            selBuilding = $('#edit-photo-building'),
            selFloor = $('#edit-photo-floor'),
            selStatus = $('#edit-photo-status');

        var loadMask = function() { $('body').mask('Cargando...'); };
        var unloadMask = function(err) {
            if (err) {
                $('#admin-photos-error-text').text(err);
                $('#admin-photos-error').show();
                setTimeout(function(){
                    if ($('#admin-photos-error').is(':visible'))
                        $('#admin-photos-error').hide();
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
            if (selStatus.val() === 'Rejected') $('#edit-photo-reason-form-group').show();
            else $('#edit-photo-reason-form-group').hide();
        });

        //Define table configuration
        var photosTable = $('#dataTable-photos').DataTable({
            ajax: {
                url: getConstants('API_URL') + '/photos/',
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
                        $('#dataTable-photos').DataTable().ajax.reload();
                    }
                },
                {
                    text: 'Ver foto',
                    action: function ( e, dt, node, config ) {
                        if ($('#dataTable-photos').DataTable().rows({ selected: true })[0].length == 1) {
                            var photoData = $('#dataTable-photos').DataTable().rows({ selected: true }).data()[0];
                            var imagePath = getConstants('PHOTOS_BASE_URL') + photoData.name;
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
                            }
                        }
                    }
                },
                {
                    text: 'Editar',
                    action: function ( e, dt, node, config ) {
                        if ($('#dataTable-photos').DataTable().rows({ selected: true })[0].length == 1) {
                            $('body').mask('Cargando...');
                            var photoData = $('#dataTable-photos').DataTable().rows({ selected: true }).data()[0];
                            searchCampus('edit', null, null, photoData, function(){
                                $('#edit-photo-modal').modal({
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
                        if ($('#dataTable-photos').DataTable().rows({ selected: true })[0].length == 1) {
                            $('body').mask('Cargando...');
                            var photoData = $('#dataTable-photos').DataTable().rows({ selected: true }).data()[0];
                            searchCampus('delete', null, null, photoData, function(){
                                $('#delete-photo-modal').modal({
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
                { data: 'id' },
                { data: 'status' },
                { data: 'created', defaultContent: '', render: function(data, type, full, meta){
                    var month = data.date.month < 10 ? '0' + data.date.month : data.date.month,
                        day = data.date.day < 10 ? '0' + data.date.day : data.date.day,
                        hour = data.date.hour < 10 ? '0' + data.date.hour : data.date.hour,
                        minute = data.date.minute < 10 ? '0' + data.date.minute : data.date.minute,
                        second = data.date.second < 10 ? '0' + data.date.second : data.date.second,
                        date = [data.date.year,month,day].join('-'),
                        time = [data.time.hour,data.time.minute,data.time.second].join(':');
                    return date + ' ' + time;
                }},
                { data: 'city' , render: function(data, type, full, meta){
                    return data[0] + data.toLowerCase().substr(1);
                }},
                { data: 'campus' },
                { data: 'building' },
                { data: 'floor', type: 'num' },
                { data: 'roomId' },
                { data: 'roomName' },
                { data: 'name', defaultContent: ''},
                { data: 'email', defaultContent: ''},
                { data: 'updated', defaultContent: '', render: function(data, type, full, meta){
                    var month = data.date.month < 10 ? '0' + data.date.month : data.date.month,
                        day = data.date.day < 10 ? '0' + data.date.day : data.date.day,
                        hour = data.date.hour < 10 ? '0' + data.date.hour : data.date.hour,
                        minute = data.date.minute < 10 ? '0' + data.date.minute : data.date.minute,
                        second = data.date.second < 10 ? '0' + data.date.second : data.date.second,
                        date = [data.date.year,month,day].join('-'),
                        time = [data.time.hour,data.time.minute,data.time.second].join(':');
                    return date + ' ' + time;
                }},
                { data: 'reason', defaultContent: '', render: function(data, type, full, meta){
                    if (full.status == 'Rejected') return data;
                    else return '';
                }}
            ]
        });
    });

    //Define action on click Save button for modify photo data
    $('#edit-photo-btn').click(function(){
        $('body').mask('Enviando...');

        var originalPhotoData = $('#dataTable-photos').DataTable().rows({ selected: true }).data()[0],
            sendData = {};

        //Fill data to send
        for (var key in originalPhotoData) {
            if ($('#edit-photo-'+key).length > 0)
                sendData[key] = $('#edit-photo-'+key).val();
            else
                sendData[key] = originalPhotoData[key];
        }

        campusArray.forEach(function(campus){
            if (campus.ID == sendData.campus) sendData.campus = campus.campus;
        });
        sendData.roomName = $('#edit-photo-roomName').val().split('(')[0].trim();
        sendData.roomId = $('#edit-photo-roomName').val().split('(')[1].slice(0,-1);
        sendData.name = sendData.roomId + '_' + sendData.name.split('_')[1];

        if (sendData.status == 'Rejected') sendData.reason = $('#edit-photo-reason').val();

        delete sendData.created;
        delete sendData.updated;

        updatePhoto(
            sendData,
            function(data){
                $('#dataTable-photos').DataTable().ajax.reload();
                $('#edit-photo-modal .close').click();
                $('#admin-photos-success-text').text('Información de la imagen actualizada correctamente');
                $('#admin-photos-success').show();
                $('body').unmask();
            },
            function(jqXHR, textStatus, errorThrown){
                $('body').unmask();
                $('#edit-photo-modal .close').click();
                $('#admin-photos-error-text').text('Error editando la información de la imagen: ' + jqXHR.responseText);
                $('#admin-photos-error').show();
                setTimeout(function(){
                    if ($('#admin-photos-error').is(':visible'))
                        $('#admin-photos-error').hide();
                }, 30000);
            });
    });

    //Define action on click 'Eliminar' button for delete a photo
    $('#delete-photo-btn').click(function(){
        $('body').mask('Enviando...');

        var photoData = $('#dataTable-photos').DataTable().rows({ selected: true }).data()[0];

        deletePhoto(
            photoData.id,
            function(data){
                $('#dataTable-photos').DataTable().ajax.reload();
                $('#delete-photo-modal .close').click();
                $('#admin-photos-success-text').text('Imagen eliminada con éxito');
                $('#admin-photos-success').show();
                $('body').unmask();
            },
            function(jqXHR, textStatus, errorThrown){
                $('body').unmask();
                $('#delete-photo-modal .close').click()
                $('#admin-photos-error-text').text('Error eliminando la imagen: ' + jqXHR.responseText);
                $('#admin-photos-error').show();
                setTimeout(function(){
                    if ($('#admin-photos-error').is(':visible'))
                        $('#admin-photos-error').hide();
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
    }

    $('#preview-edit-photo-btn').on('click', function() {
        var imagePath = getConstants('PHOTOS_BASE_URL') + $('#edit-photo-name').val();
        var tempImage = new Image();
        tempImage.src = imagePath;
        tempImage.onload = function() {
            var resizedImage = resizeImage(tempImage.width, tempImage.height);
            $('#image-preview-modal').modal('show');
            $('#image-preview').css('width', resizedImage.width);
            $('#image-preview').css('height',resizedImage.height);
            $('#image-preview').attr('src', imagePath);
        }
    });

    $('#preview-delete-photo-btn').on('click', function() {
        var imagePath = getConstants('PHOTOS_BASE_URL') + $('#edit-photo-name').val();
        var tempImage = new Image();
        tempImage.src = imagePath;
        tempImage.onload = function() {
            var resizedImage = resizeImage(tempImage.width, tempImage.height);
            $('#image-preview-modal').modal('show');
            $('#image-preview').css('width', resizedImage.width);
            $('#image-preview').css('height',resizedImage.height);
            $('#image-preview').attr('src', imagePath);
        }
    });
});