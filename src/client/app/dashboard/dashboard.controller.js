(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$q', '$scope', 'dataservice', 'logger', 'uiGmapGoogleMapApi', 'uiGmapIsReady'];
    /* @ngInject */
    function DashboardController ($q, $scope, dataservice, logger, uiGmapGoogleMapApi, uiGmapIsReady) {
        var vm = this;
        vm.news = {
            title: 'Tiltr',
            description: 'Hot Towel Angular is a SPA template for Angular developers.'
        };
        vm.messageCount = 0;
        vm.people = [];
        vm.title = 'Dashboard';

        activate();
        loadMap();

        function activate () {
            var promises = [getMessageCount(), getPeople()];
            return $q.all(promises).then(function () {
                logger.info('Activated Dashboard View');
            });
        }

        function getMessageCount () {
            return dataservice.getMessageCount().then(function (data) {
                vm.messageCount = data;
                return vm.messageCount;
            });
        }

        function getPeople () {
            return dataservice.getPeople().then(function (data) {
                vm.people = data;
                return vm.people;
            });
        }

        function loadMap () {
            vm.map = {
                center: {
                    latitude: 37.9872089,
                    longitude: 23.76585298
                },
                zoom: 15,
                bounds: {}
            };

            vm.options = {
                scrollwheel: true
            };

            uiGmapGoogleMapApi.then(function (maps) {
                // not using this yet
            });

            uiGmapIsReady.promise(1).then(function (instances) {
                instances.forEach(function (inst) {
                    inst.map.data.loadGeoJson('/src/client/listings.geojson');
                });
            });

        }

    }
})();

