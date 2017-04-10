var constants_dev = {
    'API_URL':'http://localhost:8080',
    'PHOTOS_BASE_URL':'http://localhost/photos/'
};

var constants_prod = {
    'API_URL':'PROD_API_URL',
    'PHOTOS_BASE_URL':'PHOTOS_URL/photos/'
};

var constants;
if (window.location.hostname === 'localhost') constants = constants_dev;
else constants = constants_prod;

constants.preview_sizes = {
    maxWidth: 720,
    maxHeight: 380
};

constants.categories = [
        { label: 'Secretaría', value: 'secretaria'},
        { label: 'Baños', value: 'bathroom'},
        { label: 'Cafetería', value: 'cafeteria'},
        { label: 'Reprografía', value: 'reprografia'},
        { label: 'Conserjería', value: 'conserjeria'},
        { label: 'Biblioteca', value: 'biblioteca'},
        { label: 'Mini puntos limpios', value: 'mini-punto-limpio'},
        { label: 'Cajero automático', value: 'cajero'},
        { label: 'Departamentos', value: 'departamento'},
        { label: 'Acceso especial minusválidos', value: 'acceso-minusvalidos'},
        { label: 'Ascensores', value: 'ascensor'},
        { label: 'Aparcamiento Haz Dedo', value: 'aparcamiento-haz-dedo'},
        { label: 'Aparcamiento minusválido', value: 'aparcamiento-minusvalido'},
        { label: 'Aparcamiento bicicletas', value: 'aparcamiento-bicicletas'}
    ];

constants.cities = [
        { label: 'Zaragoza', value: 'Zaragoza', id: 1},
        { label: 'Huesca', value: 'Huesca', id: 2},
        { label: 'Teruel', value: 'Teruel', id: 3}
    ];

constants.POIfields = [
        { name: 'ID', value: 'id' },
        { name: 'Aprobado', value: 'approved' },
        { name: 'Categoría', value: 'category' },
        { name: 'Ciudad', value: 'city' },
        { name: 'Campus', value: 'campus' },
        { name: 'Edificio', value: 'building' },
        { name: 'Estancia ID', value: 'roomID' },
        { name: 'Estancia Nombre', value: 'roomName' },
        { name: 'Dirección', value: 'address' },
        { name: 'Planta', value: 'floor' },
        { name: 'Comentario', value: 'comments' },
        { name: 'Latitud', value: 'latitude' },
        { name: 'Longitud', value: 'longitude' }
    ];

constants.photo_status = [
        { label: 'Pendiente', value: 'Pending', id: 1},
        { label: 'Aprobada', value: 'Approved', id: 2},
        { label: 'Rechazada', value: 'Rejected', id: 3}
    ];

constants.cambio_status = [
        { label: 'Pendiete', value: 'Pendiente', id: 1},
        { label: 'Aprobado', value: 'Aprobado', id: 2},
        { label: 'Rechazado', value: 'Rechazado', id: 3},
        { label: 'Pendiente del usuario', value: 'Pendiente del usuario', id: 4}
    ];

constants.incidencia_status = [
        { label: 'Pendiente', value: 'Pendiente', id: 1},
        { label: 'Aprobada', value: 'Aprobado', id: 2},
        { label: 'Rechazada', value: 'Rechazado', id: 3},
        { label: 'Pendiente del usuario', value: 'Pendiente del usuario', id: 4}
    ];

function getConstants(key){
    return constants[key];
}
