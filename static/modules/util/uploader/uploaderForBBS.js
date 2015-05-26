/**
 * 创建一个给bbs使用的上传面板
 */
define(["PDUtilDir/uploader/uploader",
        "PDUtilDir/util",
        "css!PDUtilDir/css/util.css",
        "css!PDUtilDir/css/uploader.css"],function(Uploader,Util){
	var pickerName="bbs_upload_picker";
	
	/**
	 * 创建bbs uploader
	 */
	function createBBSUploader(settings){
		const MaxFileSize=5242880;
		var localOpt={};
		if(settings.insert){
			localOpt.insert=settings.insert;
		}
		if(settings.fileSingleSizeLimit){
			localOpt.fileSingleSizeLimit=
				settings.fileSingleSizeLimit>MaxFileSize ? MaxFileSize : settings.fileSingleSizeLimit;
		}
		var $parentDiv=$("#"+settings.parentDivId);
		var uploaderInstance;
		var pickInstance=pickerName+"_"+new Date().getTime();
		var setting={
				//  注意pick这时 无法正常替换成文件选择控件
		};
		localOpt=$.extend(localOpt,settings.options);
		//  这里的server url 可以考虑集群~
		localOpt.server=localOpt.server ? localOpt.server : getServer() +"/sword/fileUpload/";
		if($parentDiv.length>0){
			localOpt.server=localOpt.server+"?mode=Simple";
			localOpt.chunked=false;
			setting.pick={
					id:"#"+pickInstance,
					multiple:false
			};
			uploaderInstance=new BBSUploader($parentDiv,$.extend(localOpt,setting)).renderer();
		}
		return uploaderInstance;
	}
	
	/**
	 * uploader 对象
	 */
	function BBSUploader($parent,options){
		this.$parent=$parent;				//  父容器
		this.options=options;				//  配置
		this.pickerName=options.pick.id;	//  选择文件的组件，html或flex的id
		this.methodObj=null;				//  扩展方法
		this.uploader=null;					//  webUploader实例
		this.$container=null;				//  该组件的包装容器
		this.$add=null;						//  工具栏
		this.$content=null;					//  内容
		this.$info=null;					//  状态栏
		this.$upload=null;					//  上传按钮
		this.items=[];						//  BBSItem对象的集合
	} 
	
	BBSUploader.prototype.renderer=function(){
		var me=this;
		var $parent=me.$parent;
		$parent.toggle();
		var containerClass="bbs_FileUpload";
		var infoBarClass="bbs_infoBar";
		var html="<div class=\""+containerClass+" cs-bbs-uploader\"></div>";
		me.$content=$("<ol></ol>");
		me.$add=$("<li><a id=\""+me.pickerName.substring(1)+"\"><i class=\"fa fa-plus-circle\"></i>选择文件</a></li>");
		me.$info=$("<p class=\"text-muted small\">请选择文件...</p>");
		me.$upload=$("<li><a><i class=\"fa fa-cloud-upload\"></i>上传</a></li>");
		
		var $infobar=$("<ul></ul>");
		$infobar.append(me.$add)
				.append($("<li></li>").append(me.$info))
				.append(me.$upload)
				.append("<li><span class=\"text-danger small\">* 最大5M</span></li>");
		me.$container=$(html).append($("<div class=\""+infoBarClass+"\"></div>").append($infobar))
							 .append("<div class=\"clearfix\"></div>")
							 .append(me.$content);
		$parent.empty().append(me.$container).fadeIn();
		//  实际转换uploader的dom对象
		me.options.pick=$(me.pickerName).parent()[0];
		//  实例化uploader
		me.methodObj=createBBSMethod(me);
		if(me.options&&me.methodObj){
			var extendedMethod=Uploader.createExtendedMethods(me.methodObj);
			me.uploader=Uploader.initUploader(me.options,extendedMethod);
		}
		
		//  绑定事件
		me.$upload.bind("click",function(){
			me.uploader.upload();
		});
		return me;
	};
	/**
	 * reset
	 */
	BBSUploader.prototype.reset=function(){
		var me=this;
		me.$info.empty().html("请选择文件...").removeClass("text-danger");
		me.uploader.reset();
	};
	
	function BBSItem(parent,file){
		this.owner=parent;
		this.file=file;
		this.url=null;
		this.$container=null;
		this.$insert=null;
		this.result=null;
	}
    
	
	BBSItem.prototype.renderer=function(){
		var me = this;
		var insertFunc=me.owner.options.insert;
		me.$insert=$("<a href=\"#\">[插入]</a>").click(function(){
			if( typeof(insertFunc)== "function"){
				insertFunc.apply(this,[me.url]);
			}else{
				console.log("Has no method to process insert["+me.url+"]");
			}
		});
		var html="<li></li>";
		me.$container=$(html).append("<span></span>").append(me.$insert);
		me.owner.$content.append(me.$container.toggle());
		return me;
	};
	BBSItem.prototype.uploadComplete=function(){
		var me = this;
		if(me.url){
			me.$container.find("span").empty().html(me.url).fadeIn();
		}
		me.owner.items.push(me);
	};
	
	/**
	 * 
	 */
	function createBBSMethod(bbsUploader){
		var bbsUploaderObj={
				afterFileAdd:function(file){
					// 单文件上传时，注册该方法
					bbsUploader.$info.empty().html(file.name);
				},
				fileMd5Progress:function(file,percentage){
				},
				afterMd5Check:function(file){
				},
				uploadStart:function(file){
				},
				uploadProgress:function(file,percentage){
				},
				uploadError:function(file,reason){
					var info=reason?"{"+reason+"}":"";
					bbsUploader.$info.empty().html("上传失败..."+info).addClass("text-danger");
				},
				afterUploadSuccess:function(file,data){
					var item=new BBSItem(bbsUploader,file).renderer();
					item.result=data;
					item.url=data.url;
					item.uploadComplete();
				},
				uploadComplete:function(file){
					bbsUploader.reset();
				},
				uploadFinished:function(){
				},
				error:function(type){
					console.log("error:"+type);
					if("F_EXCEED_SIZE"==type){
						Util.alert("文件大小超限！");
					}
				}
		};
		return bbsUploaderObj;
	}
	
	return {
		createBBSUploader:createBBSUploader
	};
});