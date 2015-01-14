/*
HomeApp模块
 */
define(["app/directive","core/directive","app/routerMap","core/routerMap","Angular","Angular-route"],function(appDirective,coreDirective,appRouterMap,coreRouterMap,angular){
    var HomeApp = angular.module('HomeApp', ["ngRoute"]);

    //基础控制器
    /*
     * BodyCtrl
     */
    HomeApp.controller('BodyCtrl', ["$http",'$scope', function($http,$scope){

    }]);

    //基础指令
    /*
     * sidebarMenu
     */
    HomeApp.directive('sidebarMenu', ['$http', function ($http) {
            return {
                replace: false,
                restrict: 'A',
                templateUrl: getStaticPath() +'/core/home/views/sidebarLI.html',
                link: function ($scope, element, attrs) {
                    $http.get(getServer() +'/static/core/home/menu/data/Menu.json').success(function (data) {
                        $scope.hover = "";
                        $scope.templateUrl = getStaticPath() +'/core/home/views/sidebarLI.html';
                        $scope.sidebar = {
                            sidebars: data
                        };
                    });
                }
            };
    }]);

    //扩展路由&控制器
    routerExtend(coreRouterMap,HomeApp);
    routerExtend(appRouterMap,HomeApp);

    //扩展指令
    directiveExtend(coreDirective,HomeApp);
    directiveExtend(appDirective,HomeApp);

    /*
     * 路由&控制器扩展
     * routerExtend
     */
    function routerExtend(obj,app){
        var i=0,length=0;
        for (i=0,length=obj.configs.length;i<length;i++) {
            (function(){
                var config = obj.configs[i];
                if(!config.ctrlName||!config.ctrlUrl||!config.routerPath||!config.templateUrl){
                    console.log("router init error! ctrlName:"+config.ctrlName+", routerPath:"+config.routerPath);
                    console.log(config);
                }
                app.controller(config.ctrlName, ["$compile", '$scope','$routeParams', function($compile,$scope,$routeParams){
                    require([config.ctrlUrl], function (ctrl) {
                        if(!ctrl){
                            console.log("controller init error! ctrlName: "+config.ctrlName);
                            console.log(config);
                        }
                        ctrl($compile, $scope,$routeParams);
                    });
                }]);
                app.config(['$routeProvider',
                    function($routeProvider) {
                        $routeProvider.when(config.routerPath, {
                            templateUrl : getStaticPath() + config.templateUrl,
                            controller : config.ctrlName
                        });
                    }
                ]);
            })();
        }
    }

    /*
     * 指令扩展
     * directExtend
     */
    function directiveExtend(obj,app){
        var i=0, length=0, directive;
        for (i=0,length=obj.directives.length;i<length;i++) {
            directive = obj.directives[i];
            if(!directive.name||!directive.func){
                console.log("directive init error! Index: "+i+", Name: "+directive.name);
                console.log(directive);
            }
            app.directive(directive.name, directive.func);
        }
    }

    return HomeApp;
});
