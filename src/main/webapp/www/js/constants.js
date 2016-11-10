UZCampusWebMapApp.constant('APP_CONSTANTS', {
    URI_API: 'http://localhost:8080/',
    URI_Geoserver: 'http://155.210.14.31:8080/geoserver/',
    URI_Photos: 'http://localhost:8080/www/images/photos/',
    URI_Sigeuz_Geoserver: 'http://155.210.21.36:8080/geoserver/',
    photosWidth: 640,
    photosHeight: 350,
    datosMapa: [
        {
            name: "Campus San Francisco",
            lat: 41.642217,
            lng: -0.900011,
            zoom: 17
        },{
            name: "Campus Rio Ebro",
            lat: 41.683600515594215,
            lng: -0.8856855332851411,
            zoom: 17
        },{
            name: "Campus Empresariales",
            lat: 41.64716492110404,
            lng: -0.8871446549892426,
            zoom: 18
        },{
            name: "Campus Miguel Servet",
            lat: 41.63484190473223,
            lng: -0.8589070290327073,
            zoom: 18
        },{
            name: "Huesca",
            lat: 42.142172,
            lng: -0.405557,
            zoom: 18
        },{
            name: "Teruel",
            lat: 40.351661,
            lng: -1.110081,
            zoom: 18
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