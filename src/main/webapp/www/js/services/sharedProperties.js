UZCampusWebMapApp.service('sharedProperties', function () {

    var map = undefined;
    var floorMap = undefined;
    var markerLayer = [];
    var latUser = 0;
    var lngUser = 0;
    var option = undefined;
    var reloadMap = true;
    var lastMarkers = [];
    var lastMapMarker = null;
    var selectedBuilding = null;

    return ({
        getMap: getMap,
        setMap: setMap,
        getFloorMap: getFloorMap,
        setFloorMap: setFloorMap,
        getMarkerLayer: getMarkerLayer,
        setMarkerLayer: setMarkerLayer,
        getLatUser: getLatUser,
        setLatUser: setLatUser,
        getLngUser: getLngUser,
        setLngUser: setLngUser,
        getOption: getOption,
        setOption: setOption,
        getReloadMap: getReloadMap,
        setReloadMap: setReloadMap,
        getLastMarkers: getLastMarkers,
        setLastMarkers: setLastMarkers,
        getLastMapMarker: getLastMapMarker,
        setLastMapMarker: setLastMapMarker,
        getSelectedBuilding: getSelectedBuilding,
        setSelectedBuilding: setSelectedBuilding
    });

    function getMap(){
        return map;
    }
    function setMap(data){
        map = data;
    }

    function getFloorMap(){
        return floorMap;
    }
    function setFloorMap(data){
        floorMap = data;
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

    function getLngUser(){
        return lngUser;
    }
    function setLngUser(data){
        lngUser = data;
    }

    function getOption(){
        return option;
    }
    function setOption(data){
        option = data;
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
});