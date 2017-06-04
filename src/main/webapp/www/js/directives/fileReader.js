UZCampusWebMapApp.directive('ngFileSelect', function($q, fileReader) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('change', function(e) {
        scope.file = (e.srcElement || e.target).files[0];

        console.log("NO FUNCIONA");

        // Reads the image as URL so it can be showed in html
        fileReader.readAsDataURL(scope.file, scope)
          .then(function(result) {

          console.log(scope.file);

          // Calls a method to resize preview image
          var index = scope.getCurrentChange();
          console.log("Indice: " + index);
          // scope.newImageData = result;
          // scope.cambios[scope.statusShown][index].imagen.src = result;
          // scope.addPhoto(scope.getCurrentChange());
          scope.setPreview(result, index);
        });
      });
    }
  };
});
