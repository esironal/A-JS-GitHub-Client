angular.module('GithubClient', ['ngRoute'])
    
    //Service for profile data
    .service('ProfileData', function() {
        
        var profile_service_data = {};

        return {
            getData: function() {
                return profile_service_data;
            },
            setData: function(data) {
                profile_service_data = data;
            }
        }
    })

    //Config
    .config(function($routeProvider) {
        
        $routeProvider
            .when('/', {
                controller: 'LoginController',
                templateUrl: 'partials/login.html'    
            })
            .when('/profile', {
                controller: 'ProfileController',
                templateUrl: 'partials/profile.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    })

    //Login Controller
    .controller('LoginController', ['$scope', '$http', '$location', 'ProfileData', function ($scope, $http, $location, ProfileData) {
        
        $scope.FetchProfileData = function() {

            $http.get("https://api.github.com/users/" + $scope.username)

            .success( function (data, status, headers, config) {

                $scope.profile_data = data;

                ProfileData.setData(data);
                
                $location.path('/profile');

            })

            .error( function (data, status, headers, config) {
                console.log(data, status);
            });

        };

    }])
    
    //Profile Controller
    .controller('ProfileController', ['$scope', '$http', 'ProfileData', function ($scope, $http, ProfileData) {
        $scope.profile_data = ProfileData.getData();
        
        console.log($scope.profile_data);

    }]);