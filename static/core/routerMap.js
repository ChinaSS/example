define(function() {
    var sysPath = "core/system";
    return {
        //控制层配置
        configs : [
            /*
             * 组织机构
             */
            {
                ctrlName : "core_OrgCtrl",                      //ctrl名称
                ctrlUrl : "OrgDir/orgCtrl",                     //ctrl路径
                routerPath : '/org',                            //访问路径
                templateUrl : sysPath+'/org/views/org.html'     //html文件
            }
        ]
    };
});