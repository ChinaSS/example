(function(window,factory){
	if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
		define( ["jquery","css!FloatTouchCss"], function (jquery) { 
			var components={};
			if($.mCustomScrollbar && typeof($.mCustomScrollbar) ==="function" ){
				components.scrollModifier=true;
			}
			factory.apply(null,[window,jquery,components]);
		} );
	}
})(window,function(window,$,components){
	function FloatTouch(settings){
		this.settings=settings;
		this.$parent=null;
		this.$container=$("<div id=\"touchDock\" class=\"floatTouchDock\"></div>");
		this.$touchDock=null;
		this.$dockPanel=null;
		this.items={};
	}
	
	FloatTouch.prototype={
			renderer:function(){
				var me = this;
				//  确保单例
				if($("#touchDock").length==0){
					$("body").append(me.$container);
					me.$touchDock=$("<div class=\"touchPointer\" id=\"touchDock\" " +
							"title=\"触点\" tabindex=\"0\" hidefocus=\"true\">" +
								"<div class=\"background\" id=\"dockPointer\" >" +
									"<span class=\"cell petal_L1\"></span>" +
									"<span class=\"cell petal_R1\"></span>" +
									"<span class=\"cell petal_L2\"></span>" +
									"<span class=\"cell petal_R2\"></span>" +
									"<span class=\"notice\" id=\"dockPointerNew\" style=\"display:none\"></span>" +
								"</div>" +
							"</div>");
					me.$dockPanel=$("<div class=\"touchList\" id=\"dockPanel\" " +
							"style=\"width: 189px; height: 304px;\">" +
								"<div class=\"touchListOpera\">" +
									"<a title=\"移除Dock\" id=\"removeFloatTouch\"><i class=\"fa fa-close\"></i></a>" +
								"</div>" +
								"<div id=\"dockItemList\" class=\"touchListContainer\"></div>" +
								"<div class=\"listBorderShadow_bottom\"></div>" +
								"<div class=\"listBorderShadow top\"></div>" +
								"<div class=\"listBorderShadow left\"></div>" +
								"<div class=\"listBorderShadow right\"></div>" +
							"</div>");
					
					//  hide
					me.$container.append(me.$touchDock)
								 .append(me.$dockPanel).toggle();
					me.$dockPanel.addClass("touchListExtend").hide();
					if(components.scrollModifier){
						$("#dockItemList").mCustomScrollbar({
							theme: "minimal-dark",
							scrollButtons:{enable:true}
						});
					}
					me.$container.fadeIn();
					//  添加dockPointer的点击事件和显示效果
					$("#dockPointer").bind("click",function(){
						if(me.$dockPanel.is(":hidden")){
							$("#dockPointer").addClass("pointOpen");
							me.$dockPanel.delay(100).fadeIn();
						}else{
							$("#dockPointer").removeClass("pointOpen");
							me.$dockPanel.toggle();
						}
						if(!$("#dockPointerNew").is(":hidden")){
							$("#dockPointerNew").toggle();
						}
					});
					//  删除floatTouch
					$("#removeFloatTouch").bind("click",function(){
						me.toggle();
					});
				}else{
					me.toggle();
				}
				return me;
			},
			/**
			 * 添加托管
			 * @param $dom  需要托管的div
			 * @param icon  托管项目使用的图标url
			 * @param clickFunc  点击item调用的click方法
			 */
			addItem:function(name,$dom,icon,clickFunc){
				var me = this;
				/**
				 * 在传入dom上再包一层div的gid，
				 * 在调用click方法时将该gid内的div取出再交由开发者处理。
				 */
				var gid="touchDockItem_"+new Date().getTime();
				if($dom){
					var item= new DockItem(me,gid,name,$dom,icon,clickFunc).renderer();
					me.items[gid]=item;
					var $addedDom=$("#dockItemList");
					if(components.scrollModifier){
						$addedDom=$("#dockItemList .mCSB_container");
					}
					$addedDom.append(item.$item);
					$("#dockPointerNew").show();
				}
				return me;
			},
			toggle:function(){
				var me=this;
				me.$container.toggle();
			}
			
	};
	
	function DockItem(_parent,gid,name,$dom,icon,clickFunc){
		this.parent=_parent;
		this.gid=gid;
		this.name=name;
		this.$dom=$dom;
		this.icon=icon || "";
		this.clickFunc=clickFunc;
		//  contain $dom
		this.$domHolder=$("<div></div>");
		//  contain item
		this.$item=$("<div id=\""+gid+"\" class=\"itemBase\"></div>");
		this.$itemIcon=null;
		this.$itemName=null;
	}
	
	DockItem.prototype={
			/**
			 * 渲染item
			 */
			renderer:function(){
				var me = this;
				me.$domHolder.append();
				if(me.$domHolder.is(":hidden")){
					me.$domHolder.fadeOut();
				}
				$itemIcon=$("<div class=\"itemIcon\" ><img src=\"../static/modules/floatTouch/images/dockItem.png\"/></div>");
				$itemName=$("<span class=\"itemName\">"+me.name+"</span>");
				me.$item.append($itemIcon).append($itemName);
				if(me.icon && typeof(me.icon)=="string"){
					//  替换item的 icon
					$itemIcon.find("img").attr("src",me.icon);
				}
				me.$item.bind("click",function(){
					me.click();
				});
				return me;
			},
			/**
			 * 点击item后触发
			 */
			click:function(){
				var me =this;
				if(me.clickFunc && typeof(me.clickFunc) == "function"){
					me.clickFunc(me.$dom);
				}else{
					//  没有外部加载模块时~默认展现模块
				}
				me.remove();
			},
			/**
			 * 
			 */
			remove:function(){
				var me =this;
				//  移除list中的item
				me.$item.remove();
				//  从parent的items中移除该对象
				delete me.parent.items[me.gid];
				//  隐藏新消息提示
				if(objectIsEmpty(me.parent.items)){
					$("#dockPointerNew").hide();
				}
			}
	};
	/**
	 * 判断对象是否为空
	 */
	function objectIsEmpty(obj){
		var noProp = true;
		if(obj&&typeof(obj)==="object"){
			for(var key in obj){
				noProp = false;  
		        break;  
			}
		}
		return noProp;
	}
	
	$.extend({
		floatTouch:function(options){
			var defaults = {
		    };
		    var settings = $.extend({},defaults, options);//将一个空对象做为第一个参数
		    var touch=new FloatTouch(settings);
		    return touch.renderer();
		}
	});
});