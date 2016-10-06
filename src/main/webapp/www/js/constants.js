UZCampusWebMapApp.constant('APP_CONSTANTS', {
    URI_API: 'http://localhost:8080/',
    //URI_Geoserver: 'http://155.210.14.31:8080/geoserver/',
    URI_Photos: 'http://localhost:8080/www/images/photos/',
    URI_Geoserver: 'http://155.210.21.36:8080/geoserver/',
    photosWidth: 640,
    photosHeight: 350,
    edificios: ["CSF_1018_00","CSF_1110_00","CSF_1106_00","CSF_1021_00","CSF_1095_00","CSF_1097_00","CSF_1017_00","CSF_1022_00"],
    datosMapa: [
        {
            nombre: "Huesca",
            latitud: 42.142172,
            longitud: -0.405557
        },{
            nombre: "Zaragoza",
            latitud: 41.642217,
            longitud: -0.900011
        },{
            nombre: "Teruel",
            latitud: 40.351661,
            longitud: -1.110081
        }
    ],
    pois: [
        { value: 'secretaria', label: 'Secretaría' ,class: 'flaticon-folder'},
        { value: 'bathroom', label: 'Baños' ,class: 'flaticon-toilet'},
        { value: 'cafeteria', label: 'Cafetería' ,class: 'flaticon-hot-coffee-rounded-cup-on-a-plate-from-side-view'},
        { value: 'reprografia', label: 'Reprografía' ,class: 'flaticon-technology'},
        { value: 'conserjeria', label: 'Conserjería' ,class: 'flaticon-key-silhouette-security-tool-interface-symbol-of-password'},
        { value: 'biblioteca', label: 'Biblioteca' ,class: 'flaticon-open-book-icon'},
        { value: 'mini-punto-limpio', label: 'Mini puntos limpios' ,class: 'flaticon-arrows'},
        { value: 'cajero', label: 'Cajero automático' ,class: 'flaticon-money'},
        { value: 'departamento', label: 'Departamentos' ,class: 'flaticon-business-person-silhouette-wearing-tie'},
        { value: 'acceso-minusvalidos', label: 'Acceso especial minusválidos' ,class: 'flaticon-shapes'},
        { value: 'ascensor', label: 'Ascensores' ,class: 'flaticon-elevator-with-a-occupant'},
        { value: 'aparcamiento-haz-dedo', label: 'Aparcamiento Haz Dedo' ,class: 'flaticon-thumbs-up'},
        { value: 'aparcamiento-minusvalido', label: 'Aparcamiento minusválido' ,class: 'flaticon-accessibility'},
        { value: 'aparcamiento-bicicletas', label: 'Aparcamiento bicicletas' ,class: 'flaticon-bycicle'},
    ]
});