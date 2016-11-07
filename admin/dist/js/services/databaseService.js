function getDatabaseTables(success, error){
    console.log('getDatabaseTables', arguments);
    $.ajax({
        url : getConstants('API_URL') + '/database/tables',
        type: 'GET',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success on get database tables',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error on get database tables', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
};

function updateDB(tables, success, error){
    console.log('updateDB', arguments);
    tables = (tables.length === 0) ? "all" : tables;
    $.ajax({
        url : getConstants('API_URL') + '/database/update',
        type: 'PUT',
        data : tables,
        contentType: 'application/json',
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