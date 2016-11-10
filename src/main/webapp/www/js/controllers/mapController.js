/**********************************************************************
 * MapCtrl: Controlador de Leaflet
 ***********************************************************************/

UZCampusWebMapApp.controller('MapCtrl',function($scope, $rootScope, geoService, infoService, sharedProperties) {

	//Map is created only once
  
	var map = geoService.crearMapa($scope, infoService);
  sharedProperties.setMap(map);

  //This code will be executed every time the controller view is loaded
	$scope.$on('$ionicView.beforeEnter', function(){ 
		//Check if the map view must be changed
    if (sharedProperties.getReloadMap() === true) {
    	geoService.centerMap(sharedProperties.getOption());
	  }
  });
});