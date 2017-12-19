(function(window) {


  //iframe 创建webView请求
  var J = (function() {
    function getFrame(src) {
      var _frame = document.createElement("iframe");
      _frame.setAttribute("style", "display:none;width:0;height:0;position: absolute;top:0;left:0;border:0;");
      _frame.setAttribute("height", "0px");
      _frame.setAttribute("width", "0px");
      _frame.setAttribute("frameborder", "0");
      if (src) {
        _frame.setAttribute("src", src)
      } else {
        document.documentElement.appendChild(_frame)
      }
      return _frame
    }

    function removeFrame(frame) {
      frame && frame.parentNode.removeChild(frame)
    }

    function init(command, single, noframe) {
      var _frame, timer;
      if (noframe) {
        window.location.href = command;
        return
      }
      _frame = getFrame();
      _frame.setAttribute("src", command);
      timer = setTimeout(function() {
        _frame && removeFrame(_frame)
      }, 3000);
      _frame.onload = _frame.onreadystatechange = function() {
        timer && clearTimeout(timer);
        _frame && removeFrame(_frame);
      }
    }
    return {
      init: init
    }
  })();

  function SmkApp(protocolHandler) {
    var emptyFn = function() {},
      smkAppUA = (/smk/ig).test(navigator.userAgent),
      androidReg = /Android/gi,
      debug = false,
      isAndroid = androidReg.test(navigator.platform) || androidReg.test(navigator.userAgent),
      Callbacks, Protocols;
    Callbacks = {
      afterEncrypt: emptyFn,
      afterShare: emptyFn,
      afterSetInfoShare: emptyFn,
      afterUserinfo: emptyFn,
      afterLogin: emptyFn,
      afterLoginDia: emptyFn,
      afterDevice: emptyFn,
      afterUploadImage: emptyFn,
      afterComment: emptyFn,
      afterOtherappinfo: emptyFn,
      afterActionbutton: emptyFn
    };
    Protocols = {
      setshareinfo: 'smkshare:{"shareUrl":"{lineLink}","title":"{shareTitle}","content":"{descContent}","imageUrl":"{imgUrl}"}',
      share: "ishare://",
      gotonative: "smknative://open{PAGE}",      
      updateprofile: "iupdateprofile://",
      encrypt: "iencrypt://",
      pushview: "ipushview://{TYPE}",
      userinfo: "iuserinfo://",
      device: "idevice://",
      uploadImageByCamera: "iuploadimage://camera/{W}_{H}",
      uploadImageByAlbum: "iuploadimage://album/{W}_{H}",
      openComment: "inewsapp://comment/{BOARD_ID}/{DOC_ID}/{TITLE}",
      comment: "icomment://",
      otherappinfo: isAndroid ? "iotherappinfo://" : "iotherappinfo://intent/",
      copy: "icopy://",
      toolbar: "idocmode://toolbar/{COMMAND}",
      setTitle: "smkapp://setTitle/{TITLE}",
      getToken: "smkapp://postSMKUserToken",
      actionbutton: "idocmode://actionbutton/{NAME}"
    };

    function enableDebug() {
      debug = true
    }

    function issmkApp() {
      return smkAppUA || debug
    }

    function protocol(action, callback) {
      protocolHandler(action, true);
      if (debug && callback) {
        var _data = action.match(/[\w]:\/\/(.*)/);
        callback(_data && _data[1])
      }
    }

    function afterCallback(rs, callback) {
      callback = callback || emptyFn;
      callback(rs);
      callback = emptyFn
    }
    window.__newsapp_setshareinfo_done = function(rs) {
      afterCallback(rs, Callbacks.afterSetInfoShare)
    };
    window.__newsapp_share_done = function(rs) {
      afterCallback(rs, Callbacks.afterShare)
    };
    window.__newsapp_encrypt_done = function(rs) {
      afterCallback(rs, Callbacks.afterEncrypt)
    };
    window.__newsapp_userinfo_done = function(rs) {
      afterCallback(rs, Callbacks.afterUserinfo)
    };
    window.__newsapp_login_done = function(rs) {
      afterCallback(rs, Callbacks.afterLogin)
    };
    window.__newsapp_logindia_done = function(rs) {
      afterCallback(rs, Callbacks.afterLoginDia)
    };
    window.__newsapp_device_done = function(rs) {
      afterCallback(rs, Callbacks.afterDevice)
    };
    window.__newsapp_upload_image_done = function(rs) {
      afterCallback(rs, Callbacks.afterUploadImage)
    };
    window.__newsapp_comment_done = function(rs) {
      afterCallback(rs, Callbacks.afterComment)
    };
    window.__newsapp_otherappinfo_done = function(rs) {
      afterCallback(rs, Callbacks.afterOtherappinfo)
    };
    window.__newsapp_browser_actionbutton = function(rs) {
      afterCallback(rs, Callbacks.afterActionbutton)
    };
    window.__newsapp_alarm_add_done = function(rs) {
      afterCallback(rs, Callbacks.afterAddAlarm)
    };
    window.__newsapp_alarm_remove_done = function(rs) {
      afterCallback(rs, Callbacks.afterRemoveAlarm)
    };
    window.__newsapp_alarm_check_done = function(rs) {
      afterCallback(rs, Callbacks.afterCheckAlarm)
    };

    function updateProfile() {
      protocol(Protocols.updateprofile)
    }


    function userInfo(callback) {
      Callbacks.afterUserinfo = callback;
      protocol(Protocols.userinfo, callback)
    }

    function device(callback) {
      Callbacks.afterDevice = callback;
      protocol(Protocols.device, callback)
    }

    function setShareInfo(opt) {
      var ti = opt.title || "",
        des = opt.content || "",
        img = opt.imageUrl || "",
        lk = opt.shareUrl || "",
        success = opt.success || function(){},
        error = opt.error || function(){};
        protocol(Protocols.setshareinfo.replace("{shareTitle}", encodeURI(ti)).replace("{descContent}", encodeURI(des)).replace("{imgUrl}", img).replace("{lineLink}", lk))
       // protocol(encodeURI(Protocols.setshareinfo.replace("{shareTitle}", ti).replace("{descContent}", des).replace("{imgUrl}", img).replace("{lineLink}", lk)))
       
       window.getMessageFromApp = function(data){
		    try{
		        var data = JSON.parse(data);
				if(data.shareStatus == 1){
	                success.call({},data.appVersion);
				}
				else{
					error.call({},data.appVersion);
				}    
		    }
		    catch(e){
		        alert(e.message.indexOf('Unexpected ') > -1 ? '分享出错' : null)
		    }
       }
    }

    function share(callback) {
      Callbacks.afterShare = callback;
      protocol(Protocols.share, callback)
    }

    function pushView(type) {
      protocol(Protocols.pushview.replace("{TYPE}", type))
    }

    function encrypt(data, callback) {
      Callbacks.afterEncrypt = callback;
      if (window.extra && window.extra.__newsapp_encrypt) {
        afterCallback(window.extra.__newsapp_encrypt(data), Callbacks.afterEncrypt)
      } else {
        protocol(Protocols.encrypt + encodeURI(data), callback)
      }
    }

    function uploadImageByCamera(width, height, callback) {
      Callbacks.afterUploadImage = callback;
      protocol(Protocols.uploadImageByCamera.replace("{W}", width).replace("{H}", height), callback)
    }

    function uploadImageByAlbum(width, height, callback) {
      Callbacks.afterUploadImage = callback;
      protocol(Protocols.uploadImageByAlbum.replace("{W}", width).replace("{H}", height), callback)
    }

    function openComment(boardid, docid, title) {
      protocol(Protocols.openComment.replace("{BOARD_ID}", boardid).replace("{DOC_ID}", docid).replace("{TITLE}", title || ""))
    }

    function comment(callback) {
      Callbacks.afterComment = callback;
      protocol(Protocols.comment, callback)
    }

    function otherappinfo(id, callback) {
      Callbacks.afterOtherappinfo = callback;
      protocol(Protocols.otherappinfo + id, callback)
    }

    function copy(text) {
      protocol(Protocols.copy + text)
    }

    function toolbar(command) {
      protocol(Protocols.toolbar.replace("{COMMAND}", command))
    }

    function setTitle(title) {
      document.title = title || document.title;
      protocol(Protocols.setTitle.replace("{TITLE}", encodeURI(title)))
    }

    function getToken(callback) {
      protocol(Protocols.getToken);
      window.sendTokenToWap = function(token){
          if(!token){
            gotonative('LoginView');
          }
          callback(token);
      }
    }

    function gotonative(page) {
      protocol(Protocols.gotonative.replace("{PAGE}", encodeURI(page)))
    }
    

    function actionbutton(name, callback) {
      Callbacks.afterActionbutton = callback;
      protocol(Protocols.actionbutton.replace("{NAME}", encodeURI(name)), callback)
    }
	
	function adv(){
		//广告管理核心逻辑
		//广告位的上方无输入表单的话，可以使用absolute，如果有输入表单，务必使用marginTop或其它方式布局，需要根据页面动态布局的样式，可以在callback函数里面添加
		//callBack中可以重新动态定义广告位布局
		/*
		* 使用方法:
		* __ADV({
		*  id:'_0', //展位唯一标识 抽象出来的广告位，String
		*  debug:false //非必填字段，如果测试阶段，建议debug设置为true，可以使用23.200的测试接口
		* })
		* @param {object} id 展位的配置,以下划线开头
		*
		* */		
		var _url = 'https://activity.96225.com/ext_smk_activity/advertise/getAdByType.ext',//接口地址
		    __url = 'http://192.168.23.200:8082/ext_smk_activity/advertise/getAdByType.ext',//测试接口
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
									window.addEventListener('pagehide', function( e ){
										isPageHide = true;
									})
									//页面从缓存回到当前视图；页面第一次进入
									window.addEventListener('pageshow', function( e ){
										if(window.isPageHide) { 
										window.location.reload(); 
										}    
									})
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
				xhr.open('POST', option.debug ? __url : _url, true);
				//设置请求头，以表单形式提交数据
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.setRequestHeader('appId', "com.smk.test.test");
				xhr.send(_sData);
			}
		return __ADV;//暴露出来;
	}

    return {
      issmkApp: issmkApp,
      userInfo: userInfo,
      device: device,
      setShareInfo: setShareInfo,
      share: share,
      encrypt: encrypt,
      updateProfile: updateProfile,
      uploadImageByCamera: uploadImageByCamera,
      uploadImageByAlbum: uploadImageByAlbum,
      pushView: pushView,
      openComment: openComment,
      comment: comment,
      otherappinfo: otherappinfo,
      copy: copy,
      toolbar: toolbar,
      setTitle: setTitle,
      getToken: getToken,
      gotoNative: gotonative,
      actionbutton: actionbutton,
      enableDebug: enableDebug,
      protocol: protocol,
      Callbacks: Callbacks,
	  initAdvertise: adv()
    }
  }
  window.jsBridge = SmkApp(J.init)
}(window));