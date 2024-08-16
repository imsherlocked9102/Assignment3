(function(){
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItems)
    .constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com');

  function FoundItems() {
    var ddo = {
      restrict: 'E',
      templateUrl: 'founditems.html',
      scope: {
        foundItems: '<',
        onRemove: '&'
       },
      controller: NarrowItDownController,
      controllerAs: 'narrowCtrl',
      bindToController: true
    };

    return ddo;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var narrow = this;
    narrow.query = '';
    narrow.foundItems = [];

    narrow.found = function() {
      var promise = MenuSearchService.getMatchedMenuItems(narrow.query);
      promise.then(function (data) {
        narrow.foundItems = data;
        // if (data.toString() === ""){
        //   narrow.empty = true;
        // } else {
        //   narrow.empty = false;
        // }
      });
    };

    narrow.onRemove = function (index) {
      narrow.foundItems.splice(index, 1)
    }
  }

  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function(searchTerm) {
      return $http({
        method: 'GET',
        url: (ApiBasePath + '/menu_items.json')
      }).then(function (result) {
          var foundItems = SearchItems(result, searchTerm);
          // debugger;
          if( foundItems.toString() === "" ) {
            foundItems=[{short_name:'Nothing Found', name:'',description:''}];
          }
          // return processed items
          return foundItems;
      });

      function SearchItems(result, searchTerm) {
        if( $.trim(searchTerm) === '' ) {
          return result.data.menu_items;
        } else {
          var filtered_results = [];
          $.each(result.data.menu_items, function(i,val){
            var regex = new RegExp(searchTerm, 'i');
            if( val.description.match(regex) ) {
              filtered_results.push(val);
            }
          });
          return filtered_results;
        }
      }
    }
  }
})();
