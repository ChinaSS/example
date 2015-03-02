/**
 * Created by YiYing on 2015/2/10.
 */
define(["UtilDir/dialog"], function(Dialog){
    /**
     * 人员选择接口
     * @param param
     * @constructor
     */
    var CS_SelectPsn = function(param){
        //为弹出框增加操作按钮
        var buttons = [];
        buttons.push(
            {name:"确定",callback:function(){
                //此处写扩展代码

                dialog.hide();
            }}
        );
        var dialog = Dialog({
            id:"CS_SelectPsnDialog",
            cache:false,
            title:"人员选择",
            height:"350px",
            dialogSize:"modal-lg",               //modal-lg或modal-sm
            body:"窗口中间内容",
            buttons:buttons
        });
        var html = '<div style="width:20%;display:inline-block;vertical-align:top;">left</div>'+
                   '<div style="width:80%;display:inline-block;vertical-align:top;">right</div>';
        dialog.setBody(html);
        dialog.show();
        //require(["OrgDir/orgUtil"],function(u){u.CS_SelectPsn()})
    };

    /**
     * 部门选择接口
     * @param param
     * @constructor
     */
    var CS_SelectDept = function(param){

    };
    return {
        CS_SelectPsn : CS_SelectPsn,
        CS_SelectDept:CS_SelectDept
    }
});