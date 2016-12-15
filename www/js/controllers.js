(function(){
     angular.module('fluffMates')
        .controller('PetsCtrl', PetsCtrl)
        .controller('AccountCtrl', AccountCtrl)
        .controller('SearchCtrl', SearchCtrl)
        .controller('LoginCtrl', LoginCtrl)
        .controller('RegisterCtrl', RegisterCtrl)

    PetsCtrl.$inject = ['$http', 'PetsData', '$ionicModal', '$scope', 'userDataService', 'authService']
    AccountCtrl.$inject = ['PetsData', 'userDataService', '$state', 'authService']
    SearchCtrl.$inject = ['PetsData', '$state', 'userDataService', 'authService']
    LoginCtrl.$inject = ['authService', '$state']
    RegisterCtrl.$inject = ['$http', 'authService', 'authToken', '$state']

    function PetsCtrl($http, PetsData, $ionicModal, $scope, userDataService, authService) {
        var vm = this
        vm.pets = PetsData.pets
        authService.setUser()
        vm.user = userDataService.user

        console.log(vm.user)
        vm.showPet = {}
        vm.chosenPets = []

        vm.choosePet = function(pet){
            PetsData.choosePet(pet)
            vm.chosenPets = PetsData.chosenPets
        }

        vm.showPetInfo = function(pet){
          vm.showPet = pet
          console.log(vm.showPet)

          if(vm.modal) {vm.modal.remove()}

          $ionicModal.fromTemplateUrl('./templates/pet-show-modal.html', {
              scope: $scope,
              animation: 'slide-in-up'
          })
          .then(function(modal){
              vm.modal = modal
              vm.modal.show()
          })
        }
        
        vm.closeModal = function(){
            vm.modal.hide()
        }
        
        vm.showChosenPets = function(){
            if(vm.chosenPetsModal) {vm.chosenPetsModal.remove()}
            
            $ionicModal.fromTemplateUrl('./templates/chosen-pets-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            })
            .then(function(modal){
                vm.chosenPetsModal = modal
                vm.chosenPetsModal.show()
            })
        }
        
        vm.closeChosenModal = function(){
            console.log('closed')
            vm.chosenPetsModal.hide()
        }
    }

    function AccountCtrl (PetsData, userDataService, $state, authService) {
        var vm = this
        authService.setUser()
        vm.user = userDataService.user
        vm.isLoggedIn = authService.isLoggedIn;

        console.log('accounts page user', vm.user)
        vm.chosenPets = PetsData.chosenPets

        vm.choosePet = function(pet){
            PetsData.choosePet(pet)
        }
    }

    function RegisterCtrl ($http, authService, authToken, $state){
      var vm = this
      vm.newUser = {}

      vm.createUser = function() {
          console.log('clicked create', vm.newUser)
          $http.post('http://localhost:3000/users', vm.newUser)
          .then(function(res){
            console.log(res.data.token)
            authToken.setToken(res.data.token)
            authService.setUser()
            $state.go('tab.search')
          })
        }

    }

    function LoginCtrl(authService, $state){
      var vm = this
      vm.isLoggedIn = authService.isLoggedIn;
      vm.loginData = {}

      vm.login = function(){
          authService.login(vm.loginData.email, vm.loginData.password)
            .then(function(res) {
              console.log(res);
              $state.go('tab.account');
            });
        }

    }

    function SearchCtrl (PetsData, $state, userDataService, authService) {
        var vm = this
        vm.data = {}
        authService.setUser()
        vm.user = userDataService.user

        console.log('service', vm.user)

        vm.sendSearch = function(){
            PetsData.pets.length = 0
            PetsData.getPets(vm.data)
            vm.data = {}
            $state.go('tab.pets')
        }
    }

})()
