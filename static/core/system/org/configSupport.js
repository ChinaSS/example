/**
 * Created by YiYing on 2015/4/28.
 */
define(["PDUtilDir/util","PDUtilDir/tool"],function(Util,Tool){

    //事件处理中心
    var clickEventCenter = {
        "OrgConfigSaveBtn":function(){
            saveConfig();
        }
    };

    var envetCenterInit = (function(){
        //控制同一个DOM上只绑定一次，避免绑定多次事件
        var flag = "";
        return function(id){
            if(flag!=id){
                flag = id;
                //事件绑定
                $("#"+id).on("click", "[data-click-center]", function () {
                    var handlerName = $(this).data("click-center");
                    var handler = clickEventCenter[handlerName];
                    $.isFunction(handler) && handler();
                });
            }
        }
    })();

    //弹出组织配置
    var showConfigSidebar = function(){
        $.ajax({
            url:getServer()+"/sword/org/config/getOrgConfig",
            dataType:"json",
            success:function(data){
                Util.slidebar({
                    url:getStaticPath()+"/core/system/org/views/orgConfig.html",
                    close:true,
                    width:"800px",
                    afterLoad:function(){
                        //事件绑定
                        envetCenterInit("OrgConfigSilderbar");
                        Tool.deserialize("OrgConfigForm",data);
                        var deptExtendConfig = data.deptExtendConfig;
                        deptExtendConfig && Tool.deserialize("DeptExtendInfoForm",JSON.parse(deptExtendConfig));
                        var personExtendConfig = data.personExtendConfig;
                        personExtendConfig && Tool.deserialize("PersonExtendInfoForm",JSON.parse(personExtendConfig));
                        //表单验证
                        validateConfig();
                    }
                });
            }
        });
    };


    var validateConfig = function(){
        //数据验证
        $("#OrgConfigForm").validate({
            rules:{
                defPassword:{required:true}
            },
            messages: {defPassword:"默认密码不能为空"}
        });
    };

    /**
     * 组织配置保存
     */
    var saveConfig = function(){
        if($("#OrgConfigForm").valid()){
            $.ajax({
                url:getServer()+"/sword/org/config/saveOrgConfig",
                dataType:"json",
                data: $.extend(Tool.serialize("OrgConfigForm"),{
                    "deptExtendConfig":JSON.stringify(Tool.serialize("DeptExtendInfoForm")),
                    "personExtendConfig":JSON.stringify(Tool.serialize("PersonExtendInfoForm"))
                }),
                success:function(data){
                    Util.alert(data.message);
                }
            });
        }
    };

    return {
        showConfigSidebar:showConfigSidebar
    }
});