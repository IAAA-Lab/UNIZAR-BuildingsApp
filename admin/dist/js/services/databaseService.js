function updateDB(success, error){
    console.log('updateDB', arguments);
    $.ajax({
        url : getConstants('API_URL') + '/database/update',
        type: 'PUT',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success on update database',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error on update database', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
};