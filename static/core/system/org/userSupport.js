/**
 * Created by YiYing on 2015/3/25.
 */
define(["PDUtilDir/util","PDUtilDir/tool","PDOrgDir/util","PDUtilDir/grid","PDUtilDir/org/orgSelect"],function(Util,Tool,OrgUtil,Grid,OrgSelect){

    //保存时，做新旧对比，找出表格中新增与删除项
    var _Model = {
        "Depts":{"old":[],"new":[]},            //所属部门信息
        "Roles":{"old":[],"new":[]},            //所属角色信息
        "GWs":{"old":[],"new":[]}               //所属岗位信息
    };

    //人员导入
    var importPerson = function(){
        var mapping = {
            "ServiceName":"org/user/importUser",
            "EntityClassName":"com.css.sword.org.entity.ImportUser",
            "员工编号":"user.userCode","用户名称":"user.userName","性别":"user.sex","生日":"user.birthday",
            "办公电话":"user.officePhone","移动电话":"user.phone","传真":"user.fax","邮箱":"user.email",
            "职务名称":"user.zwName","职务编号":"user.zwUuid","显示序号":"user.sort",
            "部门编号":"deptCode","兼职部门编号":"jzDeptCodes","所属角色编号":"roleCodes",
            "人员信息1":"user.extend1","人员信息2":"user.extend2","人员信息3":"user.extend3",
            "人员信息4":"user.extend4","人员信息5":"user.extend5","人员信息6":"user.extend6",
            "人员信息7":"user.extend7","人员信息8":"user.extend8","人员信息9":"user.extend9",
            "人员信息10":"user.extend10","人员信息11":"user.extend11","人员信息12":"user.extend12",
            "人员信息13":"user.extend13","人员信息14":"user.extend14","人员信息15":"user.extend15",
            "人员信息16":"user.extend16","人员信息17":"user.extend17","人员信息18":"user.extend18",
            "人员信息19":"user.extend19","人员信息20":"user.extend20"
        };
        OrgUtil.importExcel({
            "title":"人员导入",
            "templeteURL":OrgUtil.sysPath+"/org/views/importPerson.html",
            "mapping":mapping
        });
    };
    //新增人员
    var addPerson = function(){
        showPersonSidebar({
            afterLoad: function(){
                //职务初始化
                initZW();
                //隐藏所属角色、所属岗位页签
                var li = $("#PsnTabId>li");
                $(li[1]).hide();$(li[2]).hide();
                //部门设置默认值
                $("#deptName").val(OrgUtil.getSelectTreeNodeName("orgtree"));
                $("#deptId").val(OrgUtil.getSelectTreeNodeId("orgtree"));

                allBindInit();
            }
        });
    };

    /**
     * 表单验证
     */
    var validateUser = function(){
        //数据验证
        $("#UserForm").validate({
            rules:{
                userCode:{
                    required:true,
                    remote:{
                        type:"POST",
                        url: getServer()+"/sword/org/user/validateUserCode",
                        data:{
                            userCode:function(){return $("#userCode").val();},
                            userUuid:function(){return $("#userUuid").val();}
                        }
                    }
                },
                userName:{required:true}
            },
            messages: {
                userCode:{
                    remote:"员工编号已存在,请重新输入."
                }
            }
        });
    };

    //人员编辑
    var editPerson = function(userUuid){
        //更新当前编辑人员scope
        /*$http.get('lib/core/org/data/Person.json').success(function(data) {
             //更新职务对象
             for(var i= 0,item;item=$scope.$parent.Org.Person.ZWList[i++];){
                data.PersonInfo.BaseInfo.ZW.id==item.id ? data.PersonInfo.BaseInfo.ZW=item :"";
             }
             $scope.$parent.Org.Person = $.extend($scope.$parent.Org.Person,data);
         });*/

        //获取当前需要编辑的人员对象数据
        $.ajax({
            //url:OrgUtil.sysPath+"/org/data/Person.json",
            url:getServer()+"/sword/org/user/getAllUserInfoByUuid",
            dataType:"json",
            data:{"userUuid":userUuid},
            success:function(data){
                showPersonSidebar({
                    afterLoad:function(){
                        //把数据绑定到model上，供保存时使用
                        _Model.Depts.old = data.Depts;
                        _Model.Depts.new = $.extend([],data.Depts);
                        _Model.Roles.old = data.Roles;
                        _Model.Roles.new = $.extend([],data.Roles);
                        _Model.GWs.old = data.GWs;
                        _Model.GWs.new = $.extend([],data.GWs);

                        //显示关联部门区域
                        $("#PsnDeptListDiv").show();
                        $("#org_PersonName").html(data.PersonInfo.userName);
                        //OrgUtil.setNgModel("PersonBaseInfo",data);
                        //职务初始化
                        initZW(data.zwUuid);
                        Tool.deserialize("UserForm",data.PersonInfo);

                        //性别与是否冻结
                        //$("input[type='radio'][name='sex'][value='"+data.Org.Person.PersonInfo.sex+"']").attr("checked", "checked");
                        //$("input[type='radio'][name='locked'][value='"+data.Org.Person.PersonInfo.locked+"']").attr("checked", "checked");
                        //OrgUtil.setNgModel("PersonExtendInfo",data);
                        //所属角色
                        $("#PsnRoleList").empty().append(Util.template("T_PersonRoles",data));
                        //所属岗位
                        $("#PsnGwList").empty().append(Util.template("T_PersonGW",data));
                        //部门列表
                        $("#PsnDeptList").empty().append(Util.template("T_PersonDept",data));

                        allBindInit();
                    }
                });
            }
        });
    };

    var allBindInit = function(){
        //表单验证
        validateUser();
        //保存按钮事件绑定
        savePsnBtnBind();
        //添加部门事件绑定
        addDeptBtnBind();
        //删除部门列表事件绑定
        delDeptBtnBind();
        //删除角色事件绑定
        delRoleBtnBind();
        //删除岗位实践绑定
        delGwBtnBind();
        //替换掉扩展字段label
        replaceLabel();
        //选择部门添加
        OrgSelect.CS_SelectPsn({
            id : "deptName",
            multi : false,
            title : "部门选择",
            tagData : ["dept"],
            callback : function(data){
                if(data.dept.length){
                    data = data.dept[0];
                    $("#deptName").val(data.deptName);
                    $("#deptCode").val(data.deptCode);
                    $("#deptUuid").val(data.deptUuid);
                    $("#ou").val(data.ou);
                }else{
                    $("#deptName").val("");
                    $("#deptCode").val("");
                    $("#deptUuid").val("");
                    $("#ou").val("");
                }
            }
        });
    };

    /**
     * 替换掉扩展字段的Label标签值
     */
    var replaceLabel = function(){
        $.ajax({
            url:getServer()+"/sword/org/config/getOrgConfig",
            dataType:"json",
            success:function(data){
                var personData = data.personExtendConfig;
                if(personData){
                    var personJSON = JSON.parse(personData);
                    $("#PersonExtendInfo label").each(function(index,item){
                        var val = personJSON[$(item).attr("for")];
                        val && $(item).text(val);
                    })
                }
            }
        });
    };

    //职务初始化
    var initZW = function(val){
        $.ajax({
            //url:sysPath+"/org/data/ZWList.json",
            url:getServer()+"/sword/org/zw/getAllZw",
            dataType:"json",
            success:function(data){
                var $sel = $("#sle_PersonZW");
                //初始化人员操作界面的职务选择下拉
                for(var i= 0,item;item=data[i++];){
                    $sel.append('<option value="'+item.zwUuid+'">'+item.zwName+'</option>');
                }
                //设置选中值
                val && $sel.val(val);
            }
        })
    };

    //弹出人员侧边栏
    var showPersonSidebar = function(param){
        Util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgPerson.html",
            cache:false,
            close:true,
            width:"800px"
        },param));
    };

    /**
     * 显示人员列表
     * @param serviceName
     * @param extendCofig   主页的查询使用到该参数
     */
    var showPersonList = function(serviceName,extendCofig){
        var config = {
            id: "OrgPersonList",
            layout:[
                {name:"用户名",field:"userCode",click:function(e){
                    editPerson(e.data.row.userUuid);
                }},
                {name:"姓名",field:"userName"},
                {name:"员工编号",field:"userCode"},
                {name:"办公电话",field:"officePhone"},
                {name:"移动电话",field:"phone"},
                {name:"邮件",field:"email"},
                {name:"序号",field:"sort"}
            ],
            data:{
                "type":"URL",
                //"value":getServer()+"/org/data/Persons.json"
                "value": getServer() + "/sword/org/user/"+ serviceName
            }
        };
        Grid.init($.extend(config,extendCofig||OrgUtil.gridDefaultConfig));
    };

    /**
     * 人员保存
     */
    var savePsnBtnBind = function(){
        $("#savePsnBtn").bind("click",function(){
            //表单验证
            if($("#UserForm").valid()){
                var data = {
                    "PersonInfo":JSON.stringify(Tool.serialize("UserForm")),
                    "delDepts":JSON.stringify(Tool.jsonArrayIntersection(_Model.Depts.old,_Model.Depts.new,deptRule)),
                    //取new对old的差集，即new中有而old中没有的部分
                    "addDepts":JSON.stringify(Tool.jsonArrayIntersection(_Model.Depts.new,_Model.Depts.old,deptRule)),
                    "delRoles":JSON.stringify(Tool.jsonArrayIntersection(_Model.Roles.old,_Model.Roles.new,roleRule)),
                    "delGws":JSON.stringify(Tool.jsonArrayIntersection(_Model.GWs.old,_Model.GWs.new,gwRule)),
                    "userCert":JSON.stringify({
                        "userUuid":$("#userUuid").val(),
                        "locked":$("input[name='locked']:checked").val()
                    })
                };
                //console.log(data);
                //return ;

                $.ajax({
                    url:getServer()+"/sword/org/user/saveUser",
                    dataType:"json",
                    data:data,
                    success:function(data){
                        if(data.status){
                            Grid.getGrid("OrgPersonList").refresh();
                        }
                        Util.alert(data.message);
                    }
                })
            }
        });
    };

    var deptRule = function(one,two){
        return one.deptUuid==two.deptUuid?true:false;
    };

    /**
     * 添加部门
     */
    var addDeptBtnBind = function(){
        $("#addDeptBtn").bind("click",function(){

            var dept = {
                "deptUuid":$("#deptUuid").val(),
                "deptName":$("#deptName").val(),
                "deptCode":$("#deptCode").val(),
                "ou":$("#ou").val(),
                "jz":$("input[name='jzFlag']:checked").val()
            };
            if(Tool.indexOfJsonArray(dept,_Model.Depts.new,deptRule)==-1){
                _Model.Depts.new.push(dept)
            }
            //重新渲染部门表格
            $("#PsnDeptList").empty().append(Util.template("T_PersonDept",{"Depts":_Model.Depts.new}));
            return false;
        });
    };

    /**
     * 删除部门事件绑定
     */
    var delDeptBtnBind = function(){
        $("#PsnDeptList").bind("click",function(e){
            if(e.target.tagName.toLowerCase()=="i"){
                var $curTrTds = $(e.target.parentNode.parentNode).find("td");
                var index = Tool.indexOfJsonArray({"deptUuid":$curTrTds[0].innerText},_Model.Depts.new,deptRule);
                _Model.Depts.new.splice(index,1);
                //重新渲染部门表格
                $("#PsnDeptList").empty().append(Util.template("T_PersonDept",{"Depts":_Model.Depts.new}));
            }
        });
    };

    var roleRule = function(one,two){
        return one.roleUuid==two.roleUuid?true:false;
    };

    /**
     * 删除角色事件绑定
     */
    var delRoleBtnBind = function(){
        $("#PsnRoleList").bind("click",function(e){
            if(e.target.tagName.toLowerCase()=="i"){
                var $curTrTds = $(e.target.parentNode.parentNode).find("td");
                var index = Tool.indexOfJsonArray({"roleUuid":$curTrTds[0].innerText},_Model.Roles.new,roleRule);
                _Model.Roles.new.splice(index,1);
                //重新渲染角色表格
                $("#PsnRoleList").empty().append(Util.template("T_PersonRoles",{"Roles":_Model.Roles.new}));
            }
        });
    };

    var gwRule = function(one,two){
        return (one.gwUuid==two.gwUuid&&one.deptUuid==two.deptUuid)?true:false;
    };

    /**
     * 删除岗位事件绑定
     */
    var delGwBtnBind = function(){
        $("#PsnGwList").bind("click",function(e){
            if(e.target.tagName.toLowerCase()=="i"){
                var $curTrTds = $(e.target.parentNode.parentNode).find("td");
                var index = Tool.indexOfJsonArray({"gwUuid":$curTrTds[0].innerText},_Model.GWs.new,gwRule);
                _Model.GWs.new.splice(index,1);
                //重新渲染岗位表格
                $("#PsnGwList").empty().append(Util.template("T_PersonGW",{"GWs":_Model.GWs.new}));
            }
        });
    };


    return {
        importPerson:importPerson,
        addPerson:addPerson,
        showPersonList:showPersonList
    }
});