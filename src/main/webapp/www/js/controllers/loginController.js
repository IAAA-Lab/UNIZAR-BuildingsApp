/**************************************************************************
 * LoginCtrl: Controlador encargado del inicio de sesión de un usuario
 ***********************************************************************/

UZCampusWebMapApp.controller('LoginCtrl', function($scope, $rootScope, $timeout,
  $ionicLoading, $ionicPopup, $cordovaCamera, $window, $ionicSideMenuDelegate, infoService,
  photosService, translationService, loginService, APP_CONSTANTS){

  $ionicSideMenuDelegate.canDragContent(true);
  $scope.data = {};

  $scope.login = function() {
    var nombre = $scope.data.username;
    loginService.postLogin($scope.data.username, $scope.data.password)
      .then(function(data) {

        // Login successful
        $window.location = '#/app/home';
        $ionicLoading.show({ template: 'Bienvenido ' + nombre , noBackdrop: true, duration: 3000});
      },
      function(data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
    };
});
