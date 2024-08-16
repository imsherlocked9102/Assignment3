(function() {
  'use strict';
  angular
    .module('NarrowItDownApp')
    .service('MenuSearchService', MenuSearchService)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];

    function MenuSearchService($http, ApiBasePath) {
      var service = this;

      service.getAllItems = function() {
        var response = $http({
          method: 'GET',
          url: ApiBasePath + '/menu_items.json'
        });

        return response;
      };

      service.getMatchedMenuItems = function(searchTerm) {
        return $http({
          method: 'GET',
          url: ApiBasePath + '/menu_items.json'
        }).then(function (result) {
            // process result and only keep items that match
            var foundItems = [];
            angular.forEach(result.data.menu_items, function(value, key) {
              if(value.description.indexOf(searchTerm) != -1) {
                foundItems.push(value);
              }
            });

            return foundItems;
        });
      };
    }
})();
