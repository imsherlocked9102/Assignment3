(function() {
  'use strict';
  angular
    .module('NarrowItDownApp')
    .controller('NarrowItDownController', NarrowItDownController);

    NarrowItDownController.$inject = ['MenuSearchService'];

    function NarrowItDownController(MenuSearchService) {
      var narrowIt = this;
      var promise = MenuSearchService.getAllItems();

      promise.then(function(response) {
        narrowIt.items = response.data.menu_items;
      });

      narrowIt.getMatches = function(searchTerm) {
        MenuSearchService.getMatchedMenuItems(searchTerm).then(function(result) {
          narrowIt.found = result;
        })
      };

      narrowIt.removeItem = function(elemIndex) {
        narrowIt.found.splice(elemIndex, 1);
      }

    }
})();
