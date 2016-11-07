$(function() {
    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            if (typeof Cookies.get('session-admin-cookie') == 'undefined'){
                $('body').mask('Loading...');
                window.location.href = "login.html";
            }
        }
    };

    var hideAlert = function(alertId){
        setTimeout(function(){
            if ($(alertId).is(':visible')) {
                $(alertId).hide();
            }
        }, 30000);
    }

    $('body').mask('Loading...');
    getDatabaseTables(
        function(data){
            var database_tables = JSON.parse(data);
            var html = '<table><tr>';
            database_tables.forEach(function(table,i){
                
                if (i!==0 && i%3===0) {
                    if (i === database_tables.length -1) {
                        html += '</tr>';
                    } else {
                        html += '</tr><tr>';
                    }
                }
                html += '<td><input type="checkbox" value="' + table +'"> ' + table + '</td>';
            });
            html += '</table>';
            console.log("HTML", html);
            $('#database-tables').append(html);
            $('body').unmask();
        },
        function(jqXHR, textStatus, errorThrown){
            $('#admin-updateDB-error-text').text("Error loading database tables." + jqXHR.responseText);
            $('#admin-updateDB-error').show();
            hideAlert('#admin-updateDB-error');
            $('body').unmask();
        });


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
        $('body').mask('Updating...');
        $("#updateDB-confirm-modal .close").click();
        var tables = getSelectedTables();
        updateDB(
            tables.toString(),
            function(data){
                $('#admin-updateDB-success-text').text('Espacios actualizados con éxito');
                $('#admin-updateDB-success').show();
                hideAlert('#admin-updateDB-success');
                $('body').unmask();
            },
            function(jqXHR, textStatus, errorThrown){
                $('#admin-updateDB-error-text').text(jqXHR.responseText);
                $('#admin-updateDB-error').show();
                hideAlert('#admin-updateDB-error');
                $('body').unmask();
            });
    });

    var getSelectedTables = function(){
        var tablesSelected = [];
        $('#database-tables input[type="checkbox"]').each(function(){
            if ($(this).is(':checked')) {
                tablesSelected.push($(this).val());
            }
        });
        return tablesSelected;
    }
});