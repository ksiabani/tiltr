(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$q', '$scope', 'dataservice', 'logger', 'uiGmapGoogleMapApi', 'uiGmapIsReady'];
    /* @ngInject */
    function DashboardController($q, $scope, dataservice, logger, uiGmapGoogleMapApi, uiGmapIsReady) {
        var vm = this;
        vm.news = {
            title: 'Tiltr',
            description: 'Hot Towel Angular is a SPA template for Angular developers.'
        };
        vm.messageCount = 0;
        vm.people = [];
        vm.title = 'Dashboard';

        vm.pgCurrentPage = 1;
        vm.pgMaxSize = 5;
        vm.pgItemsPerPage = 10;
        vm.pgTotalItems = 0;
        vm.createMarkers = createMarkers;

        activate();


        function activate() {
            var promises = [getListings()];
            return $q.all(promises).then(function () {
                logger.info('Activated Dashboard View');
                loadMap();
                logger.info('Map loaded');
                createMarkers();
                logger.info('Markers loaded');
            });
        }

        //function getMessageCount () {
        //    return dataservice.getMessageCount().then(function (data) {
        //        vm.messageCount = data;
        //        return vm.messageCount;
        //    });
        //}

        //function getPeople () {
        //    return dataservice.getPeople().then(function (data) {
        //        vm.people = data;
        //        return vm.people;
        //    });
        //}

        function getListings() {
            return dataservice.getListings().then(function (listings) {
                vm.listingsCollection = listings;
                vm.listings = listings.find();
                vm.pgTotalItems = listings.count();
                return vm.listingsCollection;
            })
        }

        function loadMap() {
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

            vm.markers = [];

            uiGmapGoogleMapApi.then(function (maps) {
                // not using this yet
            });

            uiGmapIsReady.promise(1).then(function (instances) {
                instances.forEach(function (inst) {
                    google.maps.event.addListener(inst.map, 'idle', function () {
                        var swLat = inst.map.getBounds().getSouthWest().lat(),
                            swLng = inst.map.getBounds().getSouthWest().lng(),
                            neLat = inst.map.getBounds().getNorthEast().lat(),
                            neLng = inst.map.getBounds().getNorthEast().lng();
                        vm.visibleListings = vm.listingsCollection.where(
                            function (obj) {
                                var inBounds = obj.geometry.coordinates[0] < neLng && obj.geometry.coordinates[0] > swLng && obj.geometry.coordinates[1] < neLat && obj.geometry.coordinates[1] > swLat;
                                return inBounds;
                            });
                        //console.log(vm.visibleListings);
                        vm.listings = vm.visibleListings;
                        vm.pgTotalItems = vm.visibleListings.length;
                        createMarkers();
                    });
                });
            });

        }

        function createMarkers () {
            vm.markers = [];
            angular.forEach(vm.listings.splice(1*vm.pgCurrentPage,10), function (listing) {
                this.push(
                    {
                        latitude: listing.geometry.coordinates[1],
                        longitude: listing.geometry.coordinates[0],
                        title: listing.properties.name,
                        id: listing.properties.id
                    }
                );
            }, vm.markers);
        }

    }
})();

