define(['WebUploader','jquery','css!WebUploaderCss'],function(WebUploader,$){
	/**
	 * 实例化 webUploader对象，
	 * options：webUpload的配置
	 * extendMethods：生成的扩展方法注册对象
	 */
	var initUploader=function(options,extendMethods){
		var uploader;
	//  因有些配置信息固定不可改，所以options需要预处理后再合并到settings中
    	if(options==null){ 
    		options={};
    	}
    	options.auto=false;													//  是否自动上传
    	options.swf=getStaticPath() + 'modules/webuploader/Uploader.swf';	//  flash地址
//    	options.server=getServer() +"/sword/fileUpload/";
    	options.runtimeOrder='html5,flash';
    	options.prepareNextFile=true;
//    	options.chunked=true;
//    	options.chunkSize=5242880;											//  5M
//    	options.threads=3;													//  每个文件提供3个请求
    	options.resize=false;
    	options.duplicate=true;
    	options.sendAsBinary=false;
       
        var settings = {
        	formData:{},													//  向服务器额外发送的数据
            pick: '',                                                       //  上传按钮所在位置
	    	chunkRetry :2,													//  分片上传失败后重试
        };
        if(options.server&&extendMethods){
        	options.server=checkServerUrl(options.server);
//        	console.log("serverUrl:"+options.server);
        	if(options.chunked){  //  开启分片上传才注册
        		registerForWebUploader(WebUploader,options.server);
        	}
        	uploader=new WebUploader.Uploader($.extend(settings,options));
        	if(extendMethods instanceof ExtendMethods){
        		bindEvent(uploader,extendMethods);
        	}
        }
		return uploader;
	};
	
	/**
	 * 生成扩展方法对象
	 */
	var extendMethodsRegister= function(extendMethodsObj){
		return new ExtendMethods(extendMethodsObj);
	};
	
	/**
	 *  申明 extendMethods对象~
	 */
	function ExtendMethods(extendMethods){
		this._afterFileAdd=extendMethods.afterFileAdd;
		this._afterFilesAdd=extendMethods.afterFilesAdd;
		this._fileMd5Progress=extendMethods.fileMd5Progress;
		this._afterMd5Check=extendMethods.afterMd5Check;
		this._uploadStart=extendMethods.uploadStart;
		this._uploadProgress=extendMethods.uploadProgress;
		this._uploadError=extendMethods.uploadError;
		this._afterUploadSuccess=extendMethods.afterUploadSuccess;
		this._uploadComplete=extendMethods.uploadComplete;
		this._uploadFinished=extendMethods.uploadFinished;
		this._error=extendMethods.error;
	}
	
	ExtendMethods.prototype.afterFileAdd=function(file){
		typeof(this._afterFileAdd)=="function" && this._afterFileAdd(file);
	};
	ExtendMethods.prototype.afterFilesAdd=function(files){
		typeof(this._afterFilesAdd)=="function" && this._afterFilesAdd(files);
	};
	ExtendMethods.prototype.fileMd5Progress=function(file,percentage){
		typeof(this._fileMd5Progress)=="function" && this._fileMd5Progress(file,percentage);
	};
	ExtendMethods.prototype.afterMd5Check=function(file){
		typeof(this._afterMd5Check)=="function" && this._afterMd5Check(file);
	};
	ExtendMethods.prototype.uploadStart=function(file){
		typeof(this._uploadStart)=="function" && this._uploadStart(file);
	};
	ExtendMethods.prototype.uploadProgress=function(file,percentage){
		typeof(this._uploadProgress)=="function" && this._uploadProgress(file, percentage);
	};
	ExtendMethods.prototype.uploadError=function(file,reason){
		typeof(this._uploadProgress)=="function" && this._uploadError(file, reason);
	};
	ExtendMethods.prototype.afterUploadSuccess=function(file,responseData){
		typeof(this._afterUploadSuccess)=="function" && this._afterUploadSuccess(file, responseData);
	};
	ExtendMethods.prototype.uploadComplete=function(file){
		typeof(this._uploadComplete)=="function" && this._uploadComplete(file);
	};
	ExtendMethods.prototype.uploadFinished=function(){
		typeof(this._uploadFinished)=="function" && this._uploadFinished();
	};
	ExtendMethods.prototype.error=function(type){
		typeof(this._error)=="function" && this._error(type);
	};
	
	/**
	 * uploader实例中获取不Webuploader这一全局对象，
	 * 因此想使用formatSize方法时，将该全局对象的方法注册到
	 * 了uploader实例的原型链上
	 * @param size 字节数
	 * @param fixed 保留小数位数
	 * @returns
	 */
	WebUploader.Uploader.prototype.formatSize=function(size,fixed){ 
		var cnt=fixed||2;
		return WebUploader.Base.formatSize(size,cnt, ['B', 'K', 'M', 'G', 'TB']); 
	};
	
	/**
	 * 注册before-send方法
	 * @param webUpload
	 */
	function registerForWebUploader(webUpload,checkUrl){
		webUpload.Uploader.register({  
	        'before-send' : 'checkchunk',
	        'after-send-file':'checkFile'
	    }, {
	    	/**
	         * method:before-send
	         * 在分片发送之前request，可以用来做分片验证，如果此分片已经上传成功了，可返回一个rejected promise来跳过此分片上传
	         * para:block: 分片对象
	         */
	        checkchunk : function(block) {
	            var me = this; 
	            var owner = this.owner;
	            var deferred = $.Deferred();
	            var chunkFile = block.blob;
	            var file = block.file;
	            var chunk = block.chunk;
	            var chunks = block.chunks;
	            var start = block.start;
	            var end = block.end;
	            var total = block.total;

	            file.chunks = chunks;           

	            if(chunks>1){ //文件大于chunksize 分片上传
	                owner.md5File(chunkFile)            
	                .progress(function(percentage) {
	                    //分片MD5计算可以不知道计算进度
	                })  
	                .then(function(chunkMd5) {  
	                    //owner.options.formData.chunkMd5 = chunkMd5;
	                	var _chunk = block.chunk;
	     	            var _chunks = block.chunks;
	                    block.chunkMd5 = chunkMd5;
	                    var exist = false;
	                    var chunkSize=block.end-block.start;
	                    block.chunkSize=chunkSize;
	                    var isLast=false;
	                    if(block.total==block.end){
	                    	isLast=true;
	                    }
	                    $.ajax({
		   	        		 url:checkUrl+"check=true&md5="+file.statusText+"&chunkMd5="+chunkMd5+"&chunkSize="+chunkSize,
		   	        		 async:false,
		   	        		 type:"get",
		   	        		 beforeSend:function (XMLHttpRequest) {
	    	 					XMLHttpRequest.setRequestHeader("SwordControllerName", "FileUploadController");
	    	 				 },
		   	        		 success:function(data){
		   	        			 if (data&&data.chunkMd5==chunkMd5) {
		   	        				 exist=data.exist;
		   	        				 if (exist&&!isLast) {
		   	   	                        deferred.reject();
		   	   	                        // 触发 uploadProcess事件
		   	   	                        var percentage=(_chunk+1)*chunkSize/block.file.size;
		   	   	                        owner.trigger("uploadProgress",file,percentage);
		   	   	                     } else {                        
		   	   	                        deferred.resolve();
		   	   	                     }
		   	                     }  else{
//		   	                    	 console.log("分片验证失败！");
		   	                    	 deferred.resolve();
		   	                     }
		   	                             
		   	        		 },
		   	        		 error:function(xrh,data){
//		   	        			 console.log(data);
		   	        		 }
	   	        	 	});
	                           
	                });

	            }else{//未分片文件上传
	                block.chunkMd5 = file.statusText;
	                var chunkSize=block.end-block.start;
	                block.chunkSize=chunkSize;
	                deferred.resolve();
	            }           
	            return deferred.promise();
	        },
	        checkFile:function(object){
	        	console.log("chunks uploadTask over!");
	        }
	    }); 
	}
	/**
	 * 给uploader绑定事件，同时将扩展事件添加进去
	 */
	function bindEvent(uploader,extendMethods){
		/**
		 * 当文件被加入队列以后触发。
		 */
		uploader.on( 'fileQueued', function( file ) {
			extendMethods.afterFileAdd(file);
			uploader.md5File( file )
	        // 及时显示进度
	        .progress(function(percentage) {
	        	var process=Math.round(percentage*10000)/100;
//	            console.log('Percentage:'+ process+"%");
	        	extendMethods.fileMd5Progress(file,process);
	        })
	        // 完成
	        .then(function(val) {
	        	file.statusText=val;
	        	extendMethods.afterMd5Check(file);
	        	if(uploader.options.chunked){
	        		$.ajax({
		        		 url:uploader.options.server+"check=true&md5="+val,
		        		 async:false,
		        		 type:"get",
		        		 beforeSend:function (XMLHttpRequest) {
		 					XMLHttpRequest.setRequestHeader("SwordControllerName", "FileUploadController");
		 				 },
		        		 success:function(data){
//		        			 console.log("Data: " + data + "\n");
		        			 if(data.fid){
		        				 uploader.skipFile(file);
		        				 uploader.trigger('uploadSuccess',file,{data:data});
		        			 }else{
//		        				 console.log("start upload!");
		        				 if(uploader.options.auto){
		     	        			uploader.upload();
		     	        		}
		        			 }
		        		 },
		        		 error:function(xrh,data){
//		        			 console.log(data);
		        		 }
		        	});
	        	}else{
	        		if(uploader.options.auto){
	        			uploader.upload();
	        		}
	        	}
	        	
	        });
		});
		/**
         * 当一批文件添加进队列以后触发。
         */
        uploader.on( 'filesQueued', function( files ) {
        	extendMethods.afterFilesAdd(files);
            for(var i= 0,file;file=files[i++];){
            	var _file=file;
            	uploader.md5File( file )
    	        // 及时显示进度
    	        .progress(function(percentage) {
    	        	var process=Math.round(percentage*10000)/100;
//    	            console.log('Percentage:'+ process+"%");
    	        	extendMethods.fileMd5Progress(file,process);
    	        })
    	        // 完成
    	        .then(function(val) {
    	        	_file.statusText=val;
    	        	extendMethods.afterMd5Check(_file);
    	        	if(uploader.options.chunked){
	    	        	$.ajax({
	    	        		 url:uploader.options.server+"check=true&md5="+val,
	    	        		 async:false,
	    	        		 type:"get",
	    	        		 beforeSend:function (XMLHttpRequest) {
	    	 					XMLHttpRequest.setRequestHeader("SwordControllerName", "FileUploadController");
	    	 				 },
	    	        		 success:function(data){
	//    	        			 console.log("Data: " + data + "\n");
	    	        			 if(data.fid){
	    	        				 uploader.skipFile(_file);
	    	        				 uploader.trigger('uploadSuccess',_file,{model:data});
	    	        			 }else{
//	    	        				 console.log("start upload!");
	    	        				 if(uploader.options.auto){
	    	     	        			uploader.upload();
	    	     	        		}
	    	        			 }
	    	        		 },
	    	        		 error:function(xrh,data){
//	    	        			 console.log(data);
	    	        		 }
	    	        	});
    	        	}else{
    	        		if(uploader.options.auto){
    	        			uploader.upload();
    	        		}
    	        	}
    	        });
                
            }
        });
        /**
         * 当开始上传流程时触发。
         */
        uploader.on( 'uploadStart', function( file ) {
        	extendMethods.uploadStart(file);
        });
        /**
         * 每个请求前需要携带的参数
         */
        uploader.on("uploadBeforeSend",function(object,data,headers){
	    	var me=this;
	    	if(!object){
	    		headers={};
	    	}
	    	if(object.file){
	    		data["md5"]=object.file.statusText;
	    		data["chunkMd5"]=object.chunkMd5;
	    		data["chunkSize"]=object.chunkSize;
	    	}
	    	headers["SwordControllerName"]="FileUploadController";	//  new sword 特定上传请求头
	    });
        
        /**
         * 上传过程中触发，携带上传进度。
         */
        uploader.on( 'uploadProgress', function( file, percentage ) {
        	extendMethods.uploadProgress(file,(percentage*100).toFixed(2));
        });
        /**
         * 当文件上传出错时触发。
         */
        uploader.on( 'uploadError', function( file, reason ) {
        	extendMethods.uploadError(file,reason);
        });
        /**
         * 当文件上传成功时触发。
         */
        uploader.on( 'uploadSuccess', function( file, response ) {
        	var responseProcess=function(data,callback){
//		   		 		console.log("Data: " + data + "\n");
		   		 		if(data.fid&&data.filePath){
//		   		 			console.log("FID:"+data.fid+"\nFilePath:"+data.filePath);
		   		 			extendMethods.afterUploadSuccess(file,data);
		   		 			if(callback){
		   		 				callback(file);
		   		 			}
		   		 		}else{
//		   		 			console.log("upload error!");
		   		 			uploader.trigger('uploadError',file);
		   		 		}
        	};
        	if(response&&response.model){
        		responseProcess(response.model,function(file){
        			uploader.trigger("uploadComplete",file);
        		});
        		
        	}else{
        	//  获取文件上传的保存路径和fid
        		if(uploader.options.chunked){
	    	    	$.ajax({
	    	    		url:uploader.options.server+"check=true&queryResult=true&md5="+file.statusText,
	           		 	async:false,
	           		 	type:"get",
	           		 	beforeSend:function (XMLHttpRequest) {
	    					XMLHttpRequest.setRequestHeader("SwordControllerName", "FileUploadController");
	    				 },
	           		 	success:function(data){
	           		 		responseProcess(data);
	           		 	},
	           		 	error:function(xrh,data){
//	           		 		console.log(data);
	           		 	}
	    	    	});
        		}
        	}
	    	
        });
        /**
         * 不管成功或者失败，文件上传完成时触发。
         */
        uploader.on('uploadComplete',function(file){
        	console.log("core~");
        	extendMethods.uploadComplete(file);
        });
        
        /**
         * 当所有文件上传结束时触发。
         */
        uploader.on('uploadFinished',function(){
        	extendMethods.uploadFinished();
        });
        
        /**
         * 当validate不通过时，会以派送错误事件的形式通知调用者。
         * 通过upload.on('error', handler)可以捕获到此类错误，目前有以下错误会在特定的情况下派送错来。
			Q_EXCEED_NUM_LIMIT 在设置了fileNumLimit且尝试给uploader添加的文件数量超出这个值时派送。
			F_EXCEED_SIZE 单个文件大小超限
			Q_EXCEED_SIZE_LIMIT 在设置了Q_EXCEED_SIZE_LIMIT且尝试给uploader添加的文件总大小超出这个值时派送。
			Q_TYPE_DENIED 当文件类型不满足时触发。
         */
        uploader.on('error',function(type){
        	extendMethods.error(type);
        });
	}
	
	/**
	 *  确保 server 的url后面可以继续跟参数
	 */
	function checkServerUrl(serverUrl){
		//  判断最后一位是否是？
		var pos=serverUrl.lastIndexOf("?");
		if(pos>0){
			if(pos<(serverUrl.length-1)){
				var nsbpPos=serverUrl.lastIndexOf("&");
				//  判断最后一位是否是&
				if(nsbpPos>0){
					if(nsbpPos<(serverUrl.length-1)){
						serverUrl+="&";
					}
				}else{
					serverUrl+="&";
				}
			}
		}else{
			serverUrl+="?";
		}
		return serverUrl;
	}
	
	return {
		initUploader:initUploader,
		createExtendedMethods:extendMethodsRegister
	};
});