//广告管理核心逻辑
//广告位的上方无输入表单的话，可以使用absolute，如果有输入表单，务必使用marginTop或其它方式布局，需要根据页面动态布局的样式，可以在callback函数里面添加
//callBack中可以重新动态定义广告位布局
/*
* 使用方法:
* __ADV({
*  type:'_0' //展位唯一标识 
* })
* @param {object} type 展位的配置,以下划线开头
*
* */
(function(){
	var _url = 'http://192.168.23.200:8082/ext_smk_activity/advertise/getAdByType.ext',//接口地址
		width = window.innerWidth,//屏幕宽度
		height = width*82/446,//等比广告图高度
		layout = { //广告位分布信息
			_0:{
				type:'union', //工会
				style:'position:absolute;bottom:15px'
			},
			_1:{
				type:'walletLost',//钱包挂失
				style:'position:absolute;bottom:15px',
				callBack:function(data,node){//data是服务端返回的数据，node是广告位DOM节点
				  // node.setAttribute('style','margin-top:20px');//此处可以重新动态定义广告位布局
				}
			},
			_2:{
				type:'creditCardRecords',
				style:'position:absolute;bottom:15px',
				callBack:function(data,node){
					//回调函数，预留
				}
			}
		},
		__ADV = function(option){
			var target = layout[option['id']];
			if (window.XMLHttpRequest) {
				var xhr = new XMLHttpRequest();
			} else {
				var xhr = new ActiveXObject('Microsoft.XMLHTTP');
			}
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					try{
						if (xhr.status >= 200 && xhr.status < 300) {
							var data = JSON.parse(xhr.responseText);
							if(data.response.status == '1'){
								var node  = document.createElement('img');
								node.setAttribute('width',width);
								node.setAttribute('height',height);
								node.setAttribute('style',target.style||'');
								node.setAttribute('src',data.response.picture.indexOf('http') == 0 ? data.response.picture : (data.response.rFdsUrl + data.response.picture) ); //如果是http开头，直接采用，否则直接拼接
								node.addEventListener('click', function(){
									location.href = data.response.pictureUrl; //暂时H5这边都是入口页，如果广告位在结果页，并且是hash路由的话，一定一定要确保结果页能保留状态！！！！
								}, false);
								document.querySelector('body').appendChild(node);
								target.callBack && target.callBack(data,node) //有回调的话，执行回调,传入响应数据。
								window.onpopstate = function(){ //针对React项目的hash路由，每次路由变更，应当卸载广告图（因为广告图添加在body的根节点）
									if(node){
										document.querySelector('body').removeChild(node);
										node = null;
									}
								}
							}
						}
					}catch(e){}
				}
			}
			var _filter = function(str) { //特殊字符转义
				str += ''; //隐式转换
				str = str.replace(/%/g, '%25');
				str = str.replace(/\+/g, '%2B');
				str = str.replace(/ /g, '%20');
				str = str.replace(/\//g, '%2F');
				str = str.replace(/\?/g, '%3F');
				str = str.replace(/&/g, '%26');
				str = str.replace(/\=/g, '%3D');
				str = str.replace(/#/g, '%23');
				return str;
			}
			var _temp = [];
			var _data = {request:JSON.stringify({type:target['type']})};
			for (var attr in _data) {
				_temp.push(attr + '=' + _filter(_data[attr]));
			}
			var _sData = _temp.join('&');
			xhr.open('POST', _url, true);
			//设置请求头，以表单形式提交数据
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.setRequestHeader('appId', "com.smk.test.test");
			xhr.send(_sData);
		}
	window.__ADV = __ADV;//暴露给全局;
}());