/**
 * Created by YiYing on 2015/3/25.
 */
define(["PDUtilDir/util","PDUtilDir/grid","PDOrgDir/util"],function(Util,Grid,OrgUtil){
    /*****************角色目录相关**************/
    //角色目录导入
    var importRoleDir = function(){
        var mapping = {
            "ServiceName":"org/roledir/importRoleDir",
            "EntityClassName":"com.css.sword.org.entity.OrgRoleDir",
            "目录名称":"dirName","目录编号":"dirCode","父目录编号":"pDirCode"
        };
        OrgUtil.importExcel({
            "title":"角色目录导入",
            "templeteURL":OrgUtil.sysPath+"/org/views/importRoleDir.html",
            "mapping":mapping
        });
    };

    //编辑角色目录
    var editRoleDir = function(){
        var dir_code = OrgUtil.getSelectTreeNodeId("roletree");
        $.ajax({
            //url:sysPath+"/org/data/RoleDir.json",
            url:getServer()+"/sword/org/roledir/getRoleDirByCode",
            data:{"dirCode":dir_code},
            success:function(data){
                data = {Org:{RoleDir:data}};
                showRoleDirSidebar({
                    afterLoad:function(){
                        $("#org_RoleDirName").html(data.Org.RoleDir.dirName);
                        OrgUtil.setNgModel("tab_RoleDir",data);
                        $("#PDirName").val($.fn.zTree.getZTreeObj("roletree").getSelectedNodes()[0].getParentNode().name);
                        //保存事件绑定
                        saveOrgRoleDirBtnBind("update");
                        //编辑时，角色编号字段不可编辑
                        $("#dirCode").attr("readonly",true);
                        //表单验证
                        validateRoleDir();
                    }
                });
            }
        });
    };
    //新增角色目录
    var addRoleDir = function(){
        showRoleDirSidebar({
            afterLoad:function(){
                var curNode = $.fn.zTree.getZTreeObj("roletree").getSelectedNodes()[0];//.getParentNode();
                $("#PDirName").val(curNode.name);
                $("#PDirCode").val(curNode.id);
                //保存事件绑定
                saveOrgRoleDirBtnBind("insert");
                //表单验证
                validateRoleDir({
                    rules:{
                        dirCode:{
                            required:true,
                            remote:{
                                type:"POST",                                        //请求方式
                                url: getServer()+"/sword/org/roledir/validateRoleDirCode",      //请求的服务
                                data:{                                              //要传递的参数
                                    dirCode:function(){return $("#dirCode").val();}
                                }
                            }
                        }
                    },
                    messages: {
                        dirCode:{
                            remote:"角色目录编号已存在,请重新输入"
                        }
                    }
                });
            }
        });
    };

    /**
     * 角色目录保存
     */
    var saveOrgRoleDirBtnBind = function(saveType){
        $("#saveOrgRoleDirBtn").bind("click",function(){
            if($("#RoleDirForm").valid()){
                var entity = OrgUtil.getNgModel("tab_RoleDir");
                //console.log(entity);
                $.ajax({
                    url:getServer()+"/sword/org/roledir/saveRoleDir",
                    dataType:"json",
                    data:entity,
                    success:function(data){
                        //console.log(data);
                        if(data.status){
                            //刷新树
                            //$.fn.zTree.getZTreeObj("roletree").reAsyncChildNodes(null, "refresh");
                            var tree = $.fn.zTree.getZTreeObj("roletree");
                            var curNode = tree.getSelectedNodes()[0];
                            if(saveType=="insert"){
                                $.fn.zTree.getZTreeObj("roletree").addNodes(curNode,{name:entity.dirName,id:entity.dirCode});
                            }else{
                                curNode.name = entity.dirName;
                            }
                            tree.updateNode(curNode);
                        }
                        Util.alert(data.message);
                    }
                })
            }
        })
    };

    var validateRoleDir = function(extend){
        //数据验证
        $("#RoleDirForm").validate($.extend(true,{
            rules:{
                dirName:{required:true}
            },
            messages: {}
        },extend));
    };

    //弹出角色目录侧边栏
    var showRoleDirSidebar = function(param){
        Util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgRoleDir.html",
            cache:false,
            close:true,
            width:"500px"
        },param));
    };

    /**
     * 显示角色目录列表
     */
    var showRoleDirList = function(){
        var config = {
            id: "OrgRoleDirList",
            layout: [
                {
                    name: "目录编号", field: "dirCode", click: function (e) {
                    //console.log(e.data);
                    editRoleDir(e.data.row.dirCode);
                }
                },
                {name: "目录名称", field: "dirName"},
                {name: "父节点编号", field: "pDirCode"},
                {name: "父节点名称", field: "pDirName"}
            ],
            data: {
                "type": "URL",
                "value": getServer() + "/sword/org/roledir/getAllRoleDirForGrid"
            }
        };
        Grid.init($.extend(config,OrgUtil.gridDefaultConfig));
    };

    /**
     * 删除角色分类
     */
    var delRoleDir = function(){
        var tree = $.fn.zTree.getZTreeObj("roletree");
        var curNode = tree.getSelectedNodes()[0];
        var okCallback = function(){
            $.ajax({
                url:getServer()+"/sword/org/roledir/delRoleDir",
                type:"post",
                dateType:"json",
                data:{
                    "dirCode":curNode.id
                },
                success:function(data){
                    if(data.status){
                        tree.removeNode(curNode);
                    }
                    Util.alert(data.message)
                }
            })
        };
        if(curNode){
            Util.confirm("是否删除<code>"+curNode.name+"</code>?",okCallback);
        }else{
            Util.alert("请选择要删除的角色分类.");
        }
    };

    return {
        importRoleDir:importRoleDir,
        editRoleDir:editRoleDir,
        addRoleDir:addRoleDir,
        delRoleDir:delRoleDir,
        showRoleDirList:showRoleDirList
    }

})