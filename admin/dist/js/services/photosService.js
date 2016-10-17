function updatePhoto(sendData, success, error){
    console.log('updatePhoto', arguments);
    $.ajax({
        url : getConstants('API_URL') + '/photos/',
        type: 'PUT',
        data : JSON.stringify(sendData),
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success updatePhoto',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error updatePhoto', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
};

function deletePhoto(id, success, error){
    console.log('deletePhoto', arguments);
    $.ajax({
        url : getConstants('API_URL') + '/photos/'+id+'/',
        type: 'DELETE',
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success deletePhoto',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error deletePhoto', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
};

function uploadPhoto(data, success, error){
    console.log('uploadPhoto', arguments);
    $.ajax({
        url :  getConstants('API_URL') + '/photos/upload/',
        type: 'POST',
        data : data,
        contentType: false,
        cache: false,
        processData: false,
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success uploadPhoto',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error uploadPhoto', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
};