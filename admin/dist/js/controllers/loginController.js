$(function() {

    $('#login-error').hide();

    // document.onreadystatechange = function (e) {
    //     if (document.readyState === 'complete') {
            // if (typeof Cookies.get('session-admin-cookie') != 'undefined') {
            //     $('body').mask('Loading...');
            //     window.location.href = 'index.html';
            // }
          $(document).ready(function() {
            checkToken();

          });
        // });
    // };

    $('.form-control').keyup(function(event){
        if(event.keyCode == 13){
            $('.btn-login').click();
        }
    });

    $('.btn-login').click(function(){
        console.log('Login');

        $('body').mask('Loading...');

        var formData = JSON.stringify({username: $('#login-username').val(),password: $('#login-pwd').val()});

        login(formData,
            function(data, textStatus, jqXHR)
            {
                localStorage.setItem('token', jqXHR.getResponseHeader('Authorization'));

                // Comprueba que el usuario es admin
                checkAdmin(
                  function(data, textStatus, jqXHR) {

                    // El usuario es un administrador

                    // Cookies.set('session-admin-cookie', $.md5(data.username, data.id));
                    // sessionStorage.setItem('userData', JSON.stringify(data));
                    console.log('Login success',data,textStatus, jqXHR);
                    window.location.href = 'index.html';
                  },
                  function(jqXHR, textStatus, errorThrown) {
                    console.log('Login error', jqXHR, errorThrown);
                    localStorage.removeItem('token');
                    $('body').unmask();
                    $('#login-error-text').text("El usuario y contraseña proporcionados no son válidos. Vuelve a intentarlo ;D");
                    $('#login-error').show();
                    setTimeout(function(){
                        if ($('#login-error').is(':visible'))
                            $('#login-error').hide();
                    }, 30000);
                  }
              );
            },
            function (jqXHR, textStatus, errorThrown)
            {
                console.log('Login error', jqXHR, errorThrown);
                $('body').unmask();
                $('#login-error-text').text("El usuario y contraseña proporcionados no son válidos. Vuelve a intentarlo");
                $('#login-error').show();
                setTimeout(function(){
                    if ($('#login-error').is(':visible'))
                        $('#login-error').hide();
                }, 30000);
            });
    });
});
