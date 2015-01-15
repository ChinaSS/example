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
            /*
             * 附件上传样例
             * ep_DialogCtrl
             */
            {
                ctrlName : "ep_fileUploadCtrl",
                ctrlUrl : "examplesDir/util/fileUpload/fileUploadCtrl",
                routerPath : '/fileUpload',
                templateUrl : 'app/examples/util/fileUpload/views/fileUpload.html'
            }
        ]
    };
});