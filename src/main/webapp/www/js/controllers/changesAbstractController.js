UZCampusWebMapApp.controller('ChangesAbstractCtrl', function($scope, $rootScope, $timeout,
    $ionicLoading, $ionicPopup, $cordovaCamera, $state, $window, $ionicScrollDelegate,
    $http, $ionicSideMenuDelegate, infoService, photosService,translationService, loginService,
    notificationService, changeInfoService, APP_CONSTANTS){

    $ionicSideMenuDelegate.canDragContent(true);

  $scope.setStatusShown = function(estado) {
    changeInfoService.setEstado(estado);
  };

  $scope.badgeCount = function(estado) {
    return changeInfoService.getNumCambiosNuevos(estado);
  };
});
