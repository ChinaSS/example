define(function() {
    return {
        //控制层配置
        configs : [
			/*
			 * util样例
			 * ep_UtilCtrl
			 */
			{
				ctrlName : "ep_UtilCtrl", //ctrl名称
				ctrlUrl : "ExamplesDir/util/util/utilCtrl", //ctrl路径
				routerPath : '/util', //访问路径
				templateUrl : 'app/examples/common.html' //html文件
			},
            /*
             * dialog样例
             * ep_DialogCtrl
             */
            {
                ctrlName : "ep_DialogCtrl",                                 //ctrl名称
                ctrlUrl : "ExamplesDir/util/dialog/dialogCtrl",             //ctrl路径
                routerPath : '/dialog',                                     //访问路径
                templateUrl : 'app/examples/common.html'                    //html文件
            },
            /*
             * 附件上传样例
             * ep_DialogCtrl
             */
            {
                ctrlName : "ep_fileUploadCtrl",
                ctrlUrl : "ExamplesDir/util/fileUpload/fileUploadCtrl",
                routerPath : '/fileUpload',
                templateUrl : 'app/examples/util/fileUpload/views/fileUpload.html'
            },
            /*
             * 图片裁剪
             */
            {
                ctrlName : "ep_crop",
                ctrlUrl : "ExamplesDir/util/crop/cropCtrl",
                routerPath : '/crop',
                templateUrl : 'app/examples/common.html'
            },
            /*
             * typeahead
             */
            {
                ctrlName : "ep_typeahead",
                ctrlUrl : "ExamplesDir/util/typeahead/typeaheadCtrl",
                routerPath : '/typeahead',
                templateUrl : 'app/examples/common.html'
            },
            /*
             * intputSelect
             */
            {
                ctrlName : "ep_inputSelect",
                ctrlUrl : "ExamplesDir/util/inputSelect/inputSelectCtrl",
                routerPath : '/inputSelect',
                templateUrl : 'app/examples/common.html'
            }

        ]
    };
});