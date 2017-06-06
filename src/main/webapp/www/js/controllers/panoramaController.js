UZCampusWebMapApp.controller('PanoramaCtrl', function($scope, $rootScope, $timeout,
    $ionicLoading, $ionicPopup, $cordovaCamera, $state, $window, $stateParams,
    $http, $ionicSideMenuDelegate, notificationService, APP_CONSTANTS){

    $ionicSideMenuDelegate.canDragContent(false);

    //This code will be executed every time the controller view is loaded
    $scope.$on('$ionicView.beforeEnter', function(){

      $scope.dimensions = $scope.calculateDimensions();

      // Carga la imagen del cambio seleccionado
      notificationService.getPanorama('CRE.1200.02.180.jpg')
        .then(function(data) {

          var tempImage = new Image();
          tempImage.src = 'data:image/jpg;base64,' + data;
          tempImage.onload = function() {
              var resizedImage = $scope.resizeImage(tempImage.width, tempImage.height);
              imageWidthHeight = 'width="' + resizedImage.width + '" height="' + resizedImage.height + '"';
              $("#imageDiv").html('<img src="' + tempImage.src + '"'+imageWidthHeight+'></img>');
              $scope.panoramaImage = tempImage.src;

              // Crea el panorama con las dimensiones adecuadas
              $scope.createPSV();
              // $scope.PSV.getNavbarButton('gyroscope').show();
              // console.log($scope.PSV.getNavbarButton('gyroscope'));
              console.log("PANO SIZE: " + JSON.stringify($scope.PSV.getSize()));
          };
      });
    });

    $scope.createPSV = function() {
      var div = document.getElementById("container");

      // Define los parámetros para visualizar la imagen panoramica
      $scope.PSV = new PhotoSphereViewer({
        panorama: $scope.panoramaImage,
        // panorama: 'http://tassedecafe.org/wp-content/uploads/2013/01/parc-saint-pierre-amiens.jpg',
        container: div,
        time_anim: 3000,
        size: {
          width:'100%',
          // height:'500px'
          // height: $scope.panoramaSize.height
          height: $window.innerHeight - 44
        },
        navbar: true,
        navbar_style: {
          background_color: 'rgba(58, 67, 77, 0.7)'
        },
        gyroscope: true,
        move_inertia: false
        // caption: "Esto es una imagen panorámica de prueba :D"
      });
    };

    //Calculates image dimensions based on device dimensions
    $scope.calculateDimensions = function() {
        return {
            "width": $window.innerWidth,
            "height": $window.innerHeight-150
        };
    };

    $scope.resizeImage = function(width, height) {
        var maxWidth = $scope.dimensions.width,
            maxHeight = $scope.dimensions.height,
            ratio = Math.min(maxWidth / width, maxHeight / height);

            console.log("Window dimensions: width: " + maxWidth + ". height: " + maxHeight);
            console.log(width + "-" + height + "-" + ratio);

        return {
            width: width*ratio,
            height: height*ratio
        };
    };

    // // Starts the panorama
    // $scope.panoramaImage = 'photos/CRE.1200.02.180.jpg';
    // $scope.dimensions = $scope.calculateDimensions();
    //
    // var imagen = new Image();
    // imagen.src = $scope.panoramaImage;
    // imagen.onload = function() {
    //   $scope.panoramaSize = $scope.resizeImage(imagen.width, imagen.height);
    //
    //   // Crea el panorama con las dimensiones adecuadas
    //   $scope.createPSV();
    //   console.log("PANO SIZE: " + JSON.stringify($scope.PSV.getSize()));
    // };

});
