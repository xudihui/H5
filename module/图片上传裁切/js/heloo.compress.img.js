//图片前端压缩
//依赖jquery 框架，请把文件放在jquery之后引入

window.cutAction = function(config) {
		 /*
		  前端利用画布对图片进行压缩尝试
		  
		  缩放的机制：
		  判断原图片的长和宽，取出较大的维度，使用这个维度跟手机屏幕的同一纬度进行对比，如果小于屏幕，不进行任何操作；
		  如果大于屏幕，直接把图片进行等比缩放，不裁切。
		  
		*/
	    var w = $(window).width() < 720 ? $(window).width() : 720 ; //最大宽度720p
		var h = $(window).height();
		var src = config.img; //初始图片路径或者dataBase64图片代码	//在微信端无法拿到画布里面的数据，在非微信浏览器都可以正确拿到，估计是x5内核内部的时序问题。新增callback回调，来强制约定时序，纠正微信不能正确截图的bug
		var callback = config.callback; //回调函数，这是一个坑，在非微信的手机浏览器，我试了都是好的；但是在微信端如果不用回调总是拿不到数据，我也是醉了
		var data = ''; //dataBase64的最终图片代码
		var el = new Image(); //创建临时图片元素
		el.src=src;
		var c = $('<canvas id="myCanvas" ></canvas>');
		$('body').append(c);  
		var cutImg = function(){ //使用画布切割图像的具体操作步骤
		var img_width = el.width;
		var img_height = el.height;
		var scale = img_width/img_height;
		var max_size = Math.max(img_width,img_height);
		var x=0,y=0;
			if(img_width == max_size && img_width > w){ //如果宽度比较大并且它比手机屏幕的宽度大，就以宽度为准则，先把宽度缩放到屏幕宽度，然后根据长宽比，等比去调整长度，使图片保持原有比例
				img_height = w/scale;
				img_width = w;
			}
			else if(img_height == max_size && img_height > h){ //如果高度比较大并且它比手机屏幕的高度大....
				img_width = h*scale;
				img_height = h;
			}
			c.attr('height',img_height).attr('width',img_width);
			c = document.getElementById("myCanvas");
		    var cxt = c.getContext("2d"); 
			cxt.drawImage(el,0,0,img_width,img_height); //缩放绘图
			data = c.toDataURL("image/png"); //转换画布里面的像素至dataBase64代码
			$('#myCanvas').remove(); //移除画布元素	
			callback(data); //回调函数，返回数据，请开发人员对其进行后续相关操作
		}
		if(el.complete || el.readyState == 'loading' || el.readyState == 'complete'){ //判断图片是否载入
			cutImg();
		}
		else{
			el.onload=function(){
			cutImg();
		    }
	    }
};
