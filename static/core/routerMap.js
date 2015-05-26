define(function() {
    var sysPath = "core/system";
    return {
        //控制层配置
        configs : [
            /*----------examples---------*/       
            /*
			 * util样例
			 * ep_UtilCtrl
			 */
			{
				ctrlName : "ep_UtilCtrl",                                   //ctrl名称
				ctrlUrl : "PDExamplesDir/util/util/utilCtrl",                 //ctrl路径
				routerPath : '/util',                                       //访问路径
				templateUrl : 'core/examples/common.html'                    //html文件
			},
            /*
             * dialog样例
             * ep_DialogCtrl
             */
            {
                ctrlName : "ep_DialogCtrl",                                 //ctrl名称
                ctrlUrl : "PDExamplesDir/util/dialog/dialogCtrl",             //ctrl路径
                routerPath : '/dialog',                                     //访问路径
                templateUrl : 'core/examples/common.html'                    //html文件
            },
            /*
             * grid样例
             * ep_GridCtrl
             */
            {
                ctrlName : "ep_GridCtrl",                                   //ctrl名称
                ctrlUrl : "PDExamplesDir/util/grid/gridCtrl",                 //ctrl路径
                routerPath : '/grid',                                       //访问路径
                templateUrl : 'core/examples/common.html'                    //html文件
            },
            /*
             * 附件上传样例
             */
            {
                ctrlName : "ep_fileUploaderCtrl",
                ctrlUrl : "PDExamplesDir/util/fileUploader/fileUploaderCtrl",
                routerPath : '/fileUploader',
                templateUrl : 'core/examples/common.html'
            },
            /*
             * 单附件上传样例
             
            {
                ctrlName : "ep_singleFileUploadCtrl",
                ctrlUrl : "PDExamplesDir/util/singleFileUpload/singleFileUploadCtrl",
                routerPath : '/singleFileUpload',
                templateUrl : 'core/examples/common.html'
            },*/
            /*
             * 多附件上传样例
             
            {
                ctrlName : "ep_fileUploadCtrl",
                ctrlUrl : "PDExamplesDir/util/fileUpload/fileUploadCtrl",
                routerPath : '/fileUpload',
                templateUrl : 'core/examples/common.html'
            },*/
            /*
             * 图片裁剪
             */
            {
                ctrlName : "ep_crop",
                ctrlUrl : "PDExamplesDir/util/crop/cropCtrl",
                routerPath : '/crop',
                templateUrl : 'core/examples/common.html'
            },
            /*
             * typeahead
             */
            {
                ctrlName : "ep_typeahead",
                ctrlUrl : "PDExamplesDir/util/typeahead/typeaheadCtrl",
                routerPath : '/typeahead',
                templateUrl : 'core/examples/common.html'
            },
            /*
             * intputSelect
             */
            {
                ctrlName : "ep_inputSelect",
                ctrlUrl : "PDExamplesDir/util/inputSelect/inputSelectCtrl",
                routerPath : '/inputSelect',
                templateUrl : 'core/examples/common.html'
            },
            /*
             * treeDialog
             */
            {
                ctrlName : "ep_treeDialog",
                ctrlUrl : "PDExamplesDir/collaboration/treeDialog/treeDialogCtrl",
                routerPath : '/treeDialog',
                templateUrl : 'core/examples/common.html'
            },
            /*
             * treeDialog
             */
            {
                ctrlName : "ep_treeAndGridDialog",
                ctrlUrl : "PDExamplesDir/collaboration/treeAndGridDialog/treeAndGridDialogCtrl",
                routerPath : '/treeAndGridDialog',
                templateUrl : 'core/examples/common.html'
            },
            /*
             * zTree
             */
            {
                ctrlName : "ep_zTree",
                ctrlUrl : "PDExamplesDir/thirdParty/zTree/zTreeCtrl",
                routerPath : '/zTree',
                templateUrl : 'core/examples/common.html'
            },
            /*
             * date
             */
            {
                ctrlName : "ep_dateTimePicker",
                ctrlUrl : "PDExamplesDir/thirdParty/dateTimePicker/dateTimePickerCtrl",
                routerPath : '/dateTimePicker',
                templateUrl : 'core/examples/common.html'
            },
            /*
             * validate
             */
            {
                ctrlName : "ep_validate",
                ctrlUrl : "PDExamplesDir/thirdParty/validate/validateCtrl",
                routerPath : '/validate',
                templateUrl : 'core/examples/common.html'
            },
            /*
             * fontawesome
             */
            {
                ctrlName : "ep_fontawesome",
                ctrlUrl : "PDExamplesDir/thirdParty/fontawesome/fontCtrl",
                routerPath : '/fontawesome',
                templateUrl : 'core/examples/common.html'
            },
            /*
             * echarts
             */
            {
                ctrlName : "ep_eCharts",
                ctrlUrl : "PDExamplesDir/thirdParty/ECharts/eChartsCtrl",
                routerPath : '/ECharts',
                templateUrl : 'core/examples/common.html'
            },
            /*
             * mCustomScrollbar
             */
            {
                ctrlName : "ep_mCustomScrollbar",
                ctrlUrl : "PDExamplesDir/thirdParty/mCustomScrollbar/mcScrollbarCtrl",
                routerPath : '/mcScrollbar',
                templateUrl : 'core/examples/common.html'
            },
            /*
             * divFold
             */
            {
                ctrlName : "ep_divFold",
                ctrlUrl : "PDExamplesDir/thirdParty/divFold/divFoldCtrl",
                routerPath : '/divfold',
                templateUrl : 'core/examples/common.html'
            },
            /*
             * dataSelect
             */
            {
                ctrlName : "ep_dataSelect",
                ctrlUrl : "PDExamplesDir/util/org/dataSelectCtrl",
                routerPath : '/dataSelect',
                templateUrl : 'core/examples/common.html'
            },
            /*
             * test
             */
            {
                ctrlName : "ep_test",
                ctrlUrl : "PDExamplesDir/util/test/ctrl",
                routerPath : '/test',
                templateUrl : 'core/examples/util/test/webeditor/CSSBPMWebEditor.html'
            },
            /*
             * floatTouch
             */
            {
                ctrlName : "ep_floatTouch",
                ctrlUrl : "PDExamplesDir/thirdParty/floatTouch/floatTouchCtrl",
                routerPath : '/floatTouch',
                templateUrl : 'core/examples/common.html'
            },
            /*
             * uploaderAndGrid
             */
            {
                ctrlName : "ep_uploaderAndGrid",
                ctrlUrl : "PDExamplesDir/collaboration/uploaderAndGrid/uploaderAndGridCtrl",
                routerPath : '/uploaderAndGrid',
                templateUrl : 'core/examples/common.html'
            },
            
            /*--------------example over--------------*/
                   
            /*
             * 组织机构
             */
            {
                ctrlName : "core_OrgCtrl",                      //ctrl名称
                ctrlUrl : "PDOrgDir/orgCtrl",                     //ctrl路径
                routerPath : '/org',                            //访问路径
                templateUrl : sysPath+'/org/views/org.html'     //html文件
            },
            {
                ctrlName : "core_AclCtrl",                      //ctrl名称
                ctrlUrl : "PDAclDir/aclCtrl",                     //ctrl路径
                routerPath : '/auth',                            //访问路径
                templateUrl : sysPath+'/acl/views/index.html'     //html文件
            },
            {
            	ctrlName : "core_MenuCtrl",                      //ctrl名称
                ctrlUrl : "PDMenuDir/menuCtrl",                     //ctrl路径
                routerPath : '/menu',                            //访问路径
                templateUrl : sysPath + '/menu/views/index.html'     //html文件
            },
            /**
             *  dictionary manager
             */
            {
            	ctrlName : "core_DictCtrl",                      //ctrl名称
                ctrlUrl : "PDDictDir/dictCtrl",                     //ctrl路径
                routerPath : '/dict',                            //访问路径
                templateUrl : sysPath + '/dict/views/DictManager.html'     //html文件
            }
        ]
    };
});