# 杭州市民卡H5前端框架

此次整理的核心集中在iDangero.us的[Framework7](http://framework7.taobao.org/docs/)(后续简称F7)框架，然后针对市民卡常用业务场景进行组件和路由二次封装完成，我们也暂且继续命名它F7.
F7是 HTML、CSS 和 JS 框架，用于开发响应式布局、移动设备优先的 WEB，它并不能兼容所有的设备。只专注于为 iOS 和 安卓4.5以上提供最好的体验，在[市民卡微信](http://weixin.96225.com/weixin/hzt/front "非微信端不支持openId绑定相关业务")2.5版本中也对此框架进行了深入实践并取得了更好的用户体验。
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