(function(){
  "use strict";
  
    angular.module('fluffMates')
    .factory('PetsData', PetsData)

  function PetsData() {
      
      this.data = {
        method: 'pet.find',
        animal: 'smallfurry',
        location: '90013'
      }
      
      return this.data;
    }
})()
