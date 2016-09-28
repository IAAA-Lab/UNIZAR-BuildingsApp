function login(data, success, error){
    console.log('login', arguments);
    $.ajax({
        url : getConstants('API_URL') + '/users/login',
        type: 'POST',
        data : data,
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success on login',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error on login', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
};

function createUser(data, success, error){
    console.log('createUser', arguments);
    $.ajax({
        url : getConstants('API_URL') + '/users/create',
        type: 'POST',
        data : JSON.stringify(userData),
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success on create user',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error on create user', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
};

function editUser(data, success, error){
    console.log('editUser', arguments);
    $.ajax({
        url : getConstants('API_URL') + '/users/edit',
        type: 'PUT',
        data : data,
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR)
        {
            console.log('Success on edit user',data);
            success(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('Error on edit user', jqXHR, errorThrown);
            error(jqXHR, textStatus, errorThrown);
        }
    });
};