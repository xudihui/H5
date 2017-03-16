var getQueryString=function(name,str) {		//提取href参数
	var str_; //键值对 
	if(str){
		str_ = str.split('html')[1];
	}
	else{
        str_ = window.location.search;
	}
	console.log(str_)
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = str_.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
}

var TYPE = getQueryString('type') || '';
var STATE = getQueryString('status',location.hash) || '';

//设置刷新不返回首页的子页面(无前后功能逻辑)
var HASHPAGE = ['smk-fitness-catalog' //校园健身目录
, 'smk-fitness-intro' //校园健身业务介绍
, 'smk-fitness-proposal' //校园健身意见建议
, 'smk-fitness-list' //校园健身学校列表
];

//获取当前子页面是否要保留在当前页面
var checkCurrentPage = function() {
		var flag = true;
		for (i in HASHPAGE) {
			if (location.hash.indexOf(HASHPAGE[i]) > -1) {
				flag = false;
				break;
			}
		}
		return flag;
	}


	//如果不是首页，直接重定向到首页
if (location.hash) {
	//最后一个参数是state的值，为空不改变state,为空格可以直接清空state	
	//	history.replaceState(null, "", checkCurrentPage() ? " " : "");
	//location.reload(); //在ios微信里面点击刷新按钮，会刷新两次回到首页
}

//localStorage.setItem('userMobile','13888888886');
//version2.6

var myApp = new Framework7({
	modalTitle: '',
	animateNavBackIcon: true,
	pushState: true,
	pushStateNoAnimation: true,
	template7Pages: true,
	precompileTemplates: true,
	modalButtonOk: '确认',
	modalButtonCancel: '取消',
});



// Expose Internal DOM library
var $$ = Dom7;
var SMK = myApp;
var baseUrl = '';
var VIEWURL = '';
var AJAXTIME;
var REG = /^0?1[3-8|4|5|7|8][0-9]\d{8}$/;
var REG_abc = /^[A-Za-z]+$/;
var VALIDATE = { //校验正则
	mobile: /^0?1[3-8|4|5|7|8][0-9]\d{8}$/,
	//手机号码校验
	english: /^[A-Za-z]+$/,
	//纯英文校验
	card: /^[0-9a-zA-Z]*$/, //纯英文或者纯数字或者英文数字组合，适用于卡号校验
	//验证码
	code:/^\d{6}$/
};
var AJAX = null;
var FLAG = false;
var FLAG_TIME = null;
var AJAXDATE = 0;
var timer = null;
var map;
var mapObj = {}; //地图对象
String.prototype.setStars = function(index) { //扩展字符串原型方法，隐藏某个字符为*号，默认第二位，适用于不宜显示全部字段的场景
	var self = this.replace(/ /g, ''); //去除空格

	if (VALIDATE.mobile.test(self)) {
		return self.slice(0, 3) + '****' + self.slice(-4); //使用最传统的前三后四	   
	} else {
		var arr = self.split('');
		arr[index || 1] = ' * '; //默认为第二个字符，当然也可以传入参数，位数从0开始计算
		return arr.join('');
	}
};

String.prototype.removeAllSpace = function() {
	var self = this;
	return self.replace(/\s+/g, "");
}

//tips Function
window.showTips = function(content, t) {
	var p = $$('<p class="showTips"><span>' + content + '</span></p>');
	if ($$('.showTips').length > 0) return;
	$$('body').append(p);
	setTimeout(function() {
		p.css('opacity', 1);
	}, 0);
	setTimeout(function() {
		p.addClass('hide').transitionEnd(function() {
			p.remove()
		}); //优化动画，平滑过渡
	}, t || 2000)
};

window.setCopyright = function(e) { //设置版权位置
	var name_ = e.type == 'resize' ? $$('.page-on-center').attr('data-page') : e.detail.page.name;
	var el_ = ".page[data-page=" + name_ + "] .page-content";
	var el = $$(el_)[0];
	$$('.copyright').css('bottom', (el.scrollHeight > el.clientHeight ? 'auto' : '0'));
};
$$(window).resize(function(e) {
	setCopyright(e)
});
//loading Function
myApp.showIndicator();

localStorage.setItem('wechatloginKey', '我就是个标记');


$$(window).on('load', function() {	



	 myApp.hideIndicator();
	var hash = location.hash.slice(3) || '';
	var url = '';

	// 我的卡片
	if(TYPE == 'myCards') {
		url = 'myCards.html';
	}
	// 卡详情
	if(TYPE == 'card') {
		url = 'card.html';
	}
	// 乘车记录
	if(TYPE == 'busList') {
		url = 'busList.html';
	}
	// 开通线路
	if(TYPE == 'busLine') {
		url = 'busLine.html';
	}
	// 充值记录
	if(TYPE == 'rechargeList') {
		url = 'rechargeList.html';
	}
	// 充值详情
	if(TYPE == 'rechargeDetail') {
		url = 'rechargeDetail.html';
	}
	// 市民认证
	if(TYPE == 'realName') {
		url = 'realName.html';
	}
	// 市民认证结果
	if(TYPE == 'realNameResult') {
		url = 'realNameResult.html';
	}
	// 使用帮助
	if(TYPE == 'help') {
		url = 'help.html';
	}
	// 退卡结果
	if(TYPE == 'cancelResult') {
		url = 'cancelResult.html';
	}
	// 充值
	if(TYPE == 'recharge') {
		url = 'recharge.html';
	}



	//登录
	if (TYPE == 'login') {
		url = 'smk-alipay.html';
	}

	//自动登录
  //   if(localStorage.getItem('userMobile')){
		// url = 'smk-catalog.html';
  //   }	

    //目录
    if(TYPE == 'catalog'){
		url = 'smk-catalog.html';
    }    

    //支付结果
	if (TYPE == 'payResult') {
		url = 'smk-pay-result.html';
	}
	if(hash && localStorage.getItem('userMobile')){ //如果有hash并且有登录缓存，以hash为准
		url = hash;
	}
	if(TYPE){
		mainView.router.load({ // 此处切记，主视图初始化的变量名必须是mainView，不然跳转不了
			url : VIEWURL + url,
			animatePages : false,
			pushState : false
		});		
	}    


});

// Add main view
var mainView = myApp.addView('.view-main', {
	domCache: true //三级设置该参数
});

//提示冒泡封装
$$(document).on('click', 'i.information', function(evt) {
	var self = $$(this);
	myApp.modal({
		text: self.attr('text'),
		title: self.attr('title'),
		buttons: [{
			text: '知道了',
			bold: true
		}]
	})
});


//测试

FLAGE = 0;
myApp.onPageInit('test', function(page) {
	 var n = ++FLAGE;
     var inputCardNo = $$('#cardNo');
	//如果用事件代理方式，由于绑定在document上面，页面卸载不会移除document元素，导致再次进入的时候会重复绑定，并且上次传入的inputCardNo会被闭包记录在执行内存中
	// $$(document).on("click","#cardNo_",function(){
	// console.log('第'+n+'次的值：'+inputCardNo.val()+';');
	// console.log(inputCardNo);
	// })
     
     $$("#cardNo_").on("click",function(){
		// console.log('第'+n+'次的值：'+inputCardNo.val()+';');
		console.log("000")
	 }) 
})

//卡详情页面
myApp.onPageInit('cardDetail', function(page) {
	/*
  var mySwiper = myApp.swiper('.swiper-container', {
    speed: 400,
    spaceBetween: 100,
    autoplay:5000,
    setWrapperSize:true,
    effect:"cube",
    cube: {
	  slideShadows: true,
	  shadow: false
    }
   });   
   */
  
  var mySwiper = myApp.swiper('.swiper-container', {
    speed: 400,
    spaceBetween: 100,
    //autoplay:1000,
    setWrapperSize:true,
    effect:"slide"
   });   

})

//卡充值页面
myApp.onPageInit('rechargeAuto', function(page) {
	var picker_a = $$('.page[data-page="rechargeAuto"] .picker_a'),
	picker_b = $$('.page[data-page="rechargeAuto"] .picker_b'),
	toolbarTemplate = '<div class="toolbar">' +
			                '<div class="toolbar-inner">' +
				                '<div class="left">' +
				                    '<a href="#" class="link cancle-picker"></a>' +
				                '</div>' +
				                '<div class="right">' +
				                    '<a href="#" class="link close-picker">完成</a>' +
				                '</div>' +
				             '</div>' +
				          '</div>',
	myPicker_a = myApp.picker({
			    input: '.picker_a',
			    rotateEffect: true,
			    toolbarTemplate:toolbarTemplate,			    
			    cols: [
			       {
			         textAlign: 'center',values: ['10元','100元','1000元','10000元','1000000元']
			       }
			     ],
			     onClose:function(p){
			     	    picker_a.html(p.value[0]);
			     },	    
			     onOpen:function(p){

			     }
	}),
	myPicker_b = myApp.picker({
			    input: '.picker_b',
			    rotateEffect: true,
			    toolbarTemplate:toolbarTemplate,			    
			    cols: [
			       {
			         textAlign: 'center',values: ['2元','3元','4元']
			       }
			     ],
			     onClose:function(p){
			     	    picker_b.html(p.value[0]);
			     },	    
			     onOpen:function(p){

			     }
	});	 	 

})


 

$$(document).on('pageBeforeRemove', function(e) {
	if (FLAG_TIME) {
		clearTimeout(FLAG_TIME)
	}
	FLAG = false; //页面初始化的时候把ajax的toast强制消灭
	myApp.hideIndicator();
});

$$(document).on('pageBack', function(e) {
	if (map != undefined) {
		map.destroy();
	}
	//返回到免密登录时直接关闭支付宝webview
	if(e.detail.page.view.activePage.name == 'smk-catalog'){
		 AlipayJSBridge.call('closeWebview')
	}
});



$$(document).once('pageInit', function(e) {
	myApp.params.pushStateNoAnimation = false;
});

$$(document).on('pageInit', function(e) {
	FLAG_TIME = setTimeout(function() {
		FLAG = true; //页面初始化的时候把ajax的弹窗激活
	}, 4900) //如果用户在100ms以内完成了返回+新跳转的话，toast还是会出现！
});


$$(document).on('pageAfterAnimation', function(e) {	

	//充值界面卸载后不进行隐藏modal
	if(e.detail.page.name != 'smk-recharge'){
		myApp.closeModal();
	}
	setTimeout(function() {
		changeTitle(e);
	}, 20)
})

//输入框蓝色光标闪烁时，点击左上角返回，页面返回到前一页后蓝色光标还会短暂停留才消失。（仅IOS有)
$$(document).on('pageBeforeAnimation', function(e) {
	$$('input:focus,textarea:focus').hide()
})
$$(document).on('pageInit', function(e) {
	// Page Data contains all required information about loaded and initialized page 
	changeTitle(e);

})

//网页标题修改
var changeTitle = function(e) {
		var page = e.detail.page;
		var name = page.name;
		var title = '杭州市民卡';
		if (name.indexOf('transaction') > -1) {
			title = '交易记录';
		}
		if (name.indexOf('catalog') > -1) {
			title = '首页';
		}
		if (name.indexOf('map') > -1) {
			title = '补登网点';
		}
		if (name.indexOf('alipay') > -1) {
			title = '登录';
		}
		if (name.indexOf('order') > -1) {
			title = '订单确认';
		}
		if (name.indexOf('recharge') > -1) {
			title = '公交充值';
		}
		if (name.indexOf('result') > -1) {
			title = '充值结果';
		}





		var $body = $$('body')
		document.title = title;
		var $iframe = $$('<iframe src="resource/images/blank.gif"></iframe>');
		$iframe.on('load', function() {
			setTimeout(function() {
				$iframe.off('load').remove();
			}, 0)
		})
		$body.append($iframe);
	}