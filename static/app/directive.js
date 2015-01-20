define(["jquery"],function($){
    //自定义HTML标签
    return {
        directives : [
            /*
             * resourceTree
             */
            {
                name: 'resourceTree',
                func: ['$http', function ($http) {
                    return {
                        restrict: 'A',
                        link: function ($scope, element, attrs) {
                            require(["ResourceDir/resourceDirective"], function (dircet) {
                                dircet.resourceTree($scope, element, attrs);
                            });
                        }
                    }
                }]
            },
            {
                name: 'role4resourceTree',
                func: ['$http', function ($http) {
                    return {
                        restrict: 'A',
                        link: function ($scope, element, attrs) {
                            require(["RoleDir/roleDirective"], function (dircet) {
                                dircet.role4resourceTree($scope, element, attrs);
                            });
                        }
                    }
                }]
            },
            {
                name: 'treeDict',
                func: ['$http', function ($http) {
                    return {
                        restrict: 'A',
                        link: function ($scope, element, attrs) {
                            require(["dictTreeDir/dictTreeDirective"], function (dircet) {
                                dircet.treeDict($scope, element, attrs);
                            });
                        }
                    }
                }]
            },
            {
                name: 'treeType',
                func: ['$http', function ($http) {
                    return {
                        restrict: 'A',
                        link: function ($scope, element, attrs) {
                            require(["OpusDir/opusDirective"], function (dircet) {
                                dircet.treeType($scope, element, attrs);
                            });
                        }
                    }
                }]
            },
            {
                name: 'codeUnique',
                func: ['$http', function ($http) {
                    return {
                        restrict: 'A',
                        require: 'ngModel',
                        link: function (scope, element, attrs,ctrl) {
                            require(["OrgDir/orgDirective"], function (dircet) {
                                dircet.codeUnique(scope, element, attrs ,ctrl,$http);
                            });
                        }
                    }
                }]
            },
        /**
         * 单一附件上传
         */
            {
                name:'csSingleUpload',
                func:function(){
                    return {
                        restrict: 'A',
                        scope:{
                            csSingleUpload : '='
                        },
                        link:function($scope, element, attrs){
                            require(['UtilDir/singleFileUpload'],function(SFU){
                                var settings = {
                                    placeAt:element,
                                    remove:function(){
                                        $scope.csSingleUpload.file = {};
                                        $scope.csSingleUpload.response = {};
                                        $scope.$digest();
                                    },
                                    uploadSuccessExt:function(file, response){
                                        $scope.csSingleUpload.file = file;
                                        $scope.csSingleUpload.response = response;
                                        $scope.$digest();
                                    }
                                };
                                SFU.init($.extend(settings,$scope.csSingleUpload));
                            });
                        }

                    }
                }
            },
        /**
         * 附件上传列表指令
         */
            {
                name: 'csFileUpload',
                func:function(){
                    return {
                        restrict: 'A',
                        scope:{
                            csFileUpload : '='
                        },
                        link: function ($scope, element, attrs) {
                            require(['UtilDir/fileUpload'],function(FileUpload){
                                var config = $scope.csFileUpload;

                                /**
                                 * 附件初始化
                                 * @returns {*}
                                 */
                                var uploadInit = function(){
                                    var settings = {
                                        placeAt:element,
                                        /*formData:{
                                         bizType:'10'
                                         },
                                         data:[
                                         {name:'测试文档.doc',size:"10M",uploadDate:"2014-11-23",backEndData:{entity:{fileId:"DAFDA2355DSAFDSA"}}}
                                         ],*/
                                        data:[],
                                        downloadFile:function(file){
                                            window.location = getServer() + '/file/download?fileId=' + file.backEndData.entity.fileId + '&bizType=' + config.formData.bizType;
                                        },
                                        delFile:function(file){
                                            $scope.$apply(function(){
                                                var needAddId = file.backEndData.entity.fileId;
                                                //如果addFileId中已有该ID，则不添加该id到delFileId上，且删除addFileId
                                                var addFileId = $scope.csFileUpload.addFileId;
                                                if(addFileId){
                                                    for(var i= 0;i<addFileId.length;i++){
                                                        if(needAddId==addFileId[i]){
                                                            $scope.csFileUpload.addFileId.splice(i, 1);
                                                        }
                                                    }
                                                }
                                                var addFiles = $scope.csFileUpload.addFiles;
                                                if(addFiles){
                                                    for(var i= 0;i<addFiles.length;i++){
                                                        if(needAddId == addFiles[i].fileId){
                                                            $scope.csFileUpload.addFiles.splice(i, 1);
                                                            return false;
                                                        }
                                                    }
                                                }
                                                //把数据添加到scope上
                                                var delFileId = $scope.csFileUpload.delFileId;
                                                if(delFileId){
                                                    delFileId.push(needAddId);
                                                }else{
                                                    delFileId = [needAddId];
                                                }
                                                $scope.csFileUpload.delFileId = delFileId;
                                            });
                                        },
                                        uploadSuccessExt:function(file, response){
                                            //保存上传成功的附件ID
                                            $scope.$apply(function(){
                                                var addFileId = $scope.csFileUpload.addFileId;
                                                var addFile = null;
                                                if(addFileId){
                                                    addFileId.push(response.entity.fileId);
                                                    addFile = {fileId: response.entity.fileId,file:file};

                                                }else{
                                                    addFileId = [response.entity.fileId];
                                                    addFile = {fileId: response.entity.fileId,file:file};
                                                }
                                                $scope.csFileUpload.addFileId = addFileId;
                                                $scope.csFileUpload.addFiles.push(addFile);
                                            });
                                        },
                                        afterRenderFile:function (file) {
                                            var $td = file.$tr.find("td");
                                            $($td.get(1)).hide();
                                            $($td.get(2)).hide();
                                        }
                                    };
                                    var upload = FileUpload.init($.extend(settings,config));
                                    //隐藏掉上传日期和大小列
                                    upload.$table.find("tr").each(function(){
                                        var $td = $(this).find("td");
                                        $($td.get(1)).hide();
                                        $($td.get(2)).hide();
                                    });
                                    return upload;
                                };

                                //初始化附件上传组件
                                var upload = uploadInit();
                                $scope.csFileUpload.clear = function(){
                                    upload.clear();
                                    $scope.csFileUpload.data = [];
                                    $scope.csFileUpload.delFileId = [];
                                    $scope.csFileUpload.addFileId = [];
                                    $scope.csFileUpload.addFiles = [];
                                };
                                //监听取已上传附件列表的URL是否改变
                                $scope.$watch('csFileUpload.searchURL',function(){
                                    //控件内容清空
                                    upload.clear();
                                    //$scope.$apply(function(){
                                    $scope.csFileUpload.delFileId = [];
                                    $scope.csFileUpload.addFileId = [];
                                    $scope.csFileUpload.addFiles = [];

                                    //});
                                    //获取已上传的附件列表
                                    $.ajax({
                                        url:config.searchURL,
                                        type:"POST",
                                        dataType: "json",
                                        success:function(d){
                                            var files = d.curPageData;
                                            //数据转换为附件组件支持的数据格式
                                            var data = [];
                                            for(var i= 0,file;file=files[i++];){
                                                data.push({
                                                    name:file.fileName,
                                                    backEndData:{
                                                        entity:{fileId:file.fileId}
                                                    }
                                                });
                                            }
                                            //渲染已上传的附件列表
                                            upload.renderSavedFiles(data);
                                        }
                                    });
                                });
                            });
                        }
                    };
                }
            }
        ]
    }
});