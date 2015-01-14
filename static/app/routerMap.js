define(function() {
    return {
        //控制层配置
        configs : [
            /*
             * dialog样例
             * ep_DialogCtrl
             */
            {
                ctrlName : "ep_DialogCtrl",                                 //ctrl名称
                ctrlUrl : "examplesDir/util/dialog/dialogCtrl",             //ctrl路径
                routerPath : '/dialog',                                     //访问路径
                templateUrl : 'app/examples/util/dialog/views/dialog.html'  //html文件
            },
            {
                ctrlName : "ep_DemoViewCtrl",                                 //ctrl名称
                ctrlUrl : "demoViewDir/demoViewCtrl",             //ctrl路径
                routerPath : '/demoView/:id',                                     //访问路径
                templateUrl : 'app/demoView/demoView.html'  //html文件
            }
        ]
    };
});