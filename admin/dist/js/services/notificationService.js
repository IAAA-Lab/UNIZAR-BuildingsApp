function updateCambio(sendData, success, error){
    console.log('updateNotification', JSON.stringify(arguments));

    var notificacion = {
      "id_espacio": sendData.id_espacio,
      "descripcion": sendData.descripcion,
      "estado": sendData.estado,
      "comentario_admin": sendData.comentario_admin
    };

    $.ajax({
        url : getConstants('API_URL') + '/notificacion/cambio/' + sendData.id_notificacion,
        type: 'PUT',
        data : JSON.stringify(notificacion),
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success updateCambio',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error updateCambio', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
}

function deleteCambio(id, success, error){
    console.log('deleteCambio', JSON.stringify(arguments));
    $.ajax({
        url : getConstants('API_URL') + '/notificacion/cambio/' + id,
        type: 'DELETE',
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success deleteCambio',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error deleteCambio', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
}

function updateIncidencia(sendData, success, error){
    console.log('updateIncidencia', JSON.stringify(arguments));

    var notificacion = {
      "id_espacio": sendData.id_espacio,
      "descripcion": sendData.descripcion,
      "estado": sendData.estado,
      "comentario_admin": sendData.comentario_admin
    };

    $.ajax({
        url : getConstants('API_URL') + '/notificacion/incidencia/' + sendData.id_notificacion,
        type: 'PUT',
        data : JSON.stringify(notificacion),
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success updateIncidencia',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error updateIncidencia', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
}

function deleteIncidencia(id, success, error){
    console.log('deleteIncidencia', JSON.stringify(arguments));
    $.ajax({
        url : getConstants('API_URL') + '/notificacion/incidencia/' + id,
        type: 'DELETE',
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success deleteIncidencia',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error deleteIncidencia', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
}
