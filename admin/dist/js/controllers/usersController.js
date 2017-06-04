$(function() {
    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            checkToken();
        }
    };

    $('#admin-usuarios-error').hide();
    $('#admin-usuarios-success').hide();

    $(document).ready( function () {

        var fillModal = function(mode, reload, usuarioData, callback){

          console.log("Filling modal " + mode);

          $('#'+mode+'-usuario-username').val(usuarioData.username);
          $('#'+mode+'-usuario-name').val(usuarioData.name);
          $('#'+mode+'-usuario-surnames').val(usuarioData.surnames);
          $('#'+mode+'-usuario-email').val(usuarioData.email);
          $('#'+mode+'-usuario-birthDate').val(usuarioData.birthDate);

          if (mode == 'edit') {
            var roles = [
              { label:'ADMIN', value: 'ADMIN', id:1 },
              { label:'USER', value: 'USER', id:1 }
            ];
            $('#'+mode+'-usuario-role').empty();
            roles.forEach(function(role){
              if (role.value == usuarioData.role) {
                $('#'+mode+'-usuario-role').append('<option selected value="' + role.value + '">' + role.label + '</option>');
              }
              else {
                $('#'+mode+'-usuario-role').append('<option value="' + role.value + '">' + role.label + '</option>');
              }
            });
          }
          else if (mode == 'delete') {
            $('#'+mode+'-usuario-role').val(usuarioData.role);
          }

          if (callback !== null) callback();
        };

        var loadMask = function() { $('body').mask('Cargando...'); };
        var unloadMask = function(err) {
            if (err) {
                $('#admin-usuarios-error-text').text(err);
                $('#admin-usuarios-error').show();
                setTimeout(function(){
                    if ($('#admin-usuarios-error').is(':visible'))
                        $('#admin-usuarios-error').hide();
                }, 30000);
            }
            $('body').unmask();
        };

        //Define table configuration
        var usuariosTable = $('#dataTable-usuarios').DataTable({
            ajax: {
                url: getConstants('API_URL') + '/users',
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
                        $('#dataTable-usuarios').DataTable().ajax.reload();
                    }
                },
                {
                    text: 'Editar',
                    action: function ( e, dt, node, config ) {
                        if ($('#dataTable-usuarios').DataTable().rows({ selected: true })[0].length == 1) {
                            $('body').mask('Cargando...');
                            var usuarioData = $('#dataTable-usuarios').DataTable().rows({ selected: true }).data()[0];
                            fillModal('edit', null, usuarioData, function(){
                                $('#edit-usuario-modal').modal({
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
                        if ($('#dataTable-usuarios').DataTable().rows({ selected: true })[0].length == 1) {
                            $('body').mask('Cargando...');
                            var usuarioData = $('#dataTable-usuarios').DataTable().rows({ selected: true }).data()[0];
                            fillModal('delete', null, usuarioData, function(){
                                $('#delete-usuario-modal').modal({
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
                { data: 'username' },
                { data: 'role' },
                { data: 'email', defaultContent: '' },
                { data: 'name' },
                { data: 'surnames' },
                { data: 'birthDate' , defaultContent: 'No disponible' }
            ]
        });
    });

    //Define action on clicking 'Approve' button
    $('#edit-usuario-save-btn').click(function(){
        $('body').mask('Enviando...');

        var originalusuarioData = $('#dataTable-usuarios').DataTable().rows({ selected: true }).data()[0],
            sendData = {};

        //Fill data to send
        for (var key in originalusuarioData) {
          sendData[key] = $('#edit-usuario-'+key).val();
        }
        sendData.id = originalusuarioData.id;

        editUser(
            JSON.stringify(sendData),
            function(data){
                $('#dataTable-usuarios').DataTable().ajax.reload();
                $('#edit-usuario-modal .close').click();
                $('#admin-usuarios-success-text').text('Información del usuario actualizada correctamente');
                $('#admin-usuarios-success').show();
                $('body').unmask();
            },
            function(jqXHR, textStatus, errorThrown){
                $('body').unmask();
                $('#edit-usuario-modal .close').click();
                $('#admin-usuarios-error-text').text('Error editando la información del usuario: ' + jqXHR.responseText);
                $('#admin-usuarios-error').show();
                setTimeout(function(){
                    if ($('#admin-usuarios-error').is(':visible'))
                        $('#admin-usuarios-error').hide();
                }, 30000);
            });
    });

    //Define action on click 'Eliminar' button for delete a usuario
    $('#delete-usuario-btn').click(function(){
        $('body').mask('Enviando...');

        var usuarioData = $('#dataTable-usuarios').DataTable().rows({ selected: true }).data()[0];

        deleteUser(
            usuarioData.id,
            function(data){
                $('#dataTable-usuarios').DataTable().ajax.reload();
                $('#delete-usuario-modal .close').click();
                $('#admin-usuarios-success-text').text('Usuario eliminado con éxito');
                $('#admin-usuarios-success').show();
                $('body').unmask();
            },
            function(jqXHR, textStatus, errorThrown){
                $('body').unmask();
                $('#delete-usuario-modal .close').click();
                $('#admin-usuarios-error-text').text('Error eliminando el usuario: ' + jqXHR.responseText);
                $('#admin-usuarios-error').show();
                setTimeout(function(){
                    if ($('#admin-usuarios-error').is(':visible'))
                        $('#admin-usuarios-error').hide();
                }, 30000);
            });
    });
});
