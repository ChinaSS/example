/**
 * Created by YiYing on 2014/12/14.
 */
define(['WebUploader','jquery','css!UtilDir/css/util.css','css!WebUploaderCss'],function(WebUploader,$){

    var init = function(options){
    //  因有些配置信息固定不可改，所以options需要预处理后再合并到settings中
    	if(options==null){ 
    		options={};
    	}
    	options.auto=false;													//  是否自动上传
    	options.swf=getStaticPath() + 'modules/webuploader/Uploader.swf';	//  flash地址
    	options.server=getServer() +"/sword/fileUpload/";
    	options.runtimeOrder='html5,flash';
    	options.prepareNextFile=true;
    	options.chunked=true;
    	options.chunkSize=5242880;											//  5M
    	options.threads=3;													//  每个文件提供3个请求
    	options.resize=false;
    	options.duplicate=true;
    	options.sendAsBinary=false;
        var settings = {
    		chunkRetry :0,													//  分片上传失败后重试
    		formData:{},													//  向服务器额外发送的数据
            remove:function(){},
            uploadSuccessExt:function(file, response){}
        };
        return new SimpleUpload($.extend(settings,options)).render();
    };

    /**
     * 简单附件上传对象
     * @param settings
     * @constructor
     */
    function SimpleUpload(settings){
        this.$img       = null;                 //附件上传组件图标
        this.$upload    = null;                 //上传图标DOM对象
        this.$remove    = null;                 //删除图标DOM对象
        this.settings   = settings;
    }

    /**
     * 渲染附件上传组件
     */
    SimpleUpload.prototype.render = function () {
        var html = '<div class="cs-sUpload">'+
                        '<div>'+
                            '<input type="text" class="form-control">'+
                        '</div>'+
                      /*'<i class="fa fa-cloud-upload"></i>'+
                        '<i class="fa fa-upload""></i>'+
                        '<i class="fa fa-times"></i>'+*/
                    '</div>';
        this.$container = $(html);
        var _this = this;
        this.$img       = $('<i class="fa fa-cloud-upload"></i>');
        this.$upload    = $('<i class="fa fa-upload" title="上传"></i>').bind('click',function(){_this.startUpload();});
        this.$remove    = $('<i class="fa fa-times" title="删除"></i>').bind('click',function(){_this.remove();});
        this.$container.append(this.$img).append(this.$upload).append(this.$remove);
        //添加附件上传组件到指定位置
        var placeAt     = this.settings.placeAt;
        var $placeAt    = typeof(placeAt)=="string" ? $("#"+placeAt) : $(placeAt);
        $placeAt.append(this.$container);

        //初始化WebUploader
        this.webUploader    = InitUploader(this,this.settings);

        return this;
    };

    /**
     * 开始上传附件
     */
    SimpleUpload.prototype.startUpload = function(){
        this.webUploader.upload();
    };

    /**
     * 删除附件
     */
    SimpleUpload.prototype.remove = function(){
        this.$container.find("input")[0].value = "";
        //重置uploader。目前只重置了队列。
        this.webUploader.reset();
        //显示隐藏控制
        this.$img.show();
        this.$upload.hide();
        this.$remove.hide();
        this.settings.remove.apply(this);
    };

    var InitUploader = function(simpleUpload,settings) {
        var def = {
            // swf文件路径
            swf: getStaticPath() + 'modules/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: getServer() +"/file/upload",
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: {
                id:simpleUpload.$container[0].firstChild,
                multiple:false
            },
            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false
        };
        //  注册hook事件
        registerForWebUploader(WebUploader,settings.server);
        var uploader = new WebUploader.Uploader($.extend(def,settings));



        /**
         * 当文件被加入队列以后触发。
         */
        uploader.on( 'fileQueued', function( file ) {
            simpleUpload.$container.find("input")[0].value = file.name;
            //显示删除和上传图标
            simpleUpload.$img.hide();
            simpleUpload.$upload.show();
            simpleUpload.$remove.show();
        	uploader.md5File( file )
	        // 及时显示进度
	        .progress(function(percentage) {
	        	var process=Math.round(percentage*10000)/100;
//	            console.log('Percentage:'+ process+"%");
	        })
	        // 完成
	        .then(function(val) {
	        	file.statusText=val;
	        	$.ajax({
	        		 url:uploader.options.server+"?check=true&md5="+val,
	        		 async:false,
	        		 type:"get",
	        		 beforeSend:function (XMLHttpRequest) {
	 					console.log(XMLHttpRequest.readyState);
	 					XMLHttpRequest.setRequestHeader("SwordControllerName", "FileUploadController");
	 				 },
	        		 success:function(data){
	        			 console.log("Data: " + data + "\n");
	        			 if(data.fid){
	        				 uploader.skipFile(file);
	        				 uploader.trigger('uploadSuccess',file,{data:data});
	        			 }else{
	        				 console.log("start upload!");
	        				 uploader.upload();
	        			 }
	        		 },
	        		 error:function(xrh,data){
	        			 console.log(data);
	        		 }
	        	});
	        });
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
         * 当开始上传流程时触发。
         */
        uploader.on( 'uploadStart', function( file ) {

        });
        /**
         * 上传过程中触发，携带上传进度。
         */
        uploader.on( 'uploadProgress', function( file, percentage ) {

        });
        /**
         * 当文件上传出错时触发。
         */
        uploader.on( 'uploadError', function( file, reason ) {

        });
        /**
         * 当文件上传成功时触发。
         */
        uploader.on( 'uploadSuccess', function( file, response ) {
            var responseProcess=function(data){
   		 		console.log("Data: " + data + "\n");
   		 		if(data.fid&&data.filePath){
   		 			console.log("FID:"+data.fid+"\nFilePath:"+data.filePath);
   		 			simpleUpload.settings.uploadSuccessExt.apply(simpleUpload,[file, response]);
   		 		}else{
   		 			console.log("upload error!");
   		 			uploader.trigger('uploadError',file);
   		 		}
			};
			if(response&&response.data){
				responseProcess(response.data);
			}else{
			//  获取文件上传的保存路径和fid
		    	$.ajax({
		    		url:uploader.options.server+"?check=true&queryResult=true&md5="+file.statusText,
		   		 	async:false,
		   		 	type:"get",
		   		 	beforeSend:function (XMLHttpRequest) {
						console.log(XMLHttpRequest.readyState);
						XMLHttpRequest.setRequestHeader("SwordControllerName", "FileUploadController");
					 },
		   		 	success:function(data){
		   		 		responseProcess(data);
		   		 	},
		   		 	error:function(xrh,data){
		   		 		console.log(data);
		   		 	}
		    	});
			}
        });
        /**
         * 不管成功或者失败，文件上传完成时触发。
         */
        uploader.on('uploadComplete',function(file){

        });

        return uploader;
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
                        block.chunkMd5 = chunkMd5;
                        var exist = false;
                        var chunkSize=block.end-block.start;
                        block.chunkSize=chunkSize;
                        var isLast=false;
                        if(block.total==block.end){
                        	isLast=true;
                        }
                        $.ajax({
    	   	        		 url:checkUrl+"?check=true&md5="+file.statusText+"&chunkMd5="+chunkMd5+"&chunkSize="+chunkSize,
    	   	        		 async:false,
    	   	        		 type:"get",
    	   	        		 beforeSend:function (XMLHttpRequest) {
        	 					console.log(XMLHttpRequest.readyState);
        	 					XMLHttpRequest.setRequestHeader("SwordControllerName", "FileUploadController");
        	 				 },
    	   	        		 success:function(data){
    	   	        			 if (data&&data.chunkMd5==chunkMd5) {
    	   	        				 exist=data.exist;
    	   	        				 if (exist&&!isLast) {
    	   	   	                        deferred.reject();
    	   	   	                     } else {                        
    	   	   	                        deferred.resolve();
    	   	   	                     }
    	   	                     }  else{
    	   	                    	 console.log("分片验证失败！");
    	   	                    	 deferred.resolve();
    	   	                     }
    	
    	   	                             
    	   	        		 },
    	   	        		 error:function(xrh,data){
    	   	        			 console.log(data);
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

    return {
        init:init
    }
});