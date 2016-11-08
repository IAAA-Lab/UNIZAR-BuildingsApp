UZCampusWebMapApp.service('sharedProperties', function () {

    var mapa = undefined;
    var plano = undefined;
    var markerLayer = [];
    var latUser = 0;
    var lonUser = 0;
    var opcion = undefined;
    var reloadMap = true;
    var lastMarkers = [];
    var lastMapMarker = null;
    var selectedBuilding = null;
    var mapLastClickedCoordinates = null;

    return ({
        getMapa: getMapa,
        setMapa: setMapa,
        getPlano: getPlano,
        setPlano: setPlano,
        getMarkerLayer: getMarkerLayer,
        setMarkerLayer: setMarkerLayer,
        getLatUser: getLatUser,
        setLatUser: setLatUser,
        getLonUser: getLonUser,
        setLonUser: setLonUser,
        getOpcion: getOpcion,
        setOpcion: setOpcion,
        getReloadMap: getReloadMap,
        setReloadMap: setReloadMap,
        getLastMarkers: getLastMarkers,
        setLastMarkers: setLastMarkers,
        getLastMapMarker: getLastMapMarker,
        setLastMapMarker: setLastMapMarker,
        getSelectedBuilding: getSelectedBuilding,
        setSelectedBuilding: setSelectedBuilding,
        getMapLastClickedCoordinates: getMapLastClickedCoordinates,
        setMapLastClickedCoordinates: setMapLastClickedCoordinates
    });

    function getMapa(){
        return mapa;
    }
    function setMapa(data){
        mapa = data;
    }

    function getPlano(){
        return plano;
    }
    function setPlano(data){
        plano = data;
    }

    function getMarkerLayer(){
        return markerLayer;
    }
    function setMarkerLayer(data){
        markerLayer = data;
    }

    function getLatUser(){
        return latUser;
    }
    function setLatUser(data){
        latUser = data;
    }

    function getLonUser(){
        return lonUser;
    }
    function setLonUser(data){
        lonUser = data;
    }

    function getOpcion(){
        return opcion;
    }
    function setOpcion(data){
        opcion = data;
    }

    function getReloadMap(){
        return reloadMap;
    }
    function setReloadMap(data){
        reloadMap = data;
    }

    function getLastMarkers(){
        return lastMarkers;
    }
    function setLastMarkers(data){
        lastMarkers = data;
    }

    function getLastMapMarker(){
        return lastMapMarker;
    }
    function setLastMapMarker(data){
        lastMapMarker = data;
    }

    function getSelectedBuilding(){
        return selectedBuilding;
    }
    function setSelectedBuilding(data){
        selectedBuilding = data;
    }

    function getMapLastClickedCoordinates(){
        return mapLastClickedCoordinates;
    }
    function setMapLastClickedCoordinates(data){
        mapLastClickedCoordinates = data;
    }
});