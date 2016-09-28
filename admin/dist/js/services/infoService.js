function getCampus(city, success, error){
    console.log('getCampus', arguments);
    $.ajax({
        url : getConstants('API_URL') + '/busquedas/campus?ciudad='+city,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success getting campus',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error getting campus', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
};

function getBuildings(campus, success, error){
    console.log('getBuildings', arguments);
    $.ajax({
        url : getConstants('API_URL') + '/busquedas/edificio?campus='+campus,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success getting buildings',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error getting buildings', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
};

function getRooms(room, success, error){
    console.log('getRooms', arguments);
    $.ajax({
        url : getConstants('API_URL') + '/estancias/getAllEstancias?estancia=' + room,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success getting rooms',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error getting rooms', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
};