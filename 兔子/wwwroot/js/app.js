var routerApp = angular.module('routerApp',['ui.router','regApp']);

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
})