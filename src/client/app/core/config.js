(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var config = {
        appErrorPrefix: '[tiltr Error] ',
        appTitle: 'tiltr'
    };

    core.value('config', config);

    core.config(configure);

    configure.$inject = ['$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider', 'uiGmapGoogleMapApiProvider'];
    /* @ngInject */
    function configure($logProvider, routerHelperProvider, exceptionHandlerProvider, uiGmapGoogleMapApiProvider) {
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        exceptionHandlerProvider.configure(config.appErrorPrefix);
        routerHelperProvider.configure({docTitle: config.appTitle + ': '});
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyDn2J5CjxvFC4sG3jtPgNysSAQghM75Q3k',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather, geometry, visualization, places'
            //libraries: 'places'
        });
    }

})();
