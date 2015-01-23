define(function() {
    return {
        //控制层配置
        configs : [
			/*
			 * util样例
			 * ep_UtilCtrl
			 */
			{
				ctrlName : "ep_UtilCtrl",                                   //ctrl名称
				ctrlUrl : "ExamplesDir/util/util/utilCtrl",                 //ctrl路径
				routerPath : '/util',                                       //访问路径
				templateUrl : 'app/examples/common.html'                    //html文件
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
             * 单附件上传样例
             */
            {
                ctrlName : "ep_singleFileUploadCtrl",
                ctrlUrl : "ExamplesDir/util/singleFileUpload/singleFileUploadCtrl",
                routerPath : '/singleFileUpload',
                templateUrl : 'app/examples/common.html'
            },
            /*
             * 多附件上传样例
             */
            {
                ctrlName : "ep_fileUploadCtrl",
                ctrlUrl : "ExamplesDir/util/fileUpload/fileUploadCtrl",
                routerPath : '/fileUpload',
                templateUrl : 'app/examples/common.html'
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
            },
            /*
             * treeDialog
             */
            {
                ctrlName : "ep_treeDialog",
                ctrlUrl : "ExamplesDir/collaboration/treeDialog/treeDialogCtrl",
                routerPath : '/treeDialog',
                templateUrl : 'app/examples/common.html'
            },
            /*
             * treeDialog
             */
            {
                ctrlName : "ep_treeAndGridDialog",
                ctrlUrl : "ExamplesDir/collaboration/treeAndGridDialog/treeAndGridDialogCtrl",
                routerPath : '/treeAndGridDialog',
                templateUrl : 'app/examples/common.html'
            },
            /*
             * zTree
             */
            {
                ctrlName : "ep_zTree",
                ctrlUrl : "ExamplesDir/thirdParty/zTree/zTreeCtrl",
                routerPath : '/zTree',
                templateUrl : 'app/examples/common.html'
            },
            /*
             * zTree
             */
            {
                ctrlName : "ep_dateTimePicker",
                ctrlUrl : "ExamplesDir/thirdParty/dateTimePicker/dateTimePickerCtrl",
                routerPath : '/dateTimePicker',
                templateUrl : 'app/examples/common.html'
            },
            /*
             * fontawesome
             */
            {
                ctrlName : "ep_fontawesome",
                ctrlUrl : "ExamplesDir/thirdParty/fontawesome/fontCtrl",
                routerPath : '/fontawesome',
                templateUrl : 'app/examples/common.html'
            },
            /*
             * echarts
             */
            {
                ctrlName : "ep_eCharts",
                ctrlUrl : "ExamplesDir/thirdParty/ECharts/eChartsCtrl",
                routerPath : '/ECharts',
                templateUrl : 'app/examples/common.html'
            },
            /*
             * mCustomScrollbar
             */
            {
                ctrlName : "ep_mCustomScrollbar",
                ctrlUrl : "ExamplesDir/thirdParty/mCustomScrollbar/mcScrollbarCtrl",
                routerPath : '/mcScrollbar',
                templateUrl : 'app/examples/common.html'
            },
            /*
             * divFold
             */
            {
                ctrlName : "ep_divFold",
                ctrlUrl : "ExamplesDir/thirdParty/divFold/divFoldCtrl",
                routerPath : '/divfold',
                templateUrl : 'app/examples/common.html'
            }
        ]
    };
});