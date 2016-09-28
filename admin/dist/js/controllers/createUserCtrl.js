$(function() {
    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            if (typeof Cookies.get('session-admin-cookie') == 'undefined'){
                $('body').mask('Loading...');
                window.location.href = 'login.html';
            }
        }
    };

    if ($('.dropdown-user').is(':visible')) $('.dropdown-user').css('display','none');
    
    var createBtn = $('#create-btn');
    $('#create-user-error').hide();
    $('#create-user-success').hide();

    createBtn.click(function(){

        $.validator.addMethod(
            'regex',
            function(value, element, regexp) {
                if (regexp.constructor != RegExp)
                    regexp = new RegExp(regexp);
                else if (regexp.global)
                    regexp.lastIndex = 0;
                return this.optional(element) || regexp.test(value);
            },
            'Contraseña poco segura'
        );

        var validator = $( '#create-user-form' ).validate({
            invalidHandler: function(event, validator) {
                console.log('Create user invalid form');
            },
            submitHandler: function(form){
                console.log('Create user valid form');
                userData = {};
                $('#create-user-panel').find('.form-control').each(function(){
                    var attr = $(this).attr('name');
                    if (attr !== 'repeatPassword') userData[attr] = $(this).val();
                });
                $('body').mask('Loading...');
                createUser(JSON.stringify(userData),
                    function(data, textStatus, jqXHR)
                    {
                        console.log('Create user success',data,textStatus, jqXHR);
                        $('#create-user-success-text').text('El usuario '+data.username+' ha sido creado con éxito.');
                        $('#create-user-success').show();
                        window.scrollTo(0,0);
                        validator.resetForm();
                        $('body').unmask();
                    },function (jqXHR, textStatus, errorThrown)
                    {
                        console.log('Create user error', jqXHR, errorThrown);
                        $('body').unmask();
                        $('#create-user-error-text').text(jqXHR.responseText);
                        $('#create-user-error').show();
                        setTimeout(function(){
                            if ($('#create-user-error').is(':visible'))
                                $('#create-user-error').hide();
                        }, 30000);
                    });
            },
            rules: {
                username: 'required',
                password: {
                    required: true,
                    minlength: 6,
                    regex: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d).*$/,
                },
                repeatPassword: {
                    required: true,
                    minlength: 6,
                    equalTo: '#password',
                    regex: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d).*$/,
                },
                name: 'required',
                surnames: 'required',
                email: {
                    required: true,
                    email: true
                },
                birthDate: {
                    date: true
                }
            },
            messages: {
                username: 'Campo obligatorio',
                password: {
                    required: 'Campo obligatorio',
                    minlength: 'M\u00EDnimo 6 caracteres'
                },
                repeatPassword: {
                    required: 'Campo obligatorio',
                    minlength: 'M\u00EDnimo 6 caracteres',
                    equalTo: 'Las contrase\u00F1as no conciden'
                },
                name: 'Campo obligatorio',
                surnames: 'Campo obligatorio',
                birthDate: {
                    date: 'La fecha debe ser estar en el formato DD/MM/YYY'
                },
                email: {
                    required: 'Campo obligatorio',
                    email: 'El email debe estar en el formato name@domain.com'
                }
            },
            errorClass: 'form-error'
        });
    });
});