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


        function activate () {
            var promises = [getPeople(), getListings()];
            return $q.all(promises).then(function () {
                logger.info('Activated Dashboard View');
                loadMap();
                logger.info('Map loaded');
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

        function getListings () {
            return dataservice.getListings().then(function (listings) {
                vm.listings = listings;
                vm.messageCount = vm.listings.count();
                //vm.neighbourhoodCount = listings.find({$distinct: {'properties.neighbourhood_cleansed': 1}}).count();
                //vm.neighbourhoodCount = listings.uniq('properties.neighbourhood_cleansed').count;
                return vm.listings;
            })
        }

        function loadMap () {
            vm.map = {
                center: {
                    latitude: 37.9908996,
                    longitude: 23.7032341
                },
                zoom: 13,
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
                    google.maps.event.addListener( inst.map , 'idle' , function(){
                        var swLat = inst.map.getBounds().getSouthWest().lat(),
                        swLng = inst.map.getBounds().getSouthWest().lng(),
                        neLat = inst.map.getBounds().getNorthEast().lat(),
                        neLng = inst.map.getBounds().getNorthEast().lng();
                        vm.visibleListings =
                            vm.listings.chain().where(
                                function(obj){
                                    return obj.geometry.coordinates[0] < neLng && obj.geometry.coordinates[0] > swLng && obj.geometry.coordinates[1] < neLat && obj.geometry.coordinates[1] > swLat;
                                }).offset(10).limit(10).data();
                        console.log(vm.visibleListings.length);
                    });
                });
            });

        }

    }
})();

