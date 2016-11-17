UZCampusWebMapApp.service('geoService', function(sharedProperties, infoService, poisService, APP_CONSTANTS, $ionicModal, $ionicPopup, $ionicLoading) {

    return ({
        crearMapa: crearMapa,
        centerMap: centerMap,
        crearPlano: crearPlano,
        updatePOIs: updatePOIs
    });

    //Creates main map with Google and OSM layers
    function crearMapa($scope, infoService){
        var option = sharedProperties.getOption();
        option = typeof option !== 'undefined' ? option : 0;
        sharedProperties.setOption(option);

        //Initial layers
        var ggl = new L.Google('ROADMAP');
        var satelite = new L.Google('SATELLITE');
        var hybrid = new L.Google('HYBRID');
        var openstreetmap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            maxZoom:50,
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        });

        var baseMaps = {
            "Google Roadmap": ggl,
            "Google Satelite": satelite,
            "Google Hibrida": hybrid,
            "Open Street Map": openstreetmap
        };

        var centerMapTo = APP_CONSTANTS.datosMapa[option];

        $scope.map = L.map('map'
            ,{
                crs: L.CRS.EPSG3857,
                zoomControl: false,
                layers: [openstreetmap]
            }
        ).setView([centerMapTo.lat, centerMapTo.lng], centerMapTo.zoom);
        $scope.map.attributionControl.setPrefix('');

        //Add controls to map
        L.control.layers(baseMaps, {}, {position: 'bottomleft'}).addTo($scope.map);
        L.control.zoom({position: 'topright'}).addTo($scope.map);
        L.control.locate({position: 'topright'}).addTo($scope.map);

        //Loads into map the layer with UNIZAR buildings
        var buildingsLayer = new L.TileLayer.WMS(APP_CONSTANTS.URI_Sigeuz_Geoserver + "sigeuz/wms", {
            layers: 'sigeuz:bordes',
            format: 'image/png',
            styles: 'show_hide_label_with_zoom',
            transparent: true,
            minZoom: 15,
            maxZoom: 25,
            zIndex: 1000,
            attribution: "Edificios"
        });
        $scope.map.addLayer(buildingsLayer,"Edificios");

        //Loads into map layer that will contain selected building marker
        sharedProperties.setMarkerLayer(new L.LayerGroup());
        $scope.map.addLayer(sharedProperties.getMarkerLayer(),'Marker');

        var src = new Proj4js.Proj('EPSG:4326');
        var dst = new Proj4js.Proj('EPSG:25830');

        //Handles behaviour when map is clicked
        $scope.map.on('click', function(e)
        {
            console.log("Map clicked on", e.latlng);
            var owsrootUrl = APP_CONSTANTS.URI_Sigeuz_Geoserver + 'ows';
            var selectedPoint = e.latlng;
            var p = new Proj4js.Point(e.latlng.lng,e.latlng.lat);
            Proj4js.transform(src, dst, p);

            var defaultParameters = {
                service : 'WFS',
                version : '1.1.1',
                request : 'GetFeature',
                typeName : 'sigeuz:bordes',
                maxFeatures : 500,
                outputFormat : 'text/javascript',
                format_options : 'callback:getJson',
                SrsName : 'EPSG:4326'
            };
            
            var customParams = {
                cql_filter:'DWithin(geom, POINT(' + p.x + ' ' + p.y + '), 0.1, meters)'
            };

            var parameters = L.Util.extend(defaultParameters, customParams);

            //On map 'click' --> show popup with info about the building selected
            $.ajax({
                url : owsrootUrl + L.Util.getParamString(parameters),
                dataType : 'jsonp',
                jsonpCallback : 'getJson',
                success: function(data){
                    console.log("Success getting building info", data);
                    if (data.features.length > 0) {
                        var lastMapMarker = sharedProperties.getLastMapMarker();
                        if (lastMapMarker) {
                            sharedProperties.getMarkerLayer().removeLayer(lastMapMarker);
                        }
                        $scope.map.panTo(selectedPoint);
                        showMarker($scope, data, selectedPoint, infoService);
                    }
                }
            });
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                sharedProperties.setLatUser(position.coords.latitude);
                sharedProperties.setLngUser(position.coords.longitude);
            });
        }

        sharedProperties.setMap($scope.map);

        infoService.getAllBuildings().then(
            function(buildings){
                //Loads into map layer for contains all buildings markers for search
                var searchMarkersLayer = new L.LayerGroup();
                $scope.map.addLayer(searchMarkersLayer,'Search');

                //Populate layer with markers from sample data for search
                for(i in buildings) {
                    var buildingName = buildings[i].buildingName,
                        pos = new L.latLng([buildings[i].y,buildings[i].x]),
                        marker = new L.Marker(pos, {opacity: 0, title: buildingName} );
                    marker.bindPopup(buildingName);
                    searchMarkersLayer.addLayer(marker);
                }

                //Add search control to the map
                $scope.map.addControl( new L.Control.Search({
                    layer: searchMarkersLayer,
                    initial: false,
                    position:'topleft',
                    minLength: 2
                }));
                sharedProperties.setMap($scope.map);
                return $scope.map;
            },
            function(err){
                console.log("Error on getAllBuildings", err);
                sharedProperties.setMap($scope.map);
                return $scope.map;
            }
        );
    }

    // Show marker with info over selected building
    function showMarker($scope, data, point, infoService){

        var buildingName = data.features[0].properties.cod3;

        $ionicLoading.show({template: $scope.i18n.loading_mask.loading});
        infoService.getBuildingInfo(buildingName).then(
            function (buildingData) {
                console.log("Data building", buildingData);
                $ionicLoading.hide();
                if (buildingData.length > 0  && typeof(buildingData) != 'undefined' && buildingData != null)
                {
                    var building = buildingData[0];

                    var html_header = '<div id="popup" class="text-center map-mark"><b>'+building.edificio+'</b><br>'+building.direccion+'</div> ';

                    var html_select = '<div>' + $scope.i18n.map.select_floor;
                    html_select += '<select class="ion-input-select select-map" onchange="goToFloorMap(this);" ng-model="plantaPopup" >';
                    html_select+='<option value=undefined selected="selected"></option>';

                    // Creates HTML element for the popup ('select' with floors and button)
                    for (i=0;i<building.plantas.length;i++)
                    {
                        var floorValue = building.plantas[i],
                            selectClass = 'class="'+floorValue+'"',
                            selectValueAttr = 'value="'+floorValue+'"',
                            dataBuildingFloor = 'data-building="'+building.ID_Edificio+'"',
                            attributes = [selectClass, selectValueAttr, dataBuildingFloor].join(' ');

                        html_select+='<option '+attributes+'>'+floorValue+'</option>';
                    }
                    html_select+='</select>';

                    var redireccion = "'https://maps.google.es/maps?saddr=" +
                        sharedProperties.getLatUser() + "," + sharedProperties.getLngUser() +
                        "&daddr=" + point.lng + ',' + point.lat +"&output=embed'";

                    var html_button='<button class="button button-small button-positive button-how" onclick="location.href='+redireccion+'">'+$scope.i18n.map.btn_howto+'</button></div>';
                    var html = html_header + html_select + html_button;
                    var myIcon = L.icon({
                        iconUrl: '',
                        iconSize: [5, 5]
                    });
                    var marker = new L.marker(point,{opacity: 0, title:building.edificio}).addTo($scope.map).bindPopup(html);

                    var markerLayer = sharedProperties.getMarkerLayer();
                    markerLayer.addLayer(marker);
                    sharedProperties.setMarkerLayer(markerLayer);
                    sharedProperties.setLastMapMarker(marker);
                    marker.fireEvent('click');
                }
                else {
                    console.log("Error on getInfoEdificio, data invalid", err);
                    var errorMsg = '<div class="text-center">'+$scope.i18n.errors.info.building+'</div>';
                    showInfoPopup($scope.i18n.errors.error, errorMsg);
                }
            },
            function(err){
                console.log("Error on getInfoEdificio", err);
                $ionicLoading.hide();
                var errorMsg = '<div class="text-center">'+$scope.i18n.errors.info.buildings+'</div>';
                showInfoPopup($scope.i18n.errors.error, errorMsg);
            }
        );
    }

    //Centers the map to the option selected
    function centerMap(option) {
        var cityData = APP_CONSTANTS.datosMapa;
        console.log('Cambio vista a: '+ cityData[option].name+' '+cityData[option].lat+' '+cityData[option].lng);
        var map = sharedProperties.getMap();
        if (map) {
            map.setView(new L.LatLng(cityData[option].lat, cityData[option].lng), cityData[option].zoom);
            map.zoomIn(); map.zoomOut();
        }
        sharedProperties.setMap(map);
    }

    //Creates map with the view of the selected building floor
    function crearPlano($scope, $http, infoService, sharedProperties, poisService, createModal) {
        
        $ionicLoading.show({template: $scope.i18n.loading_mask.loading});

        //Close opened popup on previous map
        var map = sharedProperties.getMap();
        if (typeof(map) != 'undefined') map.closePopup();
        
        //Recover building and floor id's
        var building = localStorage.building.indexOf('building') == -1 ? localStorage.building : JSON.parse(localStorage.building).building,
            floor = localStorage.floor,
            floor_id = building + floor;

        building_id = floor_id.replace(/\./g,"_").toLowerCase();
        console.log("Bulding and floor data", building, building_id, floor, floor_id);

        // Get building coordinates in order to load image layer of the room of the building
        infoService.getBuildingCoordinates(building).then(
            function (data) {
                var floorMap = sharedProperties.getFloorMap(),
                    buildingName = data.buildingName,
                    coordinates = {
                        lat: data.y,
                        lng: data.x
                    };

                //Set coordinates for center map when return from floor view
                APP_CONSTANTS.datosMapa[APP_CONSTANTS.datosMapa.length-1] = {
                    name: buildingName,
                    lat: data.y,
                    lng: data.x
                };
                sharedProperties.setOption(APP_CONSTANTS.datosMapa.length-1);

                //Remove previous plan layers
                if(!(typeof floorMap == 'undefined')) {
                    floorMap.eachLayer(function (layer) {
                        floorMap.removeLayer(layer);
                    });
                    floorMap.remove();
                }

                //Create building floor image layer
                var buildingImageLayer = new L.tileLayer.wms(APP_CONSTANTS.URI_Sigeuz_Geoserver + "sigeuz/wms", 
                {
                    layers: 'sigeuz:vista_plantas',
                    viewparams : 'PLANTA:'+floor_id,
                    format: 'image/png',
                    attribution: floor_id,
                    transparent: true,
                    maxZoom: 25, 
                    zIndex: 5
                });

                console.log("Building "+building+" image layer:",buildingImageLayer);

                //Create map of the building floor and add image layer to it
                floorMapProperties = {
                        attributionControl: false,
                        layers: [buildingImageLayer]
                }
                floorMap = new L.map('plan',floorMapProperties).setView(coordinates, 20);

                $('.leaflet-container').css('cursor','pointer');

                //On 'click' event --> Show room information if room has been clicked
                floorMap.on('click', function(point){
                    var srcRoom = new Proj4js.Proj('EPSG:4326');
                    var dstRoom = new Proj4js.Proj('EPSG:25830');
                    var pRoom = new Proj4js.Point(point.latlng.lng,point.latlng.lat);
                    Proj4js.transform(srcRoom, dstRoom, pRoom);

                    var defaultParameters = {
                        service : 'WFS',
                        version : '1.1.1',
                        request : 'GetFeature',
                        typeName : "sigeuz:vista_plantas",
                        maxFeatures : 500,
                        outputFormat : 'text/javascript',
                        format_options : 'callback:getJson',
                        SrsName : 'EPSG:4326'
                    };
                    
                    console.log(pRoom.x, pRoom.y);
                    var customParams = {
                        cql_filter:'DWithin(geom, POINT(' + pRoom.x + ' ' + pRoom.y + '), 0.1, meters)',
                        viewparams:'PLANTA:'+floor_id
                    };

                    var parameters = L.Util.extend(defaultParameters, customParams);

                    var owsrootUrl = APP_CONSTANTS.URI_Sigeuz_Geoserver + 'ows';

                    $.ajax({
                        url : owsrootUrl + L.Util.getParamString(parameters),
                        dataType : 'jsonp',
                        jsonpCallback : 'getJson',
                        success : handleJsonClick
                    });
                });

                //On 'contextmenu' event --> Show 'Create POI modal' if room has been clicked
                floorMap.on('contextmenu', function(e){
                    localStorage.contextMenuClickedPoint = JSON.stringify(e.latlng);
                    var srcRoom = new Proj4js.Proj('EPSG:4326');
                    var dstRoom = new Proj4js.Proj('EPSG:25830');
                    var pRoom = new Proj4js.Point(e.latlng.lng,e.latlng.lat);
                    Proj4js.transform(srcRoom, dstRoom, pRoom);

                    var defaultParameters = {
                        service : 'WFS',
                        version : '1.1.1',
                        request : 'GetFeature',
                        typeName : "sigeuz:vista_plantas",
                        maxFeatures : 500,
                        outputFormat : 'text/javascript',
                        format_options : 'callback:getJson',
                        SrsName : 'EPSG:4326'
                    };
                    
                    var customParams = {
                        cql_filter:'DWithin(geom, POINT(' + pRoom.x + ' ' + pRoom.y + '), 0.1, meters)',
                        viewparams:'PLANTA:'+floor_id
                    };

                    var parameters = L.Util.extend(defaultParameters, customParams);

                    var owsrootUrl = APP_CONSTANTS.URI_Sigeuz_Geoserver + 'ows';

                    $.ajax({
                        url : owsrootUrl + L.Util.getParamString(parameters),
                        dataType : 'jsonp',
                        jsonpCallback : 'getJson',
                        success : handleJsonContextMenu
                    });
                });

                //If last searched room matches with the building of the floor loaded 
                //  --> Remark on the map the last searched room
                if (typeof(localStorage.lastSearch)!=='undefined') {
                    if (localStorage.lastSearch.split('.').slice(0, -1).join('.') === floor_id) {
                        $ionicLoading.show({template: $scope.i18n.loading_mask.loading});
                        infoService.getRoomCentrePoint(localStorage.lastSearch).then(
                            function (data) {
                                console.log("Center point for rooom "+localStorage.lastSearch, data);
                                var centerCoord = data.coordinates;
                                var defaultParameters = {
                                    service : 'WFS',
                                    version : '1.1.1',
                                    request : 'GetFeature',
                                    typeName : "sigeuz:vista_plantas",
                                    maxFeatures : 500,
                                    outputFormat : 'text/javascript',
                                    format_options : 'callback:getJson',
                                    SrsName : 'EPSG:4326'
                                };
                                
                                var customParams = {
                                    cql_filter:'DWithin(geom, POINT(' + centerCoord[0] + ' ' + centerCoord[1] + '), 0.1, meters)',
                                    viewparams:'PLANTA:'+floor_id
                                };

                                var parameters = L.Util.extend(defaultParameters, customParams);

                                var owsrootUrl = APP_CONSTANTS.URI_Sigeuz_Geoserver + 'ows';
                                $.ajax({
                                    url : owsrootUrl + L.Util.getParamString(parameters),
                                    dataType : 'jsonp',
                                    jsonpCallback : 'getJson',
                                    success : handleJsonLastSearch
                                });
                            },
                            function(err){
                                console.log("Center point for room "+localStorage.lastSearch+" not found");
                            } 
                        )
                    } else {
                        updatePOIs($scope, floorMap, sharedProperties);
                    }
                } else {
                    updatePOIs($scope, floorMap, sharedProperties);
                }

                addLegend(floorMap, function(){
                    $('.legend').hide();
                    $('.legend-button').click(function(){
                        if ($('.legend').is(":visible")) $('.legend').hide(500);
                        else $('.legend').show(500);
                    });
                    sharedProperties.setFloorMap(floorMap);
                    $ionicLoading.hide();
                });

                $(".title").each(function(){
                    if($(this).text().indexOf($scope.i18n.floor.title)>-1){
                        $(this).text($scope.i18n.floor.title + " " + floor + " - " + buildingName);
                    }
                });

                // Handle behaviour when map is clicked on context menu (rigth click or long tap)
                function handleJsonContextMenu(data) {
                    try {
                        if (data.features.length) {
                            console.log("handleJsonContextMenu",data);
                            var selectedRoom = null;
                            var selectedFeature = L.geoJson(data, {
                                onEachFeature: function (feature, layer) {
                                    selectedRoom = layer;
                                    layer.on({
                                        contextmenu: function(e){
                                            var pointClicked = JSON.parse(localStorage.contextMenuClickedPoint),
                                                roomId = data.features[0].properties.id_unico
                                            createModal(pointClicked, roomId);
                                        }
                                    });
                                }
                            });
                            var currentMap = sharedProperties.getFloorMap();
                            var currentLayers = [];
                            currentMap.eachLayer(function(layer){
                                currentLayers.push(layer);
                            });
                            currentLayers.forEach(function(layer,i){
                                if (i !== 0) currentMap.removeLayer(layer);
                            });
                            selectedFeature.addTo(currentMap);
                            selectedRoom.fireEvent('contextmenu');
                            sharedProperties.setFloorMap(currentMap);
                            updatePOIs($scope, currentMap, sharedProperties);
                        }
                    } catch(err) {
                        console.log("handleJsonContextMenu catch err", err);
                        updatePOIs($scope, sharedProperties.getFloorMap(), sharedProperties);
                    }
                }

                // Handle behaviour when map is clicked
                function handleJsonClick(data) {
                    try {
                        if (data.features.length) {
                            console.log("handleJsonClick",data);
                            $ionicLoading.show({template: $scope.i18n.loading_mask.loading});
                            var selectedRoom = null;
                            var selectedFeature = L.geoJson(data, {
                                onEachFeature: function (feature, layer) {
                                    selectedRoom = layer;
                                    layer.on({
                                        click: whenClicked
                                    });
                                }
                            });
                            var currentMap = sharedProperties.getFloorMap();
                            var currentLayers = [];
                            currentMap.eachLayer(function(layer){
                                currentLayers.push(layer);
                            });
                            currentLayers.forEach(function(layer,i){
                                if (i !== 0) currentMap.removeLayer(layer);
                            });
                            selectedFeature.addTo(currentMap);
                            selectedRoom.fireEvent('click');
                            sharedProperties.setFloorMap(currentMap);
                            updatePOIs($scope, currentMap, sharedProperties);
                            $ionicLoading.hide();
                        }
                    } catch(err) {
                        console.log("handleJsonClick catch err", err);
                        updatePOIs($scope, sharedProperties.getFloorMap(), sharedProperties);
                    }
                }

                //Handle behaviour for show last searched room
                function handleJsonLastSearch(data) {
                    try {
                        if (data.features.length) {
                            console.log("handleJsonLastSearch",data);
                            var lastSearchFeature = L.geoJson(data);
                            var coordinatesRoom = data.features[0].geometry.coordinates[0][0][0];
                            var currentMap = sharedProperties.getFloorMap();
                            var currentLayers = [];
                            currentMap.eachLayer(function(layer){
                                currentLayers.push(layer);
                            });
                            currentLayers.forEach(function(layer,i){
                                if (i !== 0) currentMap.removeLayer(layer);
                            });
                            lastSearchFeature.addTo(currentMap);
                            currentMap.panTo(new L.LatLng(coordinatesRoom[1], coordinatesRoom[0]));
                            sharedProperties.setFloorMap(currentMap);
                            updatePOIs($scope, currentMap, sharedProperties);
                            $ionicLoading.hide();
                        }
                    } catch(err) {
                        console.log("handleJsonLastSearch catch err", err);
                        updatePOIs($scope, sharedProperties.getFloorMap(), sharedProperties);
                    }
                }

                //Show popup with info about room clicked on map
                function whenClicked(e) {
                    console.log("Room clicked", e);
                    var id = e.target.feature.properties.id_unico;
                    var roomCoordinates = e.target.feature.geometry.coordinates[0][0][0];
                    var roomLatLng = new L.LatLng(roomCoordinates[1],roomCoordinates[0]);

                    infoService.getRoomInfo(id).then(
                        function (data) {
                            if (data == null) {
                                console.log("There's no info on room ", id);
                                var errorMsg = '<div class="text-center">'+$scope.i18n.errors.info.selected_room+'</div>';
                                showInfoPopup($scope.i18n.errors.warning, errorMsg);
                            } else {
                                $scope.infoRoom = data;
                                console.log("infoEstancia",data);

                                var html_list = '<div><ul class="list-group">';
                                var html_list_items = '<li class="list-group-item">'+data.ID_espacio+'</li>';
                                html_list_items += '<li class="list-group-item">'+data.ID_centro+'</li>';
                                html_list = html_list + html_list_items + '</ul></div>';
                                var html_button = '<div class="info-btn-div"><button value="'+data.ID_espacio+'" class="button button-small button-positive" onclick="getRoomInfo(this)">'+$scope.i18n.floor.popups.room.button+' </button></div>';
                                var html =  html_list + html_button;

                                var currentMap = sharedProperties.getFloorMap();
                                L.popup().setLatLng(roomLatLng).setContent(html).openOn(currentMap);
                            }
                        },
                        function(err){
                            console.log("Error on getInfoEstancia", err);
                            $ionicLoading.hide();
                            var errorMsg = '<div class="text-center">'+$scope.i18n.errors.info.room+'</div>';
                            showInfoPopup($scope.i18n.errors.error, errorMsg);
                        }
                    );
                }

                //Add legend to map
                function addLegend(floorMap, callback) {
                    var legend = L.control({position: 'topright'});
                    legend.onAdd = function (map) {
                        var div = L.DomUtil.create('div', '');
                        var button = '<button class="button button-positive button-small legend-button">';
                        button += '<i class="icon ion-ios-help-outline"></i>';
                        button += '</button>';
                        var legend = '<div class="legend">';
                        APP_CONSTANTS.pois.forEach(function(poi){
                           legend += '<i class="'+poi.class+'">'+poi.label+'</i></br>';
                        });
                        legend += '</div>';
                        div.innerHTML = button + '<br>' + legend;
                         L.DomEvent.disableClickPropagation(div);
                        return div;
                    };
                    legend.addTo(floorMap);
                    callback();
                }
            },
            function(err){
                console.log("Error on getInfoEstancia", err);
                window.location = "#/app/map";
                $ionicLoading.hide();
                var errorMsg = '<div class="text-center">'+$scope.i18n.errors.info.room+'</div>';
                showInfoPopup($scope.i18n.errors.error, errorMsg);
            }
        );
    }

    //Add markers for every POI
    function updatePOIs($scope, floorMap, sharedProperties) {
        var building = localStorage.building.indexOf('building') == -1 ? localStorage.building : JSON.parse(localStorage.building).building,
            floor = localStorage.floor,
            markers = [];

        poisService.getRoomPOIs(building, floor).then(
            function(pois) {
                console.log("Get room POIs success",pois);
                pois.forEach(function(poi){
                    var iconClass = $.grep(APP_CONSTANTS.pois, function(e) { return e.value == poi.category })[0].class;
                    var poiLabel = $.grep(APP_CONSTANTS.pois, function(e) { return e.value == poi.category })[0].label;
                    var icon = L.divIcon({className: iconClass});

                    var translation = $scope.i18n.floor.popups.edit_poi;

                    var html = '<div class="text-center">';
                    html += '<b>'+translation.labels.category+':</b> '+poiLabel+'</br>';
                    html += '<b>'+translation.labels.comments+':</b> '+poi.comments+'</div>';
                    html += '<div class="edit-btn-div">';
                    html += '<button class="button button-small button-positive button-edit-poi" onclick="editPOI()" data-id="'+poi.id+'">'+translation.button+'</button></div>';
                    var marker = new L.marker([poi.latitude, poi.longitude], {icon: icon})
                    markers.push(marker);
                    marker.addTo(floorMap)
                    marker.bindPopup(html);
                });

                sharedProperties.getLastMarkers().forEach(function(marker){
                    floorMap.removeLayer(marker);
                });

                sharedProperties.setLastMarkers(markers);
            },
            function(err){
                console.log("Error on getRoomPOIs", err);
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: $scope.i18n.errors.error,
                    template: '<div class="text-center">'+$scope.i18n.errors.pois.search+'</div>'
                });
            }
        );
    }

    function showInfoPopup(title, msg){
        if ($('.ionic-alert-popup').is(":visible") == false) {
            $ionicPopup.alert({
                cssClass: 'ionic-alert-popup',
                title: title,
                template: msg
            });
        }
    }
});
