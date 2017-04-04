$(function() {
    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            // if (typeof Cookies.get('session-admin-cookie') == 'undefined'){
            //     $('body').mask('Loading...');
            //     window.location.href = "login.html";
            // }
            checkToken();
        }
    };

    $('#admin-upload-photo-success').hide();
    $('#admin-upload-photo-error').hide();

    var buildings = [],
        selectedBuilding = null;

    var formOpt1 = $('#upload-image-form-opt1'),
        formOpt2 = $('#upload-image-form-opt2'),
        formOpt1Btn = $('#upload-btn-opt1'),
        formOpt2Btn = $('#upload-btn-opt2'),
        formOpt2CitySelect = $('#upload-image-form-opt2').find('select[name=city]'),
        formOpt2CampusSelect = $('#upload-image-form-opt2').find('select[name=campus]'),
        formOpt2BuildingSelect = $('#upload-image-form-opt2').find('select[name=building]'),
        formOpt2FloorSelect = $('#upload-image-form-opt2').find('select[name=floor]'),
        formOpt2RoomSelect = $('#upload-image-form-opt2').find('select[name=id_espacio_opt2]');

    getConstants('cities').forEach(function(city){
        formOpt2CitySelect.append('<option value="' + city.id + '">' + city.label + '</option>');
    });
    formOpt2CitySelect.val('');

    var cleanForm = function(id){
        $(':input', id)
            .removeAttr('checked')
            .removeAttr('selected')
            .not(':button, :submit, :reset, :hidden, :radio, :checkbox')
            .val('');
    }

    formOpt1Btn.click(function(){

        var validatorForm1 = formOpt1.validate({
            invalidHandler: function(event, validator) {
                console.log('Upload photo option 1 form: INVALID');
            },
            submitHandler: function(form){
                console.log('Upload photo option 1 form: VALID');
                var formData = new FormData();
                formData.append('name', $('input[name=id_espacio_opt1]')[0].value.trim() + '_' + Date.now() + '.jpg');
                formData.append('file', $('input[name=image_opt1]')[0].files[0]);
                formData.append('mode', 'admin');
                if (sessionStorage.getItem('userData') == null || typeof(sessionStorage.getItem('userData'))=='unefined') {
                    formData.append('email',null);
                } else {
                    formData.append('email', JSON.parse(sessionStorage.getItem('userData')).email);
                }
                console.log('formData', formData);
                $('body').mask('Loading...');
                uploadPhoto(
                    formData,
                    function(data, textStatus, jqXHR)
                    {
                        console.log('Create user success',data,textStatus, jqXHR);
                        $('#admin-upload-photo-success-text').text('La imagen se ha enviado con éxito.');
                        $('#admin-upload-photo-success').show();
                        window.scrollTo(0,0);
                        cleanForm('#upload-image-form-opt1');
                        $('body').unmask();
                    },function (jqXHR, textStatus, errorThrown)
                    {
                        console.log('Create user error', jqXHR, errorThrown);
                        $('body').unmask();
                        $('#admin-upload-photo-error-text').text(jqXHR.responseText);
                        $('#admin-upload-photo-error').show();
                        window.scrollTo(0,0);
                        setTimeout(function(){
                            if ($('#admin-upload-photo-error').is(':visible'))
                                $('#admin-upload-photo-error').hide();
                        }, 30000);
                    });
            },
            rules: {
                id_espacio_opt1: 'required',
                image_opt1: 'required'
            },
            messages: {
                id_espacio_opt1: 'Campo obligatorio',
                id_espacio_opt1: 'Campo obligatorio'
            },
            errorClass: 'form-error'
        });
    });

    var searchCampus = function(){
        var city = formOpt2CitySelect.val();
        $('body').mask('Loading...');
        getCampus(
            city,
            function(data){
                formOpt2CampusSelect.prop('disabled',false);
                formOpt2CampusSelect.empty();
                data.forEach(function(campus){
                    formOpt2CampusSelect.append('<option value="' + campus.ID + '">' + campus.campus + '</option>');
                });
                $('body').unmask();
                searchBuildings();
            },
            function(jqXHR, textStatus, errorThrown){
                $('#admin-upload-photo-error-text').text(jqXHR.responseText);
                $('#admin-upload-photo-error').show();
                window.scrollTo(0,0);
                $('body').unmask();
                setTimeout(function(){
                    if ($('#admin-upload-photo-error').is(':visible'))
                        $('#admin-upload-photo-error').hide();
                }, 30000);
            });
    };

    var searchBuildings = function(){
        var campus = formOpt2CampusSelect.val();
        $('body').mask('Loading...');
        getBuildings(
            campus,
            function(data){
                formOpt2BuildingSelect.prop('disabled',false);
                formOpt2BuildingSelect.empty();
                buildings = data;
                data.forEach(function(building){
                    formOpt2BuildingSelect.append('<option value="' + building.ID_Edificio + '">' + building.edificio + '</option>');
                });
                $('body').unmask();
                searchFloors();
            },
            function(jqXHR, textStatus, errorThrown){
                $('#admin-upload-photo-error-text').text(jqXHR.responseText);
                $('#admin-upload-photo-error').show();
                window.scrollTo(0,0);
                $('body').unmask();
                setTimeout(function(){
                    if ($('#admin-upload-photo-error').is(':visible'))
                        $('#admin-upload-photo-error').hide();
                }, 30000);
            });
    };

    var searchFloors = function(){
        selectedBuilding = formOpt2BuildingSelect.val();
        $('body').mask('Loading...');
        var floors = null;
        buildings.forEach(function(building){
            if (building.ID_Edificio == selectedBuilding) floors = building.plantas;
        });
        formOpt2FloorSelect.prop('disabled',false);
        formOpt2FloorSelect.empty();
        floors.forEach(function(floor){
            formOpt2FloorSelect.append('<option value="' + floor + '">' + floor + '</option>');
        });
        $('body').unmask();
        searchRooms();
    }

    var searchRooms = function(){
        var floor = formOpt2FloorSelect.val();
        $('body').mask('Loading...');
        getRooms(
            selectedBuilding + floor,
            function(data){
                formOpt2RoomSelect.prop('disabled',false);
                formOpt2RoomSelect.empty();
                data.forEach(function(room){
                    formOpt2RoomSelect.append('<option value="' + room.ID_espacio + '">' + room.ID_centro + ' - ' + room.ID_espacio + '</option>');
                });
                $('#upload-image-form-opt2').find('input[type=file]').prop('disabled',false);
                $('body').unmask();
            },
            function(jqXHR, textStatus, errorThrown){
                $('#admin-upload-photo-error-text').text(jqXHR.responseText);
                $('#admin-upload-photo-error').show();
                window.scrollTo(0,0);
                $('body').unmask();
                setTimeout(function(){
                    if ($('#admin-upload-photo-error').is(':visible'))
                        $('#admin-upload-photo-error').hide();
                }, 30000);
            });
    };

    formOpt2CitySelect.change(function(){
        searchCampus();
    });

    formOpt2CampusSelect.change(function(){
        searchBuildings();
    });

    formOpt2BuildingSelect.change(function(){
        searchFloors();
    });

    formOpt2FloorSelect.change(function(){
        searchRooms();
    });

    formOpt2Btn.click(function(){

        var validatorForm2 = formOpt2.validate({
            invalidHandler: function(event, validator) {
                console.log('Upload photo option 2 form: INVALID');
            },
            submitHandler: function(form){
                console.log('Upload photo option 2 form: VALID');
                var formData = new FormData();
                formData.append('name', $('select[name=id_espacio_opt2]').val() + '_' + Date.now() + '.jpg');
                formData.append('file', $('input[name=image_opt2]')[0].files[0]);
                formData.append('mode', 'admin');
                if (sessionStorage.getItem('userData') == null || typeof(sessionStorage.getItem('userData'))=='unefined') {
                    formData.append('email',null);
                } else {
                    formData.append('email', JSON.parse(sessionStorage.getItem('userData')).email);
                }
                console.log('formData', formData);
                $('body').mask('Loading...');
                uploadPhoto(
                    formData,
                    function(data){
                        $('#admin-upload-photo-success-text').text('La imagen se ha enviado con éxito.');
                        $('#admin-upload-photo-success').show();
                        window.scrollTo(0,0);
                        cleanForm('#upload-image-form-opt2');
                        $('body').unmask();
                    },
                    function(jqXHR, textStatus, errorThrown){
                        $('body').unmask();
                        $('#admin-upload-photo-error-text').text(jqXHR.responseText);
                        $('#admin-upload-photo-error').show();
                        window.scrollTo(0,0);
                        setTimeout(function(){
                            if ($('#admin-upload-photo-error').is(':visible'))
                                $('#admin-upload-photo-error').hide();
                        }, 30000);
                    });
            },
            rules: {
                city: 'required',
                campus: 'required',
                building: 'required',
                floor: 'required',
                id_espacio_opt1: 'required',
                image_opt1: 'required'
            },
            messages: {
                city: 'Campo obligatorio',
                campus: 'Campo obligatorio',
                building: 'Campo obligatorio',
                floor: 'Campo obligatorio',
                id_espacio_opt1: 'Campo obligatorio',
                image_opt1: 'Campo obligatorio'
            },
            errorClass: 'form-error'
        });
    });
});
