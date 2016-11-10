UZCampusWebMapApp.service('translationService', function($resource) {

    return ({
        getTranslation: getTranslation
    });

    function getTranslation($scope, language) {

        if (language === null || typeof(language)==='undefined') {
            language = 'es';
        }

        var languageFilePath = 'translations/translation_' + language + '.json';
        console.log("Language file path for "+language+" : "+languageFilePath);

        $resource(languageFilePath).get(function (data) {
            $scope.i18n = data;
        });
    };
});