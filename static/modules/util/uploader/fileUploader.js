define(["PDUtilDir/uploader/uploader",
        "PDUtilDir/util",
        "PDUtilDir/dialog",
        "css!PDUtilDir/css/util.css"],function(Uploader,Util,Dialog){
	var pickerName="upload_picker";
	/**
	 * 提供json对象传参
	 */
	var createFileUploaderBySettings=function(settings){
		var type=settings.type || "single";					//		single/multiple
		var mode=settings.mode || "simple";					//		simple/mixed
		var options={};
		if(settings.deleteFile){
			options.deleteFile=settings.deleteFile;
		}
		if(settings.callback){
			options.callback=settings.callback;
		}
		createFileUploader(settings.parentDivId,type,mode,$.extend(options,settings.options));
	};
	
	/**
	 * 创建fileuploader相关标签及对象
	 * parentDivId：放置整个上传组件的父容器id
	 * type：单文件上传single或多文件上传multiple
	 * mode：运行模式：simple（不分片、不续传）、mixed（分片、且续传）
	 * options：包含server、webUploader其他扩展参数
	 */
	var createFileUploader=function(parentDivId,type,mode,options){
		var $parentDiv=$("#"+parentDivId);
		var uploaderInstance;
		var pickInstance=pickerName+"_"+new Date().getTime();
		var setting={
				//  注意pick这时 无法正常替换成文件选择控件
		};
		options= options|| {};
		var localOptions=$.extend(localOptions,options);
		//  这里的server url 可以考虑集群~
		localOptions.server=localOptions.server ? localOptions.server : getServer() +"/sword/fileUpload/";
		if($parentDiv.length>0){
			if("simple"==mode){
				localOptions.server=localOptions.server+"?mode=Simple";
				localOptions.chunked=false;
			}else if("mixed"==mode){
				localOptions.server=localOptions.server+"?mode=Mixed";
				localOptions.chunked=true;
				setting.chunkSize=5242880;											//  5M
				setting.threads=3;	
			}else{
				var fileUploadHtmls="<p class=\"text-danger\">参数错误：运行模式选择错误！（模式包括simple/mixed）</p>";
				$parentDiv.append(fileUploadHtmls);
			}
			if("single"==type){
				setting.pick={
						id:"#"+pickInstance,
						multiple:false
				};
				uploaderInstance=new SingleFile($parentDiv,$.extend(localOptions,setting)).renderer();
			}else if("multiple"==type){
				setting.pick={
						id:"#"+pickInstance,
						multiple:true
				};
				uploaderInstance=new MultipleFile($parentDiv,$.extend(localOptions,setting)).renderer();
			}
		}
		return uploaderInstance;
	};
	
	/** +++++++++++++++++++++ 单个文件 ++++++++++++++++++++++ **/
	
	function SingleFile($parent,options){
		this.$parent=$parent;				//  父容器
		this.options=options;				//  配置
		this.pickerName=options.pick.id;	//  选择文件的控件,包括input、img等等,该实例中是用input
		this.methodObj=null;				//  扩展方法
		this.file=null;						//  当前文件
		this.uploader=null;					//  webUploader实例
		this.result={};						//  该文件上传后的返回信息
		this.$container=null;				//  该组件包装容器
		this.$status=null;					//  状态栏
		this.$upload=null;					//  上传按钮
		this.$pause=null;					//  暂停按钮（与上传按钮互斥）
		this.$remove=null;					//  删除按钮
	}
	SingleFile.prototype.renderer=function(){
		var me =this;
		var $parent=me.$parent;
		$parent.toggle();
		var containerClass="singleFileUpload";
		var pickerName=me.pickerName;  //  获取selector 的id~注意 这时候还没有该dom
		var html="<div class=\""+containerClass+" cs-sUpload\">" +
				"<div>" +
				"<input type=\"text\" class=\"form-control\" " +
				"id=\""+pickerName.substring(1)+"\">" +
				"</div></div>";
		me.$upload = $('<i class="fa fa-upload" title="上传"></i>')
							.bind('click',function(){ 
								if($(pickerName).val()){
									me.ready(); 
									me.$remove.show();
									me.start();
								}else{
									Util.alert("请选择文件！");
								}
							}).toggle();
        me.$pause = $('<i class="fa fa-pause" title="暂停"></i>')
        					.bind('click',function(){ 
        						console.log("me:Pause");
        						me.pause(); 
        					});
		me.$remove = $('<i class="fa fa-times" title="删除"></i>')
							.bind('click',function(){ 
								console.log("me:Delete");
								me.remove(); 
							});
		me.$status = $('<p class="text-muted help-block"></p>').text("请选择文件...");
		me.$container=$(html);
		me.$container.append(me.$upload).append(me.$pause)
					.append(me.$remove).append(me.$status);
		$parent.append(me.$container).fadeIn();
		//  实际转换uploader的dom对象
		me.options.pick=$(pickerName).parent()[0];
		me.methodObj=createSingleMethod(me);
		//  初始化uploader
		if(me.options&&me.methodObj){
			var extendedMethod=Uploader.createExtendedMethods(me.methodObj);
			me.uploader=Uploader.initUploader(me.options,extendedMethod);
		}
		return me;
	};
	
	SingleFile.prototype.ready=function(){
		this.$upload.toggle();
		this.$pause.toggle();
		this.$remove.toggle();
	};
	SingleFile.prototype.start=function(){
		this.uploader.upload();
	};
	SingleFile.prototype.pause=function(){
		this.uploader.stop(true);
		this.$upload.toggle();
		this.$pause.toggle();
		this.$remove.show();
	};
	SingleFile.prototype.remove=function(){
		var me=this;
		//  调用setting中注入的deleteFile方法
		if(me.options.deleteFile){
			me.options.deleteFile.apply(this,[this,this.file]);
		}
		//  调用默认的删除动作
		var info="是否删除已上传文件？若文件已上传，" +
				"点击“确定”后将直接删除服务器端已上传文件，" +
				"点击“取消”则只重置页面元素！";
		Util.confirm("<i class=\"fa fa-info fa-2\"></i>&nbsp;"+info,function(){
			deleteUploadedFile(me.options.server,[me]);
			me.reset();
		},function(){
			me.reset();
		});
	};
	SingleFile.prototype.reset=function(){
		this.file=null;
		$(this.pickerName).val("");
		//  仅重置上传队列
		this.uploader.reset();
		this.$status.empty().text("请选择文件...");
		this.ready();
	};
	
	/**
	 * 根据实例生成扩展方法
	 */
	function createSingleMethod(singleFile){
		var singleMethodObj={
				afterFileAdd:function(file){
					//  input 显示文件名
					$(singleFile.pickerName).val(file.name);
					singleFile.file=file;
					//  status 更改状态
					singleFile.$status.empty().text("准备校验...");
				},
				/*afterFilesAdd:function(files){
					//   如果是多文件上传，可以注册该方法
				},*/
				fileMd5Progress:function(file,percentage){
					//  status 更改状态
					singleFile.$status.empty().text("MD5校验中...("+percentage+"%)");
				},
				afterMd5Check:function(file){
					//  status 更改状态
					singleFile.$status.empty().text("检查服务器状态，准备上传...");
				},
				uploadStart:function(file){
					//  status 更改状态
					updateProcessBar(singleFile.$status);
				},
				uploadProgress:function(file,percentage){
					updateProcessBar(singleFile.$status,percentage);
				},
				uploadError:function(file,reason){
					//  status 更改状态
					var info=reason?"{"+reason+"}":"";
					singleFile.$status.empty().text("上传失败..."+info);
				},
				afterUploadSuccess:function(file,data){
					singleFile.result=data;
					singleFile.$status.empty().text("上传成功！");
				},
				uploadComplete:function(file){
					console.log("上传完毕~");
					if(singleFile.options.callback){
						singleFile.result.file=file;
						singleFile.options.callback(singleFile);
					}
//					singleFile.reset();
				},
				error:function(type){
					
				}
		};
		return singleMethodObj;
	}
	
	/** +++++++++++++++++++++ 多个文件 ++++++++++++++++++++++ **/
	
	function MultipleFile($parent,options){
		this.$parent=$parent;				//  父容器
		this.options=options;				//  配置
		this.pickerName=options.pick.id;	//  选择文件的组件，html或flex的id
		this.methodObj=null;				//  扩展方法
		this.uploader=null;					//  webUploader实例
		this.$container=null;				//  该组件的包装容器
		this.$toolbar=null;					//  工具栏
		this.$content=null;					//  内容
		this.$status=null;					//  状态栏
		this.$upload=null;					//  上传按钮
		this.items=[];					//  uploadItem对象的集合
	}
	/**
	 * MultipleFile 的 dom渲染器
	 * @returns {MultipleFile}
	 */
	MultipleFile.prototype.renderer=function(){
		var me=this;
		var $parent=me.$parent;
		$parent.toggle();
		var containerClass="multipleFileUpload";
		var html="<div class=\""+containerClass+" cs-upload\"></div>";
		me.$container=$(html);
		toolbarRenderer(me);
		contentRenderer(me);
		statusRenderer(me);
		
		$parent.empty().append(me.$container).fadeIn();
		//  实际转换uploader的dom对象
		me.options.pick=$(me.pickerName).parent()[0];
		
		me.methodObj=createMultipleMethod(me);
		//  初始化uploader
		if(me.options&&me.methodObj){
			var extendedMethod=Uploader.createExtendedMethods(me.methodObj);
			me.uploader=Uploader.initUploader(me.options,extendedMethod);
		}
		return me;
	};
	/**
	 * 渲染 toolbar
	 */
	function toolbarRenderer(multipleFileIns){
		var pickerName=multipleFileIns.pickerName;  //  获取selector 的id~注意 这时候还没有该dom
		var html = '<div class="cs-upload-toobar">'+
		         '<ul>'+
		             '<li class="first"><a id="'+pickerName.substring(1)+'">'+
		             	'<i class="fa fa-plus-circle">&nbsp;</i>添加'+
		             '</a></li>'+
		             /*'<li><a><i class="glyphicon glyphicon-upload">&nbsp;</i>开始上传</a></li>'+*/
		         '</ul>'+
		     '</div>';
		multipleFileIns.$toolbar = $(html);
		// 添加上传事件
		var $startUpload = $('<li><a><i class="fa fa-cloud-upload">&nbsp;</i>开始上传</a></li>').bind('click',function(){
			multipleFileIns.uploader.upload();
		});
		// 添加重置事件
		var $reset = $('<li><a><i class="fa fa-reply-all">&nbsp;</i>重置</a></li>').bind('click',function(){
			multipleFileIns.resetAll();
		});
		multipleFileIns.$toolbar.find("ul").append($startUpload).append($reset);
		
		//把操作栏添加到上传组件面板中
		multipleFileIns.$container.append(multipleFileIns.$toolbar);
	}
	/**
	 * 渲染content
	 */
	function contentRenderer(multipleFileIns){
        var html = '<table class="table table-hover" style="word-break: break-all;">'+
                        '<tr>'+
                            '<td width="50%">附件名称</td>'+
                            '<td>大小</td>'+
                            '<td>状态</td>'+
                            '<td width="13%">操作</td>'+
                        '</tr>'+
                    '</table>';
        multipleFileIns.$content = $(html);
        multipleFileIns.$container.append(multipleFileIns.$content);
    };
    /**
     * 渲染status
     */
    function statusRenderer(multipleFileIns){
    	var html = '<div class="text-muted help-block"></div>';
    	multipleFileIns.$status = $(html);
    	multipleFileIns.$container.append(multipleFileIns.$status);
    }
    /**
     * 重置多文件上传相关资源
     */
    MultipleFile.prototype.resetAll=function(){
		var me = this;
		// 重置dom
		me.$content.find("tr").slice(1).remove();
		me.$status.empty();
		// 队列清空
		me.uploader.reset();
		// 对象数组清空
		me.items=[];
	};
	
	function UploadItem(parent,file){
		this.owner=parent;
		this.file=file;
		this.result=null;
		this.$container=null;
		this.$info=null;
		this.$remove=null;
	}
	
	UploadItem.prototype.renderer=function(){
		var me = this;
		var webUploader=me.owner.uploader;
		var html = '<tr>'+
			        '<td>'+ me.file.name +'</td>'+
			        '<td>'+ webUploader.formatSize(me.file.size, 2) +'</td>'+
			        /*'<td>待上传</td>'+*/
			    '</tr>';
		me.$container = $(html);
		//状态栏
		me.$info    = $('<td>待上传</td>');
		me.$container.append(me.$info);
		//操作栏
		var $operation = $('<td></td>');
		me.$remove = $('<i class="glyphicon glyphicon-trash"></i>')
							.bind('click',function(){
								me.remove();
							});
		$operation.append(me.$remove);
		me.$container.append($operation);
		me.owner.$content.append(me.$container);
		return me;
	};
	
	UploadItem.prototype.remove=function(){
		var me = this;
		// 判断文件状态，如果已上传~则需要删除文件，如果未上传~则只删除content内容
		var fileState=me.file.getStatus();
		if(fileState=="progress"||fileState=="complete"){
			//  需要删除
			//  调用setting中注入的deleteFile方法
			if(me.owner.options.deleteFile){
				me.owner.options.deleteFile.apply(this,[this,this.file]);
			}
			//  调用默认的删除操作
			//为弹出框增加操作按钮
			var info="是否删除已上传文件？若文件已上传，" +
			"点击“确定”后将直接删除服务器端已上传文件，" +
			"点击“取消”则只重置页面元素！";
			Util.confirm("<i class=\"fa fa-info fa-2\"></i>&nbsp;"+info,function(){
				deleteUploadedFile(me.owner.options.server,[me]);
                otherRemove();
			},function(){
				otherRemove();
			});
		}
		function otherRemove(){
			// item列表中移除
			removeListItem(me.owner.items,me,"file.id");
			// 上传队列中移除
			me.owner.uploader.removeFile(me.file,true);
			//  刷新状态栏
			me.owner.uploader.trigger("uploadComplete",me.file);
			// 移除dom
			me.$container.remove();
		}
		
	};
	
	function createMultipleMethod(multipleFile){
		var multipleMethodObj={
				/*afterFileAdd:function(file){
					// 单文件上传时，注册该方法
				},*/
				afterFilesAdd:function(files){
					//   如果是多文件上传，可以注册该方法
					for(var i=0;i<files.length;i++){
						var item=new UploadItem(multipleFile,files[i]).renderer();
						multipleFile.items.push(item);
					}
				},
				fileMd5Progress:function(file,percentage){
					var uploadItem=findItemByFile(multipleFile.items,file);
					if(uploadItem){
						uploadItem.$info.empty().append('MD5 校验中('+percentage +"%)");
					}
				},
				afterMd5Check:function(file){
					var uploadItem=findItemByFile(multipleFile.items,file);
					if(uploadItem){
						uploadItem.$info.empty().append("检查服务器状态，准备上传...");
					}
				},
				uploadStart:function(file){
					var uploadItem=findItemByFile(multipleFile.items,file);
					if(uploadItem){
					//  status 更改状态
						updateProcessBar(uploadItem.$info);
					}
				},
				uploadProgress:function(file,percentage){
					var uploadItem=findItemByFile(multipleFile.items,file);
					if(uploadItem){
						updateProcessBar(uploadItem.$info,percentage);
					}
				},
				uploadError:function(file,reason){
					var uploadItem=findItemByFile(multipleFile.items,file);
					if(uploadItem){
						var info=reason?"{"+reason+"}":"";
						uploadItem.$info.empty().append("上传失败..."+info).addClass("text-danger");
					}
				},
				afterUploadSuccess:function(file,data){
					var uploadItem=findItemByFile(multipleFile.items,file);
					if(uploadItem){
						uploadItem.$info.empty().append("已上传");
						uploadItem.result=data;
					}
				},
				uploadComplete:function(file){
				//  改变全局status状态
					var curStats=multipleFile.uploader.getStats();
					var stats="成功<span class=\"text-success\">"+curStats.successNum+"</span>个，" +
								"失败<span class=\"text-danger\">"+curStats.uploadFailNum+"</span>个，" +
								"未上传<span class=\"text-primary\">"+curStats.queueNum+"</span>个";
					multipleFile.$status.empty().append(stats);
				},
				uploadFinished:function(){
					if(multipleFile.options.callback){
						multipleFile.options.callback(multipleFile.items);
					}
				},
				error:function(type){
					
				}
		};
		return multipleMethodObj;
	}
	
	/** +++++++++++++++++++++ 多个文件结束，以下为公共方法 ++++++++++++++++++++++ **/
	
	/**
	 * 更新processbar
	 */
	function updateProcessBar($parent,percentage){
		var $stateInfo=$parent.find('div[class="progress-bar"]');
		if($stateInfo.length==0){
			var process="<div class=\"progress\">"+
						"<div class=\"progress-bar " +
						"progress-bar-info progress-bar-striped active\" " +
						"role=\"progressbar\" aria-valuenow=\"20\" " +
						"aria-valuemin=\"0\" aria-valuemax=\"100\" " +
						"style=\"width: 0 \">"+
						"<span class=\"sr-only\">0%</span>"+
						"</div> </div>";
			$parent.empty().append(process);
		}
		if(percentage>0){
			$parent.find('div.progress-bar')
						.css('width', percentage+'%')
						.html("<span class=\"sr-only\">"+percentage +"%</span>");
		}
		
	}
	
	/**
	 * 在itemArray中删除指定对象~ 删除依据为指定对象的指定属性名
	 * objArray：对象数组
	 * delObj：要删除的uploadItem对象
	 */
	function removeListItem(objArray,delObj){
		var id=delObj.file.id;
		if(objArray&&id){
			var delIdx=-1;
			for(var i=0;i<objArray.length;i++){
				var tempId=objArray[i].file.id;
				if(tempId==id){
					delIdx=i;
					break;
				}
			}
			return objArray.del(delIdx);
		}
		return objArray;
	}
	/**
	 * 从uploadItem数组中找到指定file对应的uploadItem对象
	 * objArray：uploadItem对象数组
	 * file：指定的file
	 */
	function findItemByFile(objArray,file){
		if(objArray&&file){
			for(var i=0;i<objArray.length;i++){
				var tempId=objArray[i].file.id;
				if(tempId==file.id){
					delIdx=i;
					return objArray[i];
				}
			}
			
		}
		return null;
	}
	/**
	 * 删除指定的files数组
	 */
	function deleteUploadedFile(serverurl,fileItems){
		var url=serverurl;
		if(url&&fileItems){
			var fids="";
			for(var i=0;i<fileItems.length;i++){
				var r=fileItems[i].result;
				if(r&&r.fid){
					fids+=","+r.fid;
				}
			}
			if(url.lastIndexOf("?")>0){
				url=url.slice(0,url.lastIndexOf("?"))+"?mode=delete";
			}
			$.ajax({
				url:url,
				type:"post",
				data:{fids:fids},
				beforeSend:function (XMLHttpRequest) {
 					XMLHttpRequest.setRequestHeader("SwordControllerName", "FileUploadController");
 				 },
				success:function(data){
					var info="";
					if(data){
						if(data.flag){
							info="删除成功！<br/>"+data.msg;
						}else{
							info="服务器已响应！<br/>"+data.msg;
						}
						Util.alert("<i class=\"fa fa-info fa-2\"></i>&nbsp;"+info);
					}
				}
			});
		}
	}
	
	/**
	 * 删除数组中下标为n的这一项，并返回该数组
	 * @param n
	 * @returns
	 */
	Array.prototype.del=function(n) {
		//n表示第几项，从0开始算起。
		//prototype为对象原型，注意这里为对象增加自定义方法的方法。
		if(n<0) //如果n<0，则不进行任何操作。
			return this;
		else
			return this.slice(0,n).concat(this.slice(n+1,this.length));
		/*
		　　　concat方法：返回一个新数组，这个新数组是由两个或更多数组组合而成的。
		　　　　　　　　　这里就是返回this.slice(0,n)/this.slice(n+1,this.length)
		　　 　　　　　　组成的新数组，这中间，刚好少了第n项。
		　　　slice方法： 返回一个数组的一段，两个参数，分别指定开始和结束的位置。
		*/
	};
	
	return {
		createFileUploader:createFileUploader,
		createFileUploaderBySettings:createFileUploaderBySettings
	};
});