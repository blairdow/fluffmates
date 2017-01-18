(function(){
     angular.module('fluffMates')
        .controller('PetsCtrl', PetsCtrl)
        .controller('AccountCtrl', AccountCtrl)
        .controller('SearchCtrl', SearchCtrl)
        .controller('LoginCtrl', LoginCtrl)
        .controller('RegisterCtrl', RegisterCtrl)

    PetsCtrl.$inject = ['$http', 'PetsData', '$ionicModal', '$scope', 'userDataService', 'authService', '$timeout']
    AccountCtrl.$inject = ['PetsData', 'userDataService', '$state', 'authService', '$ionicModal', '$scope', '$timeout', '$ionicPopup']
    SearchCtrl.$inject = ['PetsData', '$state', 'userDataService', 'authService']
    LoginCtrl.$inject = ['authService', '$state', '$timeout']
    RegisterCtrl.$inject = ['$http', 'authService', 'authToken', '$state', '$timeout']

    function PetsCtrl($http, PetsData, $ionicModal, $scope, userDataService, authService, $timeout) {
        var vm = this
        vm.pets = PetsData.pets
        vm.petsData = PetsData
        if (authService.isLoggedIn()){
          authService.setUser()
        }
        vm.user = userDataService.user

        vm.showPet = {}
        vm.chosenPets = PetsData.chosenPets

        vm.checkChosen = function(pet){
            var petIDs = vm.chosenPets.map(function(pett){
                return pett.pet_id
            })

            if(petIDs.indexOf(pet.id.$t) > -1){
                return true
            }
            else if(petIDs.indexOf(pet.id.$t) < 0) {
              return false
            }
        }

        vm.choosePet = function(pet){
            PetsData.choosePet(pet, vm.user)
            vm.chosenPets = PetsData.chosenPets
            vm.user.chosenPets = vm.chosenPets
        }

        vm.removePet = function(pet){
            vm.chosenPets.splice(vm.chosenPets.indexOf(pet), 1)
            vm.user.chosenPets = vm.chosenPets
            userDataService.update(vm.user._id, vm.user)
        }

        vm.showPetInfo = function(pet){
            vm.showPet = pet

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
            $timeout(function(){
                vm.modal.remove()
            }, 4000)
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
            vm.chosenPetsModal.hide()
            $timeout(function(){
                vm.chosenPetsModal.remove()
            }, 4000)
        }
    }

    function AccountCtrl (PetsData, userDataService, $state, authService, $ionicModal, $scope, $timeout, $ionicPopup) {
        var vm = this
        if (authService.isLoggedIn()){
          authService.setUser()
        }
        vm.user = userDataService.user
        vm.isLoggedIn = authService.isLoggedIn;

        vm.chosenPets = PetsData.chosenPets

        vm.editModal = function(){

            if(vm.modal) {vm.modal.remove()}

            $ionicModal.fromTemplateUrl('./templates/edit-user-modal.html', {
              scope: $scope,
              animation: 'slide-in-up'
            })
            .then(function(modal){
              vm.modal = modal
              vm.modal.show()
            })
        }

        vm.closeEditModal = function(){
            vm.modal.hide()
            $timeout(function(){
                vm.modal.remove()
            }, 4000)
        }

        vm.editUser = function(){
            userDataService.update(vm.user._id, vm.user)
            .then(function(res){
              vm.user = userDataService.user
              vm.closeEditModal()

            })
        }

        vm.logout = function(){
            authService.logout()
        }

        vm.removePet = function(pet){
            vm.chosenPets.splice(vm.chosenPets.indexOf(pet), 1)
            vm.user.chosenPets = vm.chosenPets
            userDataService.update(vm.user._id, vm.user)
        }

        vm.sendPetsPopup = function(){
            $ionicPopup.alert({
                title: 'Your future fur babies are on their way!',
                templateUrl: './templates/sending-pets.html',
                okType: 'button-royal'
            })
        }

    }

    function RegisterCtrl ($http, authService, authToken, $state, $timeout){
      var vm = this
      vm.newUser = {}
      vm.message = {}

      vm.createUser = function() {
          $http.post('https://guarded-shelf-13715.herokuapp.com/users', vm.newUser)
          .then(function(res){
            if(!res.data.error){
              authToken.setToken(res.data.token)
              authService.setUser()
              vm.newUser = {}
              $state.go('tab.search')
            }
            else {
              vm.message.error = res.data.error;
              $timeout(function(){
                vm.message = {};
              }, 3000)
            }
          })
        }

      vm.go = function(state){
          $state.go(state)
      }

    }

    function LoginCtrl(authService, $state, $timeout){
      var vm = this
      vm.isLoggedIn = authService.isLoggedIn;
      vm.loginData = {}
      vm.message = {}

      if(vm.isLoggedIn == true){
        $state.go('tab.search')
      }

      vm.login = function(){
          authService.login(vm.loginData.email, vm.loginData.password)
            .then(function(res) {
              vm.loginData = {}
              if(!res.data.error){
                $state.go('tab.search');
              }
              else {
                vm.message.error = res.data.error;
                $timeout(function(){
                  vm.message = {};
                }, 3000)
              }
              console.log(res)
            });
        }

      vm.go = function(state){
          $state.go(state)
      }
    }

    function SearchCtrl (PetsData, $state, userDataService, authService) {
        var vm = this
        vm.data = {}
        if (authService.isLoggedIn()){
          authService.setUser()
        }
        vm.user = userDataService.user
        vm.message = {}

        vm.sendSearch = function(){
            PetsData.pets.length = 0
            PetsData.getPets(vm.data)
            .then(function(res){
              if(res){
                  console.log(res)
              }
            })
            vm.data = {}
            $state.go('tab.pets')
        }
    }

})()
