
UZCampusWebMapApp.service('geoService', function(sharedProperties, infoService, poisService, APP_CONSTANTS, $ionicModal, $ionicPopup) {

    return ({
        crearMapa: crearMapa,
        localizarHuesca: localizarHuesca,
        localizarZaragoza: localizarZaragoza,
        localizarTeruel: localizarTeruel,
        crearPlano: crearPlano,
        updatePOIs: updatePOIs
    });

    function crearMapa($scope, infoService){
        //TODO: [DGP] Use of localStorage for recover option?
        var option = sharedProperties.getOpcion();
        option = typeof option !== 'undefined' ? option : 1;  //Si no tenemos valor, por defecto escogemos Zaragoza
        sharedProperties.setOpcion(option);

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

        var MIN_ZOOM = 15;
        var INIT_ZOOM = 15;
        var MAX_ZOOM = 15;

        //Centro ciudad
        var INI_LAT = 41.653496;
        var INI_LON = -0.889492;

        $scope.map = L.map('mapa'
            ,{
                crs: L.CRS.EPSG3857,
                layers: [openstreetmap]
            }
        ).setView([APP_CONSTANTS.datosMapa[option].latitud, APP_CONSTANTS.datosMapa[option].longitud], INIT_ZOOM);
        $scope.map.attributionControl.setPrefix('');
        L.control.layers(baseMaps, {}, {position: 'bottomleft'}).addTo($scope.map);

        var buildingsLayer = new L.TileLayer.WMS(APP_CONSTANTS.URI_Geoserver_2 + "sigeuz/wms", {
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

        L.control.locate().addTo($scope.map);

        sharedProperties.setMarkerLayer(new L.LayerGroup());
        $scope.map.addLayer(sharedProperties.getMarkerLayer());
        var controlSearch = new L.Control.Search({layer: sharedProperties.getMarkerLayer(), initial: false, position:'topright'});
        $scope.map.addControl(controlSearch);

        var src = new Proj4js.Proj('EPSG:4326'); //Sistema de proyección del origen
        var dst = new Proj4js.Proj('EPSG:25830'); //Sistema de proyección de las entidades de destino

        $scope.map.on('click', function(e)
        {
            var owsrootUrl = APP_CONSTANTS.URI_Geoserver_2 + 'ows';
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
            
            planta = 'CSF.1215.0'; //param 'planta' is needed, but has no use
            var customParams = {
                cql_filter:'DWithin(geom, POINT(' + p.x + ' ' + p.y + '), 0.1, meters)'
            };

            var parameters = L.Util.extend(defaultParameters, customParams);
            var url = owsrootUrl + L.Util.getParamString(parameters);

            $.ajax({
                url : owsrootUrl + L.Util.getParamString(parameters),
                dataType : 'jsonp',
                jsonpCallback : 'getJson',
                success: function(data){
                    console.log("Success", data);
                    if (data.features.length > 0) {
                        var lastMapMarker = sharedProperties.getLastMapMarker();
                        if (lastMapMarker) {
                            sharedProperties.getMarkerLayer().removeLayer(lastMapMarker);
                        }
                        showMarker($scope, data, selectedPoint, infoService);
                    }
                }
            });
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                sharedProperties.setLatUser(position.coords.latitude);
                sharedProperties.setLonUser(position.coords.longitude);
            });
        }

        sharedProperties.setMapa($scope.map);
        return $scope.map;
    }

    // Funcion encargada de añdir el marcador sobre el edificio para mostrar despues la informacion de dicho edificio
    function showMarker($scope, data, point, infoService){

        var coordenadas = data.features[0].geometry.coordinates[0][0][0];
        var edificioName = data.features[0].properties.cod3;

        infoService.getInfoEdificio(edificioName).then(
            function (dataEdificio) {
                console.log("Data edificio", dataEdificio);
                if (dataEdificio.length > 0  && typeof(dataEdificio) != 'undefined' && dataEdificio != null)
                {
                    var edificio = dataEdificio[0];

                    var html_header = '<div id="popup" class="text-center map-mark"><b>'+edificio.edificio+'</b><br>'+edificio.direccion+'</div> ';

                    var html_select = '<div>' + $scope.translation.SELECCIONAR_PLANTA;
                    html_select += '<select class="ion-input-select select-map" onchange="selectPlano(this);" ng-model="plantaPopup" >';
                    html_select+='<option value=undefined selected="selected"></option>';

                    // Load building floor values in HTML 'select' element
                    for (i=0;i<edificio.plantas.length;i++)
                    {
                        var floorValue = edificio.plantas[i],
                            selectClass = 'class="'+floorValue+'"',
                            selectValueAttr = 'value="'+floorValue+'"',
                            dataEdificioFloor = 'data-building="'+edificio.ID_Edificio+'"',
                            attributes = [selectClass, selectValueAttr, dataEdificioFloor].join(' ');

                        html_select+='<option '+attributes+'>'+floorValue+'</option>';
                    }
                    html_select+='</select>';

                    var redireccion = "'https://maps.google.es/maps?saddr=" +
                        sharedProperties.getLatUser() + "," + sharedProperties.getLonUser() +
                        "&daddr=" + point.lng + ',' + point.lat +"&output=embed'";

                    var html_button='<button class="button button-small button-positive button-how" onclick="location.href ='+redireccion+'" >'+$scope.translation.HOWTOARRIVE+' </button></div>';
                    var html = html_header + html_select + html_button;
                    var myIcon = L.icon({
                        iconUrl: '',
                        iconSize: [5, 5]
                    });
                    var marker = new L.marker(point,{opacity: 0, title:edificio.edificio}).addTo($scope.map).bindPopup(html);

                    var markerLayer = sharedProperties.getMarkerLayer();
                    markerLayer.addLayer(marker);
                    sharedProperties.setMarkerLayer(markerLayer);
                    sharedProperties.setLastMapMarker(marker);
                    marker.fireEvent('click');
                }
                else {
                    console.log("Error on getInfoEdificio, data invalid", err);
                    var errorMsg = '<div class="text-center">Ha ocurrido un error recuperando<br>';
                    errorMsg += 'información del edificio</div>';
                    showInfoPopup('¡Error!', errorMsg);
                }
            },
            function(err){
                console.log("Error on getInfoEdificio", err);
                var errorMsg = '<div class="text-center">Ha ocurrido un error recuperando<br>';
                errorMsg += 'información de algunos edificios</div>';
                showInfoPopup('¡Error!', errorMsg);
            }
        );
    }

    function localizarHuesca() {
        var cityData = APP_CONSTANTS.datosMapa;
        console.log('Cambio vista a: '+ cityData[0].nombre+' '+cityData[0].latitud+' '+cityData[0].longitud);
        var mapa = sharedProperties.getMapa();
        if (mapa) {
            mapa.setView(new L.LatLng(cityData[0].latitud, cityData[0].longitud), 14);
            mapa.zoomIn(); mapa.zoomOut();
        }
        sharedProperties.setMapa(mapa);
    }

    function localizarZaragoza() {
        cityData = APP_CONSTANTS.datosMapa;
        console.log('Cambio vista a: '+ cityData[1].nombre+' '+cityData[1].latitud+' '+cityData[1].longitud);
        var mapa = sharedProperties.getMapa();
        if (mapa) {
            mapa.setView(new L.LatLng(cityData[1].latitud, cityData[1].longitud), 16);
            mapa.zoomIn(); mapa.zoomOut();
        }
        sharedProperties.setMapa(mapa);
    }

    function localizarTeruel() {
        cityData = APP_CONSTANTS.datosMapa;
        console.log('Cambio vista a: '+ cityData[2].nombre+' '+cityData[2].latitud+' '+cityData[2].longitud);
        var mapa = sharedProperties.getMapa();
        if (mapa) {
            mapa.setView(new L.LatLng(cityData[2].latitud, cityData[2].longitud), 16);
            mapa.zoomIn(); mapa.zoomOut();
        }
        sharedProperties.setMapa(mapa);
    }

    function crearPlano($scope, $http, infoService, sharedProperties, poisService, createModal) {
        
        //Close opened popup on previous map
        var mapa = sharedProperties.getMapa();
        if (typeof(mapa) != 'undefined') mapa.closePopup();
        
        var building = localStorage.building.indexOf('building') == -1 ? localStorage.building : JSON.parse(localStorage.building).building,
            floor = localStorage.planta,
            edificio_id = building + floor;

        edificio_id = edificio_id.replace(/\./g,"_").toLowerCase();

        var url = APP_CONSTANTS.URI_Geoserver_1 + 'proyecto/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=proyecto:'+edificio_id+'&srsName=epsg:4326&outputFormat=application/json';
        $.ajax({
            url : url,
            type: 'GET',
            dataType : 'json',
            crossDomain: true,
            headers: { 'Access-Control-Allow-Origin': '*' },
            success: function(data) {
                handleJson(data, sharedProperties, poisService, createModal, function(plano){
                    addLegend(plano, function(){
                        // Define legend behaviour
                        $('.legend').hide();
                        $('.legend-button').click(function(){
                            if ($('.legend').is(":visible")) $('.legend').hide(500);
                            else $('.legend').show(500);
                        });
                        sharedProperties.setPlano(plano);
                    });
                });
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                console.log("Error getting plan of " + edificio_id, jqXHR, errorThrown);
                var errorMsg = '<div class="text-center">No se dispone del plano<br>';
                errorMsg += 'de la planta seleccionada</div>';
                showInfoPopup('¡Error!', errorMsg);
                window.location = "#/app/mapa";
            }
        });

        function handleJson(data, sharedProperties, poisService, createModal, callback) {
            console.log("handleJson", data);
            var plano = sharedProperties.getPlano(),
                coordenadas = data.features[0].geometry.coordinates[0][0][0],
                addLegendToPlan = true;

            //Remove previous plan layers
            if(!(typeof plano == 'undefined')) {
                plano.remove();
                addLegendToPlan = false;
            }

            var planOptions = {
                center: L.latLng(coordenadas[1], coordenadas[0]),
                zoom: 20,
                maxZoom: 21,
                minZoom: 19,
                maxBounds: L.geoJson(data).getBounds()
            };

            plano = new L.map('plan',planOptions).setView([coordenadas[1],coordenadas[0]],20);

            L.geoJson(data, {
                style: function (feature) {
                    var et_id = feature.properties.et_id;
                    //Remark last search room
                    if (typeof(localStorage.lastSearch) != 'undefined'){
                        if (feature.properties.et_id == localStorage.lastSearch) return {color: "black"};
                    }
                },
                onEachFeature: function(feature, layer){
                    onEachFeature(feature, layer, createModal);
                }
            }).addTo(plano);

            updatePOIs(plano, sharedProperties);

            callback(plano, addLegendToPlan);
        }

        //Funcion que gestiona cada una de las capas de GeoJSON
        function onEachFeature(feature, layer, createModal) {
            layer.on({
                click: whenClicked,
                contextmenu: function(e){
                    createModal(e);
                }
            });
        }

        //Funcion que dada la estancia seleccionada, muestra la informacion relativa
        function whenClicked(e) {

            var id = e.target.feature.properties.et_id;

            infoService.getInfoEstancia(id).then(
                function (data) {
                    if (data == null) {
                        console.log("There's no info on room ", id);
                        var errorMsg = '<div class="text-center">No se dispone de información<br>';
                        errorMsg += 'sobre la estancia seleccionada</div>';
                        showInfoPopup('¡Aviso!', errorMsg);
                    } else {
                        $scope.infoEstancia = data;
                        console.log("infoEstancia",data);
                        var html_list = '<div><ul class="list-group">';
                        var html_list_items = '<li class="list-group-item">'+data.ID_espacio+'</li>';
                        html_list_items += '<li class="list-group-item">'+data.ID_centro+'</li>';
                        html_list = html_list + html_list_items + '</ul></div>';
                        var html_button = '<div class="info-btn-div"><button value="'+data.ID_espacio+'" class="button button-small button-positive" onclick="informacionEstancia(this)">'+$scope.translation.MASINFO+' </button></div>';
                        var html =  html_list + html_button;
                        e.layer.bindPopup(html).openPopup();
                    }
                },
                function(err){
                    console.log("Error on getInfoEstancia", err);
                    var errorMsg = '<div class="text-center">Ha ocurrido un error recuperando<br>';
                    errorMsg += 'la información del espacio</div>';
                    showInfoPopup('¡Error!', errorMsg);
                }
            );
        }

        //Function que añade la leyenda al plano
        function addLegend(plano, callback) {
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
            legend.addTo(plano);
            callback();
        }
    }

    //Add markers for every POI
    function updatePOIs(plano, sharedProperties) {
        var building = localStorage.building.indexOf('building') == -1 ? localStorage.building : JSON.parse(localStorage.building).building,
            floor = localStorage.planta,
            markers = [];

        poisService.getRoomPOIs(building, floor).then(
            function(pois) {
                console.log("Get room POIs success",pois);
                pois.forEach(function(poi){
                    var iconClass = $.grep(APP_CONSTANTS.pois, function(e) { return e.value == poi.category })[0].class;
                    var poiLabel = $.grep(APP_CONSTANTS.pois, function(e) { return e.value == poi.category })[0].label;
                    var icon = L.divIcon({className: iconClass});

                    var html = '<div class="text-center">';
                    html += '<b>Categoría:</b> '+poiLabel+'</br>';
                    html += '<b>Comentarios:</b> '+poi.comments+'</div>';
                    html += '<div class="edit-btn-div">';
                    html += '<button class="button button-small button-positive button-edit-poi" onclick="editPOI()" data-id="'+poi.id+'">Editar</button></div>';
                    var marker = new L.marker([poi.latitude, poi.longitude], {icon: icon})
                    markers.push(marker);
                    marker.addTo(plano)
                    marker.bindPopup(html);
                });

                sharedProperties.getLastMarkers().forEach(function(marker){
                    plano.removeLayer(marker);
                });

                sharedProperties.setLastMarkers(markers);
            },
            function(err){
                console.log("Error on getRoomPOIs", err);
                $ionicPopup.alert({
                    title: '¡Error!',
                    template: '<div class="text-center">Ha ocurrido un error recuperando<br>los puntos de interés</div>'
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
