angular.module('GithubClient', ['ngRoute'])
    
    //Service for profile data
    .service('ProfileData', function() {
        
        var profile_service_data = {};
        var user_name = "";
        var repository_list = {};

        return {
            getUser: function() {
                return user_name;
            },
            setUser: function(username) {
                user_name = username;
            },
            getData: function() {
                return profile_service_data;
            },
            setData: function(data) {
                profile_service_data = data;
            },
            getRepositoryList: function() {
                return repository_list;
            },
            setRepositoryList: function(repo_list) {
                repository_list = repo_list;
                console.log(repo_list);
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
            .when('/repositories', {
                controller: 'RepositoryListController',
                templateUrl: 'partials/repositories.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    })

    //Login Controller
    .controller('LoginController', ['$scope', '$http', '$location', 'ProfileData', function ($scope, $http, $location, ProfileData) {
        
        //Fetch Profile Data
        $scope.FetchProfileData = function() {
            
            //Save username in service
            ProfileData.setUser($scope.username);

            $http.get("https://api.github.com/users/" + $scope.username)

            .success( function (data, status, headers, config) {

                $scope.profile_data = data;

                ProfileData.setData(data);
                
                $location.path('/profile');

            })

            .error( function (data, status, headers, config) {
                console.log(data, status, "profile fetch error");
            });

        };

    }])

    //Profile Controller
    .controller('ProfileController', ['$scope', '$http', '$location', 'ProfileData', function ($scope, $http, $location, ProfileData) {
        
        $scope.profile_data = ProfileData.getData();
        $scope.username = ProfileData.getUser();
        
        //console.log($scope.profile_data);
        
        $scope.ShowRepositoryList = function() {
        
            $http.get("https://api.github.com/users/" + $scope.username + "/repos")

            .success( function (data, status, headers, config) {
                
                //save repository list in service
                ProfileData.setRepositoryList(data);
                //console.log(data);
                $location.path('/repositories');

            })

            .error( function (data, status, headers, config) {
                console.log(data, status, "repository-list fetch error");
            });
        }

    }])

    //Repository List Controller
    .controller('RepositoryListController', ['$scope', '$http', '$location', 'ProfileData', function ($scope, $http, $location, ProfileData) {
        
        $scope.profile_data = ProfileData.getData();
        $scope.repository_list = ProfileData.getRepositoryList();
        //console.log($scope.repository_list);

    }]);