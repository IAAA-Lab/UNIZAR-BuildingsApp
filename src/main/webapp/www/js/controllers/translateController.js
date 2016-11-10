/**************************************************************************
 * TopCtrl: Controlador encargado de la traducción de la aplicación
 ***********************************************************************/

UZCampusWebMapApp.controller('TranslationCtrl',['$scope', 'translationService', 'sharedProperties',
        function ($scope, translationService, sharedProperties){

            //Run translation if selected language changes
            $scope.translate = function(){
                translationService.getTranslation($scope, $scope.selectedLanguage);
            };

            $scope.changeLanguage = function (langKey) {
                console.log(langKey);
                $scope.selectedLanguage = langKey;
                localStorage.selectedLanguage = langKey;
                $scope.translate();
            };

            //Init
            if (!localStorage.selectedLanguage) {
                $scope.selectedLanguage = 'es';
                localStorage.selectedLanguage = 'es';
            } else {
                $scope.selectedLanguage = localStorage.selectedLanguage;
            }
            $scope.translate();
        }
    ]);