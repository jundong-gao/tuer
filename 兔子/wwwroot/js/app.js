var routerApp = angular.module('routerApp',['ui.router','regApp','loginApp']);

routerApp.run(function($rootScope , $state , $stateParams){
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
})

// 设置路由
routerApp.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/index');

    $stateProvider
        .state('index',{
            url : '/index',
            views : {
                '':{
                    templateUrl : 'templates/index.html'
                }
            }
        })
        .state('reg',{
            url: '/reg',
            views : {
                '':{
                    templateUrl : 'templates/reg.html'
                }
            }
        })
        .state('login',{
            url :'/login',
            views:{
                '':{
                    templateUrl:'templates/login.html'
                }
            }
        })
        .state('find',{
            url : '/find',
            templateUrl : 'templates/find.html'
        })
        .state('about',{
            url:'/about',
            templateUrl : 'templates/about.html'
        })
        .state('help',{
            url:'/help',
            templateUrl : 'templates/help.html'
        })
        .state('forgot',{
            url : '/forgot',
            templateUrl : 'templates/forgot.html'
        })
        .state('diary',{
            url : '/diary/write',
            templateUrl : 'templates/diary.html'
        })
        .state('notebook',{
            url : '/notebook',
            templateUrl : 'templates/notebook.html'
        })
        .state('set',{
            url : '/set',
            templateUrl : 'templates/set.html'
        })
        .state('pwd',{
            url :'/set/pwd',
            templateUrl : 'templates/pwd.html'
        })
        .state('apply',{
            url : '/set/apply',
            templateUrl : 'templates/apply.html'
        })
        .state('avatar',{
            url : '/set/avatar',
            templateUrl : 'templates/avatar.html'
        })
        .state('user_index',{
            url: '/user_index',
            views : {
                '':{
                    templateUrl : 'templates/user_index.html'
                },
                'main@user_index':{
                    templateUrl : 'templates/dynamic.html'
                },
                'aside@user_index':{
                    templateUrl:'templates/aside.html'
                }
            }
        })
})