# 杭州市民卡H5前端框架                  
     
此次整理的核心集中在iDangero.us的[Framework7](http://framework7.taobao.org/docs/)(后续简称F7)框架，然后针对市民卡常用业务场景进行组件和路由二次封装完成，我们也暂且继续命名它F7. 
F7是 HTML、CSS 和 JS 框架，用于开发响应式布局、移动设备优先的 WEB，它并不能兼容所有的设备。只专注于为 iOS 和 安卓4.5以上提供最好的体验，在[微信城市生活通](http://weixin.96225.com/weixin/hzt/front "非微信端不支持openId绑定相关业务")、微信城市服务、杭州通、文创等项目中也对此框架进行了深入实践并取得了良好的用户体验。
>了解更多F7内容，大家可以直接进入[官网](http://framework7.taobao.org/docs/)和[git](https://github.com/nolimits4web/Framework7)
 
*** 
 
##特性  

| HTML | CSS  | JS |
| ------------ | ------------ | ------------ |
|你只需要一个基本的HTML布局，并且把Framework7的CSS和JS文件引入即可！Framework7不会强制你写任何自定义的标签，也不会通过JS来生成任何额外的内容。你不需要通过JS或者JSON来写页面，只需要普通的HTML就可以。      | 有大量可以直接使用的UI组件和工具，比如modals,popup,action sheet, popover, list views, media lists, tabs, side panels, layout grid, preloader, form elements 等。大部分的组件你都完全不需要写任何JS代码 |XHR\Caching\History\Preloading这几个功能的组合可以让你的应用的路由功能变得非常强大。F7通过Ajax来加载新页面，并且可以通过缓存配置让页面的加载速度变得非常快。可以完全使用HTML做视图展示，json来数据传递，实现前后端彻底解耦。 |

##新增组件  
* 正则校验  
```javascript
var VALIDATE = { //校验正则
		mobile:/^0?1[3-8|4|5|7|8][0-9]\d{8}$/,  //手机号码校验
		english:/^[A-Za-z]+$/,  //纯英文校验
		card:/^[0-9a-zA-Z]*$/   //纯英文或者纯数字或者英文数字组合，适用于卡号校验
};
```
* 关键信息打星号
```javascript 
String.prototype.setStars = function(index){  //扩展字符串原型方法，隐藏某个字符为*号，默认第二位，适用于不宜显示全部字段的场景
	   var self = this.replace(/ /g,''); //去除空格

	   if(VALIDATE.mobile.test(self)){//是手机号码，进入手机号码加*号
		   /* 该方法存在比较明显的错误，如果手机号为15066666666就会被切割成['150','',''],最终显示150********,不满足程序功能
		   var arr = /\d{3}(\d{4})/.exec(self)[1];//获取需要打星号手机四位字段
		   return self.split(arr).join('****');
		   */
		   
		   return self.slice(0,3)+'****'+self.slice(-4);//使用最传统的前三后四
	   }
	   else{
		   var arr = self.split('');
		   arr[ index||1 ] = ' * '; //默认为第二个字符，当然也可以传入参数，位数从0开始计算
		   return arr.join('');	   
	   }
};
```
##扩展框架方法  
* alert  增加自定义按钮文字
```javascript
	app.alert = function (text, title, callbackOk, buttonText) {
	    if (typeof title === 'function') { //不写text
	        callbackOk = arguments[1]; //把title当做回调函数执行
	        buttonText = arguments[2]; //callbackOk当做自定义按钮文字
	        title = undefined;
	    }
	    return app.modal({
	        text: text || '',
	        title: typeof title === 'undefined' ? app.params.modalTitle : title,
	        buttons: [ {text: buttonText || app.params.modalButtonOk, bold: true, onClick: callbackOk} ]
	    });  
	};
```
* H5网页刷新路由bug
```javascript
    /* 由于SPA框架缘故，当页面数据是由前面路由直接传递过来时，数据不在url中体现，这时候刷新当前页面会出现数据清空
     * 微信页面当三级、四级页面刷新时，会清空之前历史记录，此时全部处理成回到首页。 2016-08-11 xudihui
     * */
    if (stateUrl!='' && view.history.length>=2 && app.params.history.length==1) { //刷新后app.params.history会被情空，它是每次a的href跳转进行添加。
    	app.router.load(view, {url:view.history[0], animatePages: animatePages, pushState: false,reload:true});
      	location.hash = '';
      	location.reload(); //强制刷新首页
    } 
```
## 前端代码规范(关于编码规范，没有标准答案，没有正确对错，只有更合理、更有效。
 
### 一：原则
	1.1规范：保证您的代码规范，保证结构表现行为相互分离。	
	1.2简洁：保证代码的最简化，避免多余的空格、空行，保持代码的语义化，尽量使用具有语义的元素，避免使用样式属性和行为属性。任何时候都要用尽量简单、尽量少的元素解决问题。
	1.3实用：遵循标准，但是不能以牺牲实用性为代价。
	1.4忠诚：选择一套规范，然后始终遵循。不管代码由多少人参与，都应该看起来像一个人写的一样，这样才能便于维护。
### 二：语法
	2.1小写。html标签、html属性全部小写。
	2.2嵌套。所有元素必须正确嵌套。
	2.3闭合。双标签必须闭合，单标签（自关闭标签）不闭合。
### 三：注释
	3.1详尽注释。解释代码解决问题、解决思路、是否为新鲜方案等。
### 四：文档
	4.1文档类型使用html5标准文档类型，文档类型声明之前，不允许出现任何非空字符。不允许添加<meta>强制改变文档模式。
	4.2 html元素上指定lang属性。显示页面语言，有助于语言合成工具来确定怎样发音，以及翻译工具决定使用的规则，等等。
	4.3指定明确的字符编码。让浏览器轻松、快速的确定适合网页内容的渲染方式。
	4.4 建议使用rem根文字尺寸，在html标签上定义一个标准尺寸比如16px。
### 五：属性
	5.1双引号属性值，不要使用单引号。
	5.2省略type属性。使用style、link、script，不用指定type属性，因为 text/css 和 text/javascript 分别是他们的默认值。
	5.3省略url类属性资源协议头。
	5.4多媒体元素添加替代属性。图像增加alt属性，音视频增加替代文字。
	5.5不手动设置tabindex属性，让浏览器自动设置。
### 六：元素
	6.1避免冗余标签。
	6.2避免JS生成标签。
	6.3尽量使用语义化标签，比如列表项放ul、ol、dl，不要使用一系列的div或p
	6.4多媒体元素添加替代属性。图像增加alt属性，音视频增加替代文字。
	6.5不手动设置tabindex属性，让浏览器自动设置。
	
## 小结 
作为一名在前端摸爬打滚4年的攻城士，这几年也在开发过程中使用了一些前端框架。今年已经开始专门负责H5的开发，也希望从优秀框架中沉淀出一套符合公司当前项目需求，并能提高前后端开发效率和用户体验的框架，由于专业技能有限，新建一个git项目，通过`issues`和`wiki`来推动H5的同事们一起参与进来，让框架沉淀迭代起来。

***

因为目前界内比较流行并遍地开花的主要还是 JS+CSS 模式的框架，使用F7之前主要了解对比了以下几款主流H5框架。 

* [Bootstrap](https://github.com/twbs/bootstrap/)
* [AUI(APICloud)](https://github.com/liulangnan/aui)
* [WeUI(腾讯)](https://github.com/weui/weui)
* [Frozen UI(腾讯)](https://github.com/frozenui/frozenui)
* [SUI(淘宝)](https://github.com/sdc-alibaba/sui)
* [Framework7](https://github.com/nolimits4web/Framework7)
