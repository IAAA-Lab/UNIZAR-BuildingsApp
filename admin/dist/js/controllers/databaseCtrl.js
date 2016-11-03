$(function() {
    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            if (typeof Cookies.get('session-admin-cookie') == 'undefined'){
                $('body').mask('Loading...');
                window.location.href = "login.html";
            }
        }
    };

    $('#admin-updateDB-success').hide();
    $('#admin-updateDB-error').hide();

    $('#update-db-btn').click(function(){
        $('#updateDB-confirm-modal').modal({
            keyboard: true,
            backdrop: 'static',
            show:true,
        });
    });

    $('#update-db-ok-btn').click(function(){
        $('body').mask('Loading...');
        $("#updateDB-confirm-modal .close").click();
        updateDB(
            function(data){
                $('#admin-updateDB-success-text').text('Espacios actualizados con éxito');
                $('#admin-updateDB-success').show();
                $('body').unmask();
            },
            function(jqXHR, textStatus, errorThrown){
                $('#admin-updateDB-error-text').text(jqXHR.responseText);
                $('#admin-updateDB-error').show();
                $('body').unmask();
            }); 
    });
});