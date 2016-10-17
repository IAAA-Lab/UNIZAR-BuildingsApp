$(function() {
    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            if (typeof Cookies.get('session-admin-cookie') == 'undefined'){
                $('body').mask('Loading...');
                window.location.href = 'login.html';
            }
        }
    };

    $('#admin-pois-error').hide();
    $('#admin-pois-success').hide();

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
                    selCampus = $('#'+mode+'-poi-campus');
                    selCampus.empty();
                    data.forEach(function(campus){
                        selCampus.append('<option value="' + campus.ID + '">' + campus.campus + '</option>');
                    });
                    if (reload) selCampus.val(data[0].ID).change();
                    else searchBuildings(mode, reload, null, row_data, data, callback);
                },
                function(jqXHR, textStatus, errorThrown){
                    $('body').unmask();
                    $('#admin-pois-error-text').text(jqXHR.responseText);
                    $('#admin-pois-error').show();
                    setTimeout(function(){
                        if ($('#admin-pois-error').is(':visible'))
                            $('#admin-pois-error').hide();
                    }, 30000);
                });
        };

        var searchBuildings = function(mode, reload, campus, row_data, campusValues, callback){
            var campusId = reload ? campus : getCampusId(campusValues,row_data.campus);
            getBuildings(
                campusId,
                function(data){
                    selBuilding = $('#'+mode+'-poi-building');
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
                    $('#admin-pois-error-text').text(jqXHR.responseText);
                    $('#admin-pois-error').show();
                    setTimeout(function(){
                        if ($('#admin-pois-error').is(':visible'))
                            $('#admin-pois-error').hide();
                    }, 30000);
                });
        };

        var searchFloors = function(mode, reload, building, row_data, callback){
            var floors = null,
                buildingId = null,
                address = null,
                buildingSelected = reload ? building : row_data.building;

            buildingsArray.forEach(function(building){
                if (building.edificio == buildingSelected) {
                    floors = building.plantas;
                    buildingId = building.ID_Edificio;
                    address = building.direccion;
                }
            });

            if (!buildingId) callback('Error: No se ha encontrado información sobre el edificio');
            else {
                selectedBuilding = buildingId;
                selFloor = $('#'+mode+'-poi-floor');
                selFloor.empty();
                console.log("Floors", floors);
                floors.forEach(function(floor){
                    selFloor.append('<option value="' + floor + '">' + floor + '</option>');
                });

                inputAddress = $('#'+mode+'-poi-address');
                inputAddress.val(address);

                if (reload) selFloor.val(floors[0]).change();
                else searchRooms(mode, reload, row_data, null, buildingId, callback);
            }
        }

        var searchRooms = function(mode, reload, row_data, floorId, buildingId, callback){
            var room = reload ? buildingId + floorId : buildingId + row_data.floor;
            getRooms(
                room,
                function(data){
                    selRoom = $('#'+mode+'-poi-roomName');
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
                    $('#admin-pois-error-text').text(jqXHR.responseText);
                    $('#admin-pois-error').show();
                    setTimeout(function(){
                        if ($('#admin-pois-error').is(':visible'))
                            $('#admin-pois-error').hide();
                    }, 30000);
                });
        };

        var fillModal = function(mode, reload, poiData, callback){
            var selCity = $('#'+mode+'-poi-city'),
                selCampus = $('#'+mode+'-poi-campus'),
                selStatus = $('#'+mode+'-poi-status'),
                selCategory = $('#'+mode+'-poi-category');

            if (mode==='edit' && !reload) {
                
                $('#'+mode+'-poi-modal-title').text('');
                $('#'+mode+'-poi-modal-title').text('Editar punto de interés - ID: ' + poiData.id);

                selCity.empty();
                getConstants('cities').forEach(function(city){
                    selCity.append('<option value="' + city.value + '">' + city.label + '</option>');
                });
                selCategory.empty();
                getConstants('categories').forEach(function(category){
                    selCategory.append('<option value="' + category.value + '">' + category.label + '</option>');
                });
            } else if (mode==='delete' && !reload) {
                $('#'+mode+'-poi-modal-title').text('');
                $('#'+mode+'-poi-modal-title').text('Eliminar punto de interés - ID: ' + poiData.id);
            }

            //Load data into selects fields
            if (!reload) {
                console.log("poiData", poiData);
                for (var key in poiData) {
                    if ($('#'+mode+'-poi-'+key).length > 0){
                        if (key == 'roomName') {
                            $('#'+mode+'-poi-'+key).val(poiData['roomName'] + ' ('+poiData['roomId']+')');
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
                            selCity.val(poiData.city[0] + poiData.city.substr(1).toLowerCase());
                        }
                        else {
                            $('#'+mode+'-poi-'+key).val(poiData[key]);
                        }
                    }
                }

                var category = $.grep(getConstants('categories'), function(e){ return e.value === poiData.category;});
                if (mode === 'delete') $('#delete-poi-category').val(category[0].label);
                else $('#edit-poi-category').val(category[0].value);

                $('#'+mode+'-poi-approved').attr('checked', poiData.approved);
            }

            if (callback != null) callback();
        }

        var selCity = $('#edit-poi-city'),
            selCampus = $('#edit-poi-campus'),
            selBuilding = $('#edit-poi-building'),
            selFloor = $('#edit-poi-floor'),
            inputAddress = $('#edit-poi-address');

        var loadMask = function() { $('body').mask('Cargando...'); };
        var unloadMask = function(err) {
            if (err) {
                $('#admin-pois-error-text').text(err);
                $('#admin-pois-error').show();
                setTimeout(function(){
                    if ($('#admin-pois-error').is(':visible'))
                        $('#admin-pois-error').hide();
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

        //Define table configuration
        var poisTable = $('#dataTable-pois').DataTable({
            ajax: {
                url: getConstants('API_URL') + '/pois/',
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
                        $('#dataTable-pois').DataTable().ajax.reload();
                    }
                },
                {
                    text: 'Editar',
                    action: function ( e, dt, node, config ) {
                        if ($('#dataTable-pois').DataTable().rows({ selected: true })[0].length == 1) {
                            $('body').mask('Cargando...');
                            var poiData = $('#dataTable-pois').DataTable().rows({ selected: true }).data()[0];
                            searchCampus('edit', null, null, poiData, function(){
                                $('#edit-poi-modal').modal({
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
                        if ($('#dataTable-pois').DataTable().rows({ selected: true })[0].length == 1) {
                            $('body').mask('Cargando...');
                            var poiData = $('#dataTable-pois').DataTable().rows({ selected: true }).data()[0];
                            searchCampus('delete', null, null, poiData, function(){
                                $('#delete-poi-modal').modal({
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
                { data: 'approved', render: function(data, type, full, meta){
                    return data === true ? 'Sí' : 'No';
                }},
                { data: 'category' , render: function(data,type,full,meta){
                    var category = $.grep(getConstants('categories'), function(e){ return e.value === data;});
                    return category[0].label;
                }},
                { data: 'city' },
                { data: 'campus' },
                { data: 'building' },
                { data: 'roomId' },
                { data: 'roomName' },
                { data: 'address' },
                { data: 'floor' },
                { data: 'comments' },
                { data: 'latitude', searchable: false },
                { data: 'longitude', searchable: false }
            ]
        });
    });

    //Define action on click Save button for modify a POI
    $('#edit-poi-btn').click(function(){
        $('body').mask('Enviando...');

        var poiData = $('#dataTable-pois').DataTable().rows({ selected: true }).data()[0],
            sendData = {};

        for (var key in poiData) {
            if ($('#edit-poi-'+key).length > 0) {
                sendData[key] = $('#edit-poi-'+key).val();
            } else {
                sendData[key] = poiData[key];
            }
        }

        campusArray.forEach(function(campus){
            if (campus.ID == sendData.campus) sendData.campus = campus.campus;
        });
        sendData.roomName = $('#edit-poi-roomName').val().split('(')[0].trim();
        sendData.roomId = $('#edit-poi-roomName').val().split('(')[1].slice(0,-1);

        sendData.approved = $('#edit-poi-approved').is(':checked');
        delete sendData.updated;

        editPOI(
            JSON.stringify(sendData),
            function(data, textStatus, jqXHR)
            {
                console.log('Modify poi', data);
                $('#dataTable-pois').DataTable().ajax.reload();
                $('#edit-poi-modal .close').click();
                $('body').unmask();
            },function (jqXHR, textStatus, errorThrown)
            {
                console.log('Modify poi error', jqXHR, errorThrown);
                $('body').unmask();
                $('#edit-poi-modal .close').click();
                $('#admin-pois-error-text').text('Error editando el punto de interés: ' + jqXHR.responseText);
                $('#admin-pois-error').show();
                setTimeout(function(){
                    if ($('#admin-pois-error').is(':visible'))
                        $('#admin-pois-error').hide();
                }, 30000);
            });
    });

    //Define action on click 'Eliminar' button for delete a POI
    $('#delete-poi-btn').click(function(){
        //$('body').mask('Enviando...');

        var poiData = $('#dataTable-pois').DataTable().rows({ selected: true }).data()[0];
        delete poiData.updated;

        deletePOI(
            poiData.id,
            function(data, textStatus, jqXHR)
            {
                console.log('Delete poi',data,textStatus, jqXHR);
                $('#dataTable-pois').DataTable().ajax.reload();
                $('#delete-poi-modal .close').click();
                $('body').unmask();
            },function (jqXHR, textStatus, errorThrown)
            {
                console.log('Delete poi error', jqXHR, errorThrown);
                $('body').unmask();
                $('#delete-poi-modal .close').click()
                $('#admin-pois-error-text').text('Error editando el punto de interés: ' + jqXHR.responseText);
                $('#admin-pois-error').show();
                setTimeout(function(){
                    if ($('#admin-pois-error').is(':visible'))
                        $('#admin-pois-error').hide();
                }, 30000);
            });
    });
});