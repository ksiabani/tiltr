(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$http', '$q', 'exception', 'logger'];
    /* @ngInject */
    function dataservice($http, $q, exception, logger) {
        var service = {
            getPeople: getPeople,
            getMessageCount: getMessageCount,
            getListings: getListings
        };

        return service;

        function getMessageCount() { return $q.when(72); }

        function getPeople() {
            return $http.get('/api/people')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {
                return exception.catcher('XHR Failed for getPeople')(e);
            }
        }

        function getListings () {
            //var mainInfo = null;
            return $http.get('/src/client/listings.geojson')
                .then(success)
                .catch(fail);

                function success (response) {
                    return response.data;
                }

                function fail (e) {
                    return exception.catcher('Something went wrong while retrieving listings')(e);
                }
                //
                //.success(function(data) {
                //mainInfo = data;
            //});
        }
    }
})();
