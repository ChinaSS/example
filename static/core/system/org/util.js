/**
 * Created by YiYing on 2015/3/25.
 */
define(["PDUtilDir/util"],function(Util){

    /**
     * Excel导入前端公共接口
     * @param param
     */
    var importExcel = function(param){
        require(["PDUtilDir/dialog",
                "WebUploader",
                "text!"+param.templeteURL,
                "css!WebUploaderCss"
            ],
            function(Dialog,WebUploader,body){
                var dialog = Dialog({
                    id:"system_importExcelDialog",
                    title:param.title,
                    cache:false,
                    body:body
                });
                //附件上传控件初始化
                var uploader = WebUploader.create({
                    swf:getStaticPath()+'/modules/webuploader/Uploader.swf',
                    server: getServer()+"/sword/"+param.mapping.ServiceName,
                    accept:{
                        title:"excel",
                        //extensions: 'xsl,xslx',
                        mimeTypes:["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].join(",")
                    },
                    pick:{
                        id:'#ImportExcelPanel',
                        multiple:false
                    }
                });
                //设置上传按钮
                dialog.setFoot([{name:"开始上传",callback:function(){
                    uploader.upload();
                }}]);
                //设置样式，必须uploader初始化后才能设置
                var panel = $("#ImportExcelPanel");
                panel.children(":first").css({
                    "width": "100px",
                    "height": "25px",
                    "padding": "3px"
                });
                panel.children(":last").css({"background": "#00b7ee"});
                panel.find("label").hover(function() {
                    panel.children(":last").css({"background": "#00b7ee"});
                }, function() {
                    panel.children(":last").css({"background": "#00a2d4"});
                });
                //把附件增加到待上传列表中
                uploader.on( 'fileQueued', function(file) {
                    $("#importExcelInfo").show();
                    $("#importExcelFileName").html(file.name);
                });
                //附件上传数据发送之前触发
                uploader.on( 'uploadBeforeSend', function(object,data,headers) {
                    data["formData"] = JSON.stringify(param.mapping);
                    data["SwordControllerName"] = "ExcelImportController";
                    $("#importExcelStatus").html("开始导入，请耐心等待...");
                });
                //附件上传成功后触发
                uploader.on( 'uploadSuccess', function( file,res ) {
                    //console.log(res);
                    var response = JSON.parse(res);
                    $("#importExcelStatus").html(response.status=="success"?"导入成功,共"+response.count+"条":"导入失败");
                    //错误信息
                    var errorInfo = response.excelTransformInfo?"<strong>Excel转换错误信息：</strong><br/>"+decodeURI(response.excelTransformInfo):"";
                    errorInfo+= response.importInfo?"<strong>导入错误信息：</strong><br/>"+decodeURI(response.importInfo):"";
                    $("#importExcelErrorInfo").html(errorInfo);
                });
            }
        );
    };

    /**
     * 设置指定面板中的数据
     * @param id
     * @param data
     */
    var setNgModel = function(id,data){
        //得到指定id面板中所有需要绑定的文本框对象
        $("#"+id+" input[type='text'][ng-model]").each(function(index){
            var arr = $(this).attr("ng-model").split(".");
            var temp=data;
            for(var i= 0,item;item=arr[i++];){
                temp = temp[item];
            }
            $(this).val(temp);
        });
    };

    /**
     * 获取数据
     * @param id
     */
    var getNgModel = function(id){
        var obj = {};
        $("#"+id+" input[type='text'][ng-model]").each(function(index){
            var arr = $(this).attr("ng-model").split(".");
            obj[arr[arr.length-1]] = $(this).val();
        });
        return obj;
    };

    /**
     * 取得选择的树节点id
     * @param id
     * @returns {*}
     */
    var getSelectTreeNodeId = function(id){
        var nodes = $.fn.zTree.getZTreeObj(id).getSelectedNodes();
        return nodes.length?nodes[0].id : false
    };
    var getSelectTreeNodeName = function(id){
        var nodes = $.fn.zTree.getZTreeObj(id).getSelectedNodes();
        return nodes.length?nodes[0].name : false
    };

    //数据列表公共部分
    var gridDefaultConfig = {
        placeAt:"orgShowListContent",        //存放Grid的容器ID
        pageSize:10                          //一页多少条数据
    };



    return {
        sysPath:"core/system",
        gridDefaultConfig:gridDefaultConfig,
        importExcel:importExcel,
        setNgModel:setNgModel,
        getNgModel:getNgModel,
        getSelectTreeNodeId:getSelectTreeNodeId,
        getSelectTreeNodeName:getSelectTreeNodeName
    }
});