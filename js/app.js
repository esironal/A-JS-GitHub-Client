angular.module('GithubClient', ['ngRoute'])


    //=========================
    // Service for profile data
    //=========================

    .service('ProfileData', function() {

        var profile_service_data = {};
        var user_name = "";
        var repository_list = {};
        var repository_info = {};
        var repository_languages = {};
        var commit_activity = {};

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
            },
            getRepositoryInfo: function() {
                return repository_info;
            },
            setRepositoryInfo: function(repo_info) {
                repository_info = repo_info;
            },
            getRepositoryLanguages: function() {
                return repository_languages;
            },
            setRepositoryLanguages: function(repo_langs) {
                repository_languages = repo_langs;
            },
            getCommitActivity: function() {
                return commit_activity;
            },
            setCommitActivity: function(commits) {
                commit_activity = commits;
            }
        }
    })


    //======================
    // Config
    //======================

    .config(function($routeProvider) {

        $routeProvider
            .when('/', {
                controller: 'LoginController',
                templateUrl: 'partials/login.html'    
            })
            .when('/profile/:username', {
                controller: 'ProfileController',
                templateUrl: 'partials/profile.html'
            })
            .when('/repositories/:username', {
                controller: 'RepositoryListController',
                templateUrl: 'partials/repositories.html'
            })
            .when('/repository/:username/:repository_name', {
                controller: 'RepositoryController',
                templateUrl: 'partials/repository.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    })


    //======================
    // Landing page
    //======================

    .controller('LoginController', function ($scope, $http, $location, ProfileData) {

        //Fetch Profile Data
        //------------------
        $scope.FetchProfileData = function() {

            //Reset the request-error string
            $scope.profileRequestError = null;

            //Show loader
            $scope.loader_active = true;

            //Save username in service
            ProfileData.setUser($scope.username);

            //Fetch profile
            $http.get("https://api.github.com/users/" + $scope.username)

            .success( function (data, status, headers, config) {

                $scope.profile_data = data;

                ProfileData.setData(data);

                $location.path('/profile/' + $scope.username);

                //Hide loader
                $scope.loader_active = false;

                console.log(data, status);

            })

            .error( function (data, status, headers, config) {
                console.error(status, "profile fetch error", headers);
                $scope.profileRequestError = "Error Fetching profile info.";

                //Hide loader
                $scope.loader_active = false;
            });

        };

    })


    //======================
    // Profile page
    //======================

    .controller('ProfileController', function ($scope, $http, $location, $routeParams, ProfileData) {

        $scope.profile_data = ProfileData.getData();
        $scope.username = ProfileData.getUser();


        //Code to fetch the Profile Data if the profile page is refreshed
        //---------------------------------------------------------------
        $scope.FetchProfileData = function() {

            //Save username in service
            ProfileData.setUser($scope.username);


            $http.get("https://api.github.com/users/" + $scope.username)

            .success( function (data, status, headers, config) {

                $scope.profile_data = data;

                ProfileData.setData(data);

                $location.path('/profile/' + $scope.username);

                console.log(data, status);

            })

            .error( function (data, status, headers, config) {
                console.error(status, "profile fetch error", headers);
                $scope.profileRequestError = "Error Fetching profile info.";

                //$location.path("/");
            });

        };


        //Check whether the same user-profile needs to be fetched again or whether a new profile needs to be fetched    
        //----------------------------------------------------------------------------------------------------------
        if( $scope.username == "" ) {
            $scope.username = $routeParams.username;
            $scope.FetchProfileData();
        } else if( $scope.username !== $routeParams.username ) {
            $scope.username = $routeParams.username;
            $scope.FetchProfileData();
        }


        //Code to fetch the repository list
        //---------------------------------
        $scope.ShowRepositoryList = function() {

            $http.get("https://api.github.com/users/" + $scope.username + "/repos")

            .success( function (data, status, headers, config) {

                //save repository list in service
                ProfileData.setRepositoryList(data);

                //console.log(data);
                $location.path('/repositories/' + $scope.username);

            })

            .error( function (data, status, headers, config) {
                console.error(data, status, "repository-list fetch error");
            });
        }

    })


    //======================
    // Repository List page
    //======================

    .controller('RepositoryListController', function ($scope, $http, $location, $routeParams, ProfileData) {

        $scope.profile_data = ProfileData.getData();
        $scope.repository_list = ProfileData.getRepositoryList();
        //console.log($scope.repository_list);

        $scope.username = ProfileData.getUser();
    
        //Fetch Repository Information
        $scope.OpenRepostoryDetails = function(name) {
            
            $http.get("https://api.github.com/repos/" + $scope.username + "/" + name )
            
            .success( function (data, status, headers, config) {
                
                ProfileData.setRepositoryInfo(data);

                //Fetch the languages list
                $http.get(data.languages_url)
            
                .success( function (data, status, headers, config) {
                    
                    ProfileData.setRepositoryLanguages(data);

                    //Fetch commit activity
                    $http.get("https://api.github.com/repos/" + $scope.username + "/" + name + "/stats/commit_activity" )
            
                    .success( function (data, status, headers, config) {
                        
                        //console.log("Commits:");
                        //console.log(data);
                        ProfileData.setCommitActivity(data);

                        $location.path( "/repository/" + $scope.username + "/" + name );
                    })

                    .error( function (data, status, headers, config) {
                        console.log(data, status, "languages - fetch error");
                    });

                })

                .error( function (data, status, headers, config) {
                    console.log(data, status, "languages - fetch error");
                });
            })

            .error( function (data, status, headers, config) {
                console.log(data, status, "repository fetch error");
            });       
            
        }

    })


    //=========================
    // Repository details page
    //=========================

    .controller('RepositoryController', function ($scope, $http, $location, $routeParams, ProfileData) {

        $scope.profile_data = ProfileData.getData();
        $scope.repository_list = ProfileData.getRepositoryList();
        $scope.repo_info = ProfileData.getRepositoryInfo();

        $scope.username = $routeParams.username;
        $scope.repository_name = $routeParams.repository_name;
        
        //Get repo languages
        $scope.repository_languages = ProfileData.getRepositoryLanguages();
        ////console.log($scope.repository_languages);

        console.log($scope.repo_info);

        //Calculate language percentages
        $scope.language_total = 0;
        for(language in $scope.repository_languages) {
            $scope.language_total += $scope.repository_languages[language];
        }

        $scope.language_percentages = {};

        for(language in $scope.repository_languages) {
            $scope.language_percentages[language] = ($scope.repository_languages[language] / $scope.language_total) * 100;
            console.log(($scope.repository_languages[language] / $scope.language_total) * 100);
        }

        ////console.log($scope.language_percentages);
    
        //Get repo commits
        $scope.commits = ProfileData.getCommitActivity();
        ////console.log($scope.commits);
        
        //Add weekly commit count to array
        $scope.commits_weekly = [];
        $scope.timeline_start = 0;
        $scope.timeline_end = 0;

        for(var i = 0; i < $scope.commits.length; i++) {
            $scope.commits_weekly.push($scope.commits[i]["total"]);
            
            if(i === 0) {
                $scope.timeline_start = $scope.commits[i]["week"];
            } else if (i === ($scope.commits.length - 1)) {
                $scope.timeline_end = $scope.commits[i]["week"];
            }
        }

        ////console.log($scope.commits_weekly);
    
    
        //Create relative percentage values for the commit graph. 100% being the highest count value.
        $scope.highest_commits = 0;
    
        for(var i = 0; i < $scope.commits_weekly.length; i++) {
            
            if($scope.commits_weekly[i] > $scope.highest_commits) {
                $scope.highest_commits = $scope.commits_weekly[i];
            }
        }
        
        $scope.commits_weekly_percent = [];
    
        for(var i = 0; i < $scope.commits_weekly.length; i++) {
            $scope.commits_weekly_percent[i] = parseInt(($scope.commits_weekly[i] / $scope.highest_commits) * 100);
        }
    
        console.log($scope.commits_weekly_percent);
        
    });
