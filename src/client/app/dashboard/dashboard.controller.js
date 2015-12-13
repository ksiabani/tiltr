(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$q', 'dataservice', 'logger', 'uiGmapGoogleMapApi', '$scope'];
    /* @ngInject */
    function DashboardController($q, dataservice, logger, uiGmapGoogleMapApi, $scope) {
        var vm = this;
        vm.news = {
            title: 'tiltr',
            description: 'Hot Towel Angular is a SPA template for Angular developers.'
        };
        vm.messageCount = 0;
        vm.people = [];
        vm.title = 'Dashboard';


        activate();

        function activate() {
            var promises = [getMessageCount(), getPeople(), loadGoogleMaps()];
            return $q.all(promises).then(function () {
                logger.info('Activated Dashboard View');
            });
        }

        function getMessageCount() {
            return dataservice.getMessageCount().then(function (data) {
                vm.messageCount = data;
                return vm.messageCount;
            });
        }

        function getPeople() {
            return dataservice.getPeople().then(function (data) {
                vm.people = data;
                return vm.people;
            });
        }

        function loadGoogleMaps() {
            return uiGmapGoogleMapApi.then(function (maps) {

                vm.map = {center: {latitude: 37.9872089, longitude: 23.76585298 }, zoom: 17 };
                vm.options = {
                    scrollwheel: false,
                    zoomControl: true
                };


                var createRandomMarker = function(i, bounds, idKey) {
                    var lat_min = bounds.southwest.latitude,
                        lat_range = bounds.northeast.latitude - lat_min,
                        lng_min = bounds.southwest.longitude,
                        lng_range = bounds.northeast.longitude - lng_min;

                    if (idKey == null) {
                        idKey = "id";
                    }

                    var latitude = lat_min + (Math.random() * lat_range);
                    var longitude = lng_min + (Math.random() * lng_range);
                    var ret = {
                        latitude: latitude,
                        longitude: longitude,
                        title: 'm' + i
                    };
                    ret[idKey] = i;
                    return ret;
                };
                vm.randomMarkers = [];
                var markers = [];
                for (var i = 0; i < 50; i++) {
                    markers.push(createRandomMarker(i, vm.map.bounds))
                }
                vm.randomMarkers = markers;
                // Get the bounds from the map once it's loaded
                //$scope.$watch(function() {
                //    return vm.map.bounds;
                //}, function(nv, ov) {
                //    // Only need to regenerate once
                //    if (!ov.southwest && nv.southwest) {
                //        var markers = [];
                //        for (var i = 0; i < 50; i++) {
                //            markers.push(createRandomMarker(i, vm.map.bounds))
                //        }
                //        vm.randomMarkers = markers;
                //    }
                //}, true);


            });
        }
    }
})();

