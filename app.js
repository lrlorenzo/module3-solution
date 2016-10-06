(function() {
    'use strict';

    angular.module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService)
      .directive('foundItems', FoundItemsDirective)
      .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

      function FoundItemsDirective () {
        var ddo = {
          templateUrl: 'foundItems.html',
          scope: {
            items: '<',
            onRemove:'&'
          }
          ,
          controller: FoundItemsDirectiveController,
          controllerAs: 'list',
          bindToController: true
        };
        return ddo;
      }

      function FoundItemsDirectiveController () {
          var controller = this;
          console.log(controller);

          controller.notFound = function () {

            if (controller.items !== undefined && controller.items.length === 0) {
              return true;
            }

            return false;
          };

      }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var controller = this;

      controller.searchTerm = "";

      controller.getMatchedMenuItems = function() {
        console.log("controller");

        var promise = MenuSearchService.getMatchedMenuItems(controller.searchTerm);
        promise.then(function (response) {
          controller.found = response;
          console.log("Controller: " + controller.found.length);
        }).catch(function (error) {
          console.log("Error: " + error);
        });
      }

      controller.removeItem = function(itemIndex) {
        controller.found.splice(itemIndex, 1);
      }

    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath']
    function MenuSearchService($http, ApiBasePath) {
      var service = this;

      service.getMatchedMenuItems = function(searchTerm) {

        console.log("Searching[" +  searchTerm + "]");

        return $http({
          method: "GET",
          url: (ApiBasePath + "/menu_items.json")
        }).then(function (result) {
          var foundItems = [];
          for (var i in result.data.menu_items) {
            var item = result.data.menu_items[i];
            if (searchTerm !== "" && item.description.toLowerCase().indexOf(searchTerm)  >= 0) {
              foundItems.push(item);
            }
          }
          console.log("Returning[" + foundItems.length + "]");
          return foundItems;
        });
      }
    }
})();
