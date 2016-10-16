function approveRejectPOI(requestData, operation, success, error){
    console.log('approveRejectPOI', arguments);
    $.ajax({
        url : getConstants('API_URL') + '/pois/request/'+requestData.id+'/'+operation+'/'+requestData.type+'/',
        type: 'PUT',
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success on '+operation+' POI',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error on '+operation+' POI', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
};

function editPOI(data, success, error){
    console.log('editPOI', arguments);
    $.ajax({
        url : getConstants('API_URL') + '/pois/',
        type: 'PUT',
        data : data,
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success on edit POI',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error on edit POI', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
};

function deletePOI(id, success, error){
    console.log('deletePOI', arguments);
    $.ajax({
        url : getConstants('API_URL') + '/pois/'+id+'/',
        type: 'DELETE',
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success on delete POI',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error on delete POI', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
};