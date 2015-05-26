define(["jquery"],function($){
    //自定义HTML标签
    return {
        directives : [
            /*
             * 日期格式化
             */
            {
                name : 'dateFormat',
                func : ["$filter",function($filter) {
                    var dateFilter = $filter("date");
                    return {
                        require: 'ngModel',
                        restrict: 'A',
                        link: function(scope, element, attrs, ctrl) {
                            var format = attrs.dateFormat?attrs.dateFormat:"yyyy-MM-dd";
                            function formatter(date){
                                var angularDate = Date.parse(date);
                                if(!angularDate&&!!data){
                                    return "日期格式错误";
                                }
                                return dateFilter(angularDate,format);
                            }
                            ctrl.$formatters.push(formatter);
                        }
                    };
                }]
            },
            /*
             * 富内容弹出窗口(可进行Angular数据模型绑定)
             */
            {
                name : 'csDialog',
                func : ["$compile",function($compile) {
                    return {
                        require: 'ngModel',
                        restrict: 'A',
                        scope : {
                            ngModel : '=',
                            csDialog : '='
                        },
                        link: function(scope, element, attrs, ctrl) {
                            var config = scope.csDialog,
                                id = element[0].id?element[0].id:"csDialog"+Math.floor(Math.random()*1000000);
                            element[0].id=id;
                            config.setting = $.extend({
                                cache : true,
                                dialogSize: "modal-lg",
                                modal : "hide"
                            },config.setting,{
                                id : "system_contentDialog_"+id
                            });
                            scope.model = scope.ngModel;
                            scope.lastTemplate = "";
                            $(element).on("mouseup", function () {
                                require(["PDUtilDir/dialog","text!"+config.template],function(Dialog,template){
                                    //获取dialog对象
                                    var dialog = Dialog(config.setting);
                                    //使用angularjs的$conpile解析并链接模板
                                    if(scope.lastTemplate != config.template){
                                        scope.lastTemplate = config.template;
                                        scope.$apply(function(){
                                            var link = $compile(template);
                                            template = link(scope);
                                        });
                                        dialog.setBody(template);
                                    }
                                    //处理加载完成后事件
                                    if(!!config.afterLoad){config.afterLoad(dialog);}
                                    dialog.extend({
                                        save : function(){
                                            scope.$apply(function(){
                                                scope.ngModel = scope.model;
                                            });
                                        }
                                    });
                                    //显示dialog
                                    dialog.show();
                                });
                            });
                        }
                    };
                }]
            },
            /*
             * csTypeahead
             * 根据输入, 推荐匹配结果
             * config = {
             *      key : {},      //键值转换接口(包括id,data,request,response)
             *      multi : false,      //单选多选表示位, 默认false为单选
             *      bindElementId : "",     //如需将选中结果显示在外部容器中, 则绑定该元素id,利用callback函数,处理数据
             *      data : url,         //url数据接口地址
             *      onSelect : function(data,[id,class]){}  //该函数为需要对选中元素数据对象进行额外处理功能时(即用户自定义当前
             *                                              //列选中操作),data是当前数据对象;
             *                                              //后两个参数为可选项, 仅当设置了bindElementId时可用,
             *                                             //id为所绑定外部元素id, class为事件接口类;
             * }
             */
            {
                name : 'csTypeahead',
                func : function() {
                    return {
                        require: 'ngModel',
                        restrict: 'A',
                        scope : {
                            ngModel : '=',
                            csTypeahead : '='
                        },
                        link: function(scope, element, attrs, ctrl) {
                            var config = scope.csTypeahead,
                                multi = !!config.bindElementId,
                                onSelect = config.onSelect||config.callback,
                                id = element[0].id?element[0].id:"csTypeahead"+Math.floor(Math.random()*1000000),
                                lastContent="";
                            //bindElement数据参数
                            var eventClass = "codeRemove",
                                $bindElement = $("#"+config.bindElementId);
                            var dataList={};
                            element[0].id=id;
                            //config为内部使用参数
                            config = $.extend(true,{
                                key : {
                                    id : "id",
                                    data : "data",
                                    request : "",
                                    response : ""
                                }
                            },config,{
                                id : id,
                                callback : function(data){ //列表项点击事件数据处理函数,传递给typeahead组件的默认回调函数
                                    var value = (typeof data == "object")?data[config.key.id]:data,
                                        ngValue = scope.ngModel;
                                    if(!multi){
                                        ngValue = value;
                                    } else {
                                        ngValue = dataTransfer(ngValue);
                                        for(var i= 0,length=ngValue.length;i<length;i++){
                                            if(ngValue[i]==value){
                                                return false;
                                            }
                                        }
                                        ngValue.push(value);
                                        ngValue = dataTransfer(ngValue);
                                    }
                                    if(scope.ngModel!=ngValue) {
                                        scope.$apply(function () {
                                            scope.ngModel = ngValue;
                                        });
                                    }
                                }
                            });
                            //如果需要展示到其他元素上,做额外事件监听
                            if(multi){
                                $bindElement.on("click","."+eventClass,function(){
                                    var arrayCode = dataTransfer(scope.ngModel),
                                        curCode = $(this).parent().data("code");
                                    for(var i=0,length=arrayCode.length; i<length; i++){
                                        if(arrayCode[i]==curCode){
                                            arrayCode.splice(i,1);break;
                                        }
                                    }
                                    var value = dataTransfer(arrayCode);
                                    if(scope.ngModel!=value) {
                                        scope.$apply(function () {
                                            scope.ngModel = value;
                                        });
                                    }
                                });
                            }
                            
                            //元素失去焦点,则设置为上一次的内容
                            $(element).on("blur",function(){
                                $(this).val(lastContent);
                            });
                            //监听ngModel变化
                            scope.$watch("ngModel", function(){
                                if(!!config.data){
                                    dataInit(scope.ngModel,onSelect);
                                }
                            });
                            //实例化输入推荐
                            var unwatch = scope.$watch("csTypeahead.data",function(){
                                var data = scope.csTypeahead.data;
                                if(!data||data.length==0||data.constructor===Object||data.constructor===Function){return false;}
                                config.data = data;
                                //把数据数组转换为字典对象
                                if(typeof config.data !== "string"){
                                    for(var i=0,length=config.data.length,cur="";i<length;i++){
                                        cur = config.data[i];
                                        dataList[cur[config.key.id]]=cur[config.key.data];
                                    }
                                }
                                dataInit(scope.ngModel,onSelect);
                                require(["PDUtilDir/typeahead"],function(typeahead){
                                    typeahead(config);
                                });
                                unwatch();
                            });

                            //配置ngModel双向绑定数据通道
                            ctrl.$formatters.push(formatter);
                            ctrl.$parsers.push(parser);

                            //ngModel双向绑定数据通道函数
                            function formatter(data){
                                return $(element).val();
                            }
                            function parser(data){
                                return scope.ngModel;
                            }
                            //数据格式化
                            function dataTransfer(data){
                                if(!!data&&data.constructor === Array){
                                    data = data.join(",");
                                }else{
                                    if(!data){
                                        data = [];
                                    }else if(typeof data === "string"){
                                        data = data.split(",");
                                    }
                                }
                                return data;
                            }
                            //处理回传数据
                            function setElement(html,code){
                                $html = $(html);
                                $html.data("code",code)
                                    .append("<span class='"+eventClass+"'>关闭</span>");
                                $bindElement.append($html);
                            }
                            //ngModel变化时,控制element显示内容填充
                            function fillContent(data,callback){
                                if(!multi){
                                    lastContent = data[0]?data[0][config.key.data]:"";
                                    $(element).val(lastContent);
                                    return;
                                }
                                if(typeof callback !== "function"){
                                    console.log("onSelect undefined!");
                                    return false;
                                }
                                $bindElement.empty();
                                for(var i=0;i<data.length;i++){
                                    callback(data[i],setElement);
                                }
                            }
                            //根据数据进行DOM操作
                            function dataInit(initData,callback){
                                initData = dataTransfer(initData);
                                if(typeof initData === "undefined"){return false;}
                                if(typeof config.data === "string"){
                                    $.ajax({
                                        url : config.data,
                                        type : "POST",
                                        data : (config.key.request?config.key.request+"=":"")+initData.join(","),
                                        dataType : "json",
                                        success : function(data){
                                            data = config.key.response?data[config.key.response]:data;
                                            if(data.constructor === Object){
                                                data = new Array(data);
                                            }
                                            fillContent(data,callback);
                                        },
                                        error : function(){
                                            console.log("csTypeahead Init Failed");
                                        }
                                    });
                                } else {//处理数据对象
                                    var dataObj, dataArr=[];
                                    for(var i=0,length=initData.length;i<length;i++){
                                        dataObj = {};
                                        dataObj[config.key.id]=initData[i];
                                        dataObj[config.key.data]=dataList[initData[i]];
                                        dataArr.push(dataObj);
                                    }
                                    fillContent(dataArr,callback);
                                }
                            }
                        }
                    };
                }
            },
            /*
             * csInput
             * 属性参数对象 :
             * {
             *  type : 'select',
             *  data : []/url,                  //json数据或者url地址
             *  onSelect : function(data){}     //当前数据被选中时回调函数, 参数为当前数据对象
             *  callback : function(dataArr){}  //组件操作结束时, 回调函数, 参数为已选中数据id数组
             * }
             * data数据格式:
             * data=[
             *    {
             *        id : "1",
             *        name: "国籍",
             *        data: [] //树形层级
             *    }
             * ]
             */
            {
                name : 'csInput',
                func : function() {
                    return {
                        require: 'ngModel',
                        restrict: 'A',
                        scope : {
                            ngModel : '=',
                            csInput : '='
                        },
                        link: function(scope, element, attrs, ctrl) {
                            var config = scope.csInput,
                                inputSelectObj = null,
                                id = element[0].id?element[0].id:"csInput"+Math.floor(Math.random()*1000000);
                            element[0].id=id;
                            var _config = $.extend({
                                type : "select",
                                data : [],
                                initData : []
                            },config,{
                                id : id,
                                onSelect : function(obj){
                                    if(typeof config.onSelect=="function"){
                                        config.onSelect(obj);
                                    }
                                },
                                callback : function(data,objArr){
                                    var value = dataTransfer(data);
                                    if(scope.ngModel!=value) {
                                        scope.$apply(function () {
                                            scope.ngModel = value;
                                        });
                                    }
                                    if(typeof config.callback=="function"){
                                        config.callback(data,objArr);
                                    }
                                }
                            });
                            //监听ngModel变化
                            scope.$watch("ngModel", function(newData,oldData){
                                if(!!inputSelectObj){
                                    inputSelectObj.dataInit(dataTransfer(newData));
                                }
                            });
                            var unwatch = scope.$watch("csInput.data", function(){
                                var data = scope.csInput.data;
                                if(!data||data.length==0||data.constructor===Object||data.constructor===Function){return false;}
                                require(["PDUtilDir/inputSelect"],function(inputSelect){
                                    inputSelectObj = inputSelect(
                                        $.extend(_config,{
                                            data : data,
                                            initData : dataTransfer(scope.ngModel)
                                        })
                                    );
                                });
                                unwatch();
                            });
                            function formatter(data){
                                return $(element).val();
                            }
                            function parser(data){
                                return $(element).data("ids");
                            }
                            ctrl.$formatters.push(formatter);
                            ctrl.$parsers.push(parser);

                            //数据格式化
                            function dataTransfer(data){
                                if(!!data&&data.constructor === Array){
                                    data = data.join(",");
                                }else{
                                    if(!data){
                                        data = [];
                                    }else if(typeof data === "string"){
                                        data = data.split(",");
                                    }
                                }
                                return data;
                            }
                        }
                    };
                }
            },
            /**
             * 日期指令，options具体参数参看bootstrap-datetimepicker
             */
            {
                name: 'csDatetime',
                func: ["$filter",function($filter){
                    var dateFilter = $filter("date");
                    return {
                        require: '?ngModel',
                        restrict: 'A',
                        scope:{
                            csDatetime : '='
                        },
                        link: function (scope, element, attrs,ctrl) {
                            //默认参数
                            var options = {
                                format: 'yyyy-mm-dd',       //日期格式化
                                language: 'cn',             //中文
                                autoclose:true,           //当选择一个日期之后立即关闭此日期时间选择器
                                startView:'month',          //日期时间选择器打开之后首先显示的视图
                                minView:'month',            //最小视图
                                maxView:"decade",
                                todayHighlight:true,        //当天高亮
                                minuteStep:1                //选择分钟时步长为1
                            };
                            options = $.extend(options,scope.csDatetime);
                            //默认日期格式化
                            function formatter(date){
                                var angularDate = Date.parse(date);
                                if(!angularDate&&!!data){
                                    return "日期格式错误";
                                }
                                //bs中的小写mm月转换为MM
                                return dateFilter(angularDate,options.format.replace("mm","MM"));
                            }
                            ctrl && ctrl.$formatters.push(formatter);
                            //绑定日期选择组件
                            require(["Date","css!DateCss"],function(){
                                $(element).focus(function(){
                                    //中文国际化
                                    $.fn.datetimepicker.dates['cn'] = {
                                        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
                                        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                                        daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
                                        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                                        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                                        today: "今日",
                                        suffix: [],
                                        meridiem: ["上午", "下午"]
                                    };
                                    $(element).datetimepicker(options);
                                    $(element).datetimepicker('show');
                                });
                            })
                        }
                    }
                }]
            },
            /**         examples          **/
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
                            require(["PDOrgDir/orgDirective"], function (dircet) {
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
                            require(['PDUtilDir/uploader/singleFileUpload'],function(SFU){
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
                            require(['PDUtilDir/uploader/fileUpload'],function(FileUpload){
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