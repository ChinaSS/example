define(["HomeApp","UtilDir/util","UtilDir/grid","UtilDir/treeDialog","CommonDir/dict"],function(HomeApp,util,grid,treeDialog,dict){
/*
 * define的注释:待补充
   service中的内容:


*/	
    /*HomeApp.factory("ResourceService",function(){

    });*/

    var validate = function(){//校验
        
        $("#userFormId").validate({//数据验证   为什么外面还要套一层?
            rules:{//要校验的字段及校验规则
            	loginname:{
	               required:true,
	               maxlength:80,
	               remote:{ //验证用户名是否存在  
	                  type:"POST",  //请求方式
	                  url: getServer()+"/user/validateLoginname", //请求的服务  
	                  data:{  //要传递的参数
	                       loginname:function(){return $("#loginname").val();}  
	                  }  
	               }
           	    },
            	username:{
            	   required:true,
            	   maxlength:80
            	},
            	dictUserType:"required",
            	address:{
            		maxlength:400
            	},
            	tel:{
            		phone:true
            	},
            	mobile:{
            		mobile:true
            	},
            	email:{
            		email:true
            	},
            	userNum:{
            		digits:true//整数
            	}
       
            },
            messages: {//校验提示信息
            	loginname:{
            		required:"请输入登录名！",//针对必录校验的提示信息
            		maxlength:"长度不能超过80个字符",//针对长度校验的提示信息
            		remote:"登录名已存在,请重新输入"//针对登录名是否已存在校验的提示信息
            	},
            	username: "请输入姓名,且长度不超过80个字符！",
            	dictUserType:"请输入用户类型",
            	address:"地址长度不能超过400个字符",
            	tel:"请输入正确的电话号码",
            	mobile:"请输入正确的手机号码",
            	email:"请输入正确的邮箱地址",
            	userNum:"排序序号只能输入整数"
            }
        });
        
    };//end  validate
    
    var showSlidebar = function(){
        //弹出侧边栏
        util.slidebar({
            id:"userEditPanel",
            width:"500px",
            afterLoad:function(){
                validate();
            }
        });
    };
    
	var getRealData = function(url){//处理后台传递给ztree的数据
		var data = null;
    	$.ajax({
    		url:url,
    		async:false,
            dataType:"json",
            "success":function(d){//操作成功后调整
            	data = d.curPageData;
            }
    	})
    	return data;
	}

     var  userListInit = function(id,$scope){//用户列表初始化
    	 
        var config = {
            id:"userList",
            placeAt:"userListId",            //存放Grid的容器ID
            pageSize:10,                         //一页多少条数据
            index:"checkbox",                   //首列为单选[radio]还是多选[checkbox],默认checkbox
            layout:[                           //列表各标题
                {name:"登录名",field:"loginname",click:function(e){
                    var id = e.data.row.userId;
                    $.ajax({
                        "url":getServer()+"/user/query?userId="+id,
                        async:false,
                        dataType:"json",
                        "success":function(d){//操作成功后调整
                            //设置资源数据
                            $scope.$apply(function () {
                                $scope.user.entity = d.entity;
                                $scope.user.sexCodes = dict.sexCodes();//性别代码表数据
                                $scope.user.userTypeCodes = dict.userTypeCodes();//用户类型代码表数据
                                $scope.user.userModify = true;//新增修改状态设置为修改状态 控制用户名只读状态
                            });
                            showSlidebar();
                        }
                    });
                }},
                //分配角色操作链接
                {name:"分配角色",field:"分配角色",click:function(e){
                	var id = e.data.row.userId;
                	treeDialog({    /* 初始化treeDialog */
                        title : "角色列表",//弹出框标题
                        data : getRealData(getServer()+"/user/queryRoleTreeData?userId="+id),
                        selectMulti : true,//是否启用tree数据多选功能
                        dataModal : "changed",
                        callback : function(data){//点击保存按钮后调用调处理函数,仅接受一个数据参数(这个参数是选中的数据)
                    	   //新增,删除列表数据构造
                           var addRoleIds=[];//新增的角色id
                           var delRoleIds=[];//删除的角色id
                           for(var i=data.length;i--;){
                             if(data[i].checkedOld){//如果变化的节点原来是选中状态则,该节点已被取消选中
                           	  delRoleIds.push(data[i].roleId);
                             }else{//否则就是新选中的节点
                           	  addRoleIds.push(data[i].roleId);
                             }
                           }
                            //保存数据
                            $.ajax({//发送保存数据请求
                                "url":getServer()+"/user/saveUserRole",
                                "type":"POST",
                                "data": "addRoleIds="+addRoleIds.join(",")+"&delRoleIds="+delRoleIds.join(",")+"&userId="+id,//用逗号分隔
                                "dataType":"json",
                                "success":function(data){
                                  if(data.status=="200"){
                                        util.alert("保存成功.");
                                    }
                                },
                                "error":function(XMLHttpRequest, textStatus, errorThrown ){
                                    util.alert("保存失败.");
                                }
                            });//end ajax

                         },
                        setting : {//树的属性
                            view : {
                                showIcon : false //是否显示图标
                            },
                        	check : {
                        		enable : true  //是否启用复选框
                        	},
                        	data : {
                        		key : {
                        			checked  : "checked",//指定标记节点选中状态的字段
                        			childern : "roleId",//指定节点值使用的字段
                        			name : "roleName"  //指定节点名称使用的字段
                        		}
                         	}
                        }
                    });
                	
                },format:function(obj){//处理显示值  obj作用待定
                	return "分配角色";
                }},
                {name:"姓名",field:"username"},
                {name:"性别",field:"dictSexName"},
                {name:"锁定标记",field:"islocked",format:function(obj){
                	//console.log(obj);//查看obj对象内容
                	return obj.row.islocked==='Y'?'锁定':'未锁定';
                }}
                
            ],//end layout
            
            toolbar:[
                {name:"添加",class:"fa fa-plus-circle",callback:function(event){
                    //清空资源数据
                    $scope.$apply(function () {
                        $scope.user.entity = {};
                        $scope.user.sexCodes = dict.sexCodes();//性别代码表数据
                        $scope.user.userTypeCodes = dict.userTypeCodes();//用户类型代码表数据
                        $scope.user.userModify = false;//状态设置为新增状态
                    });
                    showSlidebar();
                }},
                /*{name:"编辑",class:"fa fa-edit",callback:function(event){
                 console.log('编辑')
                 }},*/
                {name:"删除",class:"fa fa-trash-o",callback:function(event){
                    var selected = gridInstance.getSelectedRow();
                    if(selected.length){
                        var userIds = [];
                        for(var i= 0,item;item=selected[i++];){
                        	userIds.push(item.userId);
                        }
                        $.ajax({
                            "url":getServer()+"/user/remove",
                            "type":"POST",
                            "data":"userIds="+userIds.join(","),//userIds为后台定义的要接受的参数
                            "dataType":"json",
                            "success":function(data){
                                if(data.status=="200"){
                                    //表格刷新
                                 	userListInit("root",$scope);
                                    util.alert("删除成功.");
                                }
                            },
                            "error":function(XMLHttpRequest, textStatus, errorThrown ){
                                util.alert("删除失败.");
                            }
                        });
                    }else{
                        util.alert("请选择要删除的数据.");
                    }
                }}
            ],//end toolbar
            
            data:{type:"URL",value:getServer()+"/user/page"} //指定获取数据的url
        };//end config
        
        gridInstance = grid.init(config);//用config初始化grid
    
     };//end 用户列表初始化
     
    //return中定义一个变量,并制定变量对应的函数,在ctrl中调用service中的这个变量就是调用变量对应的方法
    return {
        userListInit:userListInit
    };
});