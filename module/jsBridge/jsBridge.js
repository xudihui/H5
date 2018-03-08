(function(window) {
	
   
  var CONFIG = {
	  ADV:'https://activity.96225.com/ext_smk_activity/advertise/getAdByType.ext',//广告位接口地址
	  _ADV:'http://192.168.23.200:8082/ext_smk_activity/advertise/getAdByType.ext',//广告位测试接口
	  GOV:'https://activity.96225.com/exthtml/mobile_links/govMatter/index.html'//政务网生产接口
  };
  
 var _Base64 = function(){  
   
    // private property  
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
   
    // public method for encoding  
    this.encode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;  
        var i = 0;  
       // input = _utf8_encode(input);  
        while (i < input.length) {  
            chr1 = input.charCodeAt(i++);  
            chr2 = input.charCodeAt(i++);  
            chr3 = input.charCodeAt(i++);  
            enc1 = chr1 >> 2;  
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
            enc4 = chr3 & 63;  
            if (isNaN(chr2)) {  
                enc3 = enc4 = 64;  
            } else if (isNaN(chr3)) {  
                enc4 = 64;  
            }  
            output = output +  
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +  
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);  
        }  
        return output;  
    }  
   
    // public method for decoding  
    this.decode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3;  
        var enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
        while (i < input.length) {  
            enc1 = _keyStr.indexOf(input.charAt(i++));  
            enc2 = _keyStr.indexOf(input.charAt(i++));  
            enc3 = _keyStr.indexOf(input.charAt(i++));  
            enc4 = _keyStr.indexOf(input.charAt(i++));  
            chr1 = (enc1 << 2) | (enc2 >> 4);  
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
            chr3 = ((enc3 & 3) << 6) | enc4;  
            output = output + String.fromCharCode(chr1);  
            if (enc3 != 64) {  
                output = output + String.fromCharCode(chr2);  
            }  
            if (enc4 != 64) {  
                output = output + String.fromCharCode(chr3);  
            }  
        }  
        output = _utf8_decode(output);  
        return output;  
    }  
   
    // private method for UTF-8 encoding  
   var _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");  
        var utftext = "";  
        for (var n = 0; n < string.length; n++) {  
            var c = string.charCodeAt(n);  
            if (c < 128) {  
                utftext += String.fromCharCode(c);  
            } else if((c > 127) && (c < 2048)) {  
                utftext += String.fromCharCode((c >> 6) | 192);  
                utftext += String.fromCharCode((c & 63) | 128);  
            } else {  
                utftext += String.fromCharCode((c >> 12) | 224);  
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);  
                utftext += String.fromCharCode((c & 63) | 128);  
            }  
   
        }  
        return utftext;  
    }  
   
    // private method for UTF-8 decoding  
   var _utf8_decode = function (utftext) {
        var string = "";  
        var i = 0;  
        var c = c1 = c2 = 0;  
        while ( i < utftext.length ) {  
            c = utftext.charCodeAt(i);  
            if (c < 128) {  
                string += String.fromCharCode(c);  
                i++;  
            } else if((c > 191) && (c < 224)) {  
                c2 = utftext.charCodeAt(i+1);  
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
                i += 2;  
            } else {  
                c2 = utftext.charCodeAt(i+1);  
                c3 = utftext.charCodeAt(i+2);  
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
                i += 3;  
            }  
        }  
        return string;  
    }  
}  

  var Base64 = new _Base64();
  var md5 = (function () {
  
  function safeAdd (x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  function bitRotateLeft (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  function md5cmn (q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff (a, b, c, d, x, s, t) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t)
  }
  function md5gg (a, b, c, d, x, s, t) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
  }
  function md5hh (a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5ii (a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t)
  }

  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length.
  */
  function binlMD5 (x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (len % 32)
    x[((len + 64) >>> 9 << 4) + 14] = len

    var i
    var olda
    var oldb
    var oldc
    var oldd
    var a = 1732584193
    var b = -271733879
    var c = -1732584194
    var d = 271733878

    for (i = 0; i < x.length; i += 16) {
      olda = a
      oldb = b
      oldc = c
      oldd = d

      a = md5ff(a, b, c, d, x[i], 7, -680876936)
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
      b = md5gg(b, c, d, a, x[i], 20, -373897302)
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

      a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
      d = md5hh(d, a, b, c, x[i], 11, -358537222)
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

      a = md5ii(a, b, c, d, x[i], 6, -198630844)
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

      a = safeAdd(a, olda)
      b = safeAdd(b, oldb)
      c = safeAdd(c, oldc)
      d = safeAdd(d, oldd)
    }
    return [a, b, c, d]
  }

  /*
  * Convert an array of little-endian words to a string
  */
  function binl2rstr (input) {
    var i
    var output = ''
    var length32 = input.length * 32
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff)
    }
    return output
  }

  /*
  * Convert a raw string to an array of little-endian words
  * Characters >255 have their high-byte silently ignored.
  */
  function rstr2binl (input) {
    var i
    var output = []
    output[(input.length >> 2) - 1] = undefined
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0
    }
    var length8 = input.length * 8
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32)
    }
    return output
  }

  /*
  * Calculate the MD5 of a raw string
  */
  function rstrMD5 (s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
  }

  /*
  * Calculate the HMAC-MD5, of a key and some data (raw strings)
  */
  function rstrHMACMD5 (key, data) {
    var i
    var bkey = rstr2binl(key)
    var ipad = []
    var opad = []
    var hash
    ipad[15] = opad[15] = undefined
    if (bkey.length > 16) {
      bkey = binlMD5(bkey, key.length * 8)
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5c5c5c5c
    }
    hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
    return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
  }

  /*
  * Convert a raw string to a hex string
  */
  function rstr2hex (input) {
    var hexTab = '0123456789abcdef'
    var output = ''
    var x
    var i
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i)
      output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f)
    }
    return output
  }

  /*
  * Encode a string as utf-8
  */
  function str2rstrUTF8 (input) {
    return unescape(encodeURIComponent(input))
  }

  /*
  * Take string arguments and return either raw or hex encoded strings
  */
  function rawMD5 (s) {
    return rstrMD5(str2rstrUTF8(s))
  }
  function hexMD5 (s) {
    return rstr2hex(rawMD5(s))
  }
  function rawHMACMD5 (k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
  }
  function hexHMACMD5 (k, d) {
    return rstr2hex(rawHMACMD5(k, d))
  }

  function md5 (string, key, raw) {
    if (!key) {
      if (!raw) {
        return hexMD5(string)
      }
      return rawMD5(string)
    }
    if (!raw) {
      return hexHMACMD5(key, string)
    }
    return rawHMACMD5(key, string)
  }

  return md5
})();

	Date.prototype.Format = function (fmt) { //author: meizz 
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
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
      }
	  document.documentElement.appendChild(_frame);
	  var timer = setTimeout(function() {
        _frame && removeFrame(_frame)
      }, 10000);
      return _frame
    }

    function removeFrame(frame) {
		if(frame && frame.parentNode){
			frame.parentNode.removeChild(frame);
		}
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
      init: init,
	  getFrame: getFrame
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
	
	function randomHex(base){
		var now = new Date(),
			t = now.time();
		return base+t
	}
    //辅助函数，格式化参数
	function formatParams(data) {
		var arr = [];
		for (var name in data) {
			arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
		}
		//设置随机数，防止缓存
		arr.push("t=" + Math.random());
		return arr.join("&");
	}	
	
    function __ajax(obj) {
			obj = obj || {};
			obj.type = (obj.type || 'GET').toUpperCase();
			obj.dataType = obj.dataType || 'json';
			var headers = obj.headers || {};
			var params = formatParams(obj.data); //参数格式化
			//step1:兼容性创建对象
			if (window.XMLHttpRequest) {
				var xhr = new XMLHttpRequest();
			} else {
				var xhr = new ActiveXObject('Microsoft.XMLHTTP');
			}
			//step4: 接收
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					try{
						if (xhr.status >= 200 && xhr.status < 300) {
							obj.success && obj.success(xhr.responseText, xhr.responseXML);
						} else {
							obj.error && obj.error(xhr.status);
						}                     
					}catch(e){}  
				}
			}
			//step2 step3:连接 和 发送
			if (obj.type == 'GET') {
				xhr.open('GET', obj.url + '?' + params, true);
				for(var i in headers){
					xhr.setRequestHeader(i, headers[i]);
				}
				xhr.send(null);
			} else if (obj.type == 'POST') {
				xhr.open('POST', obj.url, true);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				for(var i in headers){
					xhr.setRequestHeader(i, headers[i]);
				}
				xhr.send(params);
			}
			
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
		var width = window.innerWidth,//屏幕宽度
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
					type:'cityActivity',//城市报名活动报名结果页
					style:'position:absolute;bottom:15px',
					callBack:function(data,node){
						
					}
				}
			},
			__ADV = function(option){
				var target = layout[option['id']];
				var _parentNode = option['parentNode'] || document.querySelector('body');
				__ajax({
					url: option.debug ? CONFIG._ADV : CONFIG.ADV,
					type: "POST",
					headers:{appId:"com.smk.test.test"},
					dataType: "json",
					data: {
					 //  request: AES(JSON.stringify(obj), 'bdalipay@2017luo')
					 request:JSON.stringify({type:target['type']}) //调试阶段非加密保文
					},
					success: function(data, b) {
                        var data = JSON.parse(data);
						if(data.response.status == '1'){
							var node  = document.createElement('img');
							node.setAttribute('width',width);
							node.setAttribute('height',height);
							node.setAttribute('id','_adv'+option['id']);
							node.setAttribute('style',target.style||'');
							node.setAttribute('src',data.response.picture.indexOf('http') == 0 ? data.response.picture : (data.response.rFdsUrl + data.response.picture) ); //如果是http开头，直接采用，否则直接拼接
							node.addEventListener('click', function(){
								location.href = data.response.pictureUrl; //暂时H5这边都是入口页，如果广告位在结果页，并且是hash路由的话，一定一定要确保结果页能保留状态！！！！
							}, false);
							_parentNode.appendChild(node);
							target.callBack && target.callBack(data,node) //有回调的话，执行回调,传入响应数据。
							window.onhashchange = function(){ //针对React/F7/Vue项目的hash路由，每次路由变更，应当卸载广告图（因为广告图添加在body的根节点）
								if(node){
									_parentNode.removeChild(node);
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
					},
					error: function(status) { 
						
					}
				})	
			}
		return __ADV;//暴露出来;
	}
	
	function govMatter(opt){
		        var _opt = [];
				//深复制
                _opt.push(opt.mobile);	
				_opt.push(opt.sxbm);
		        var opt = opt || {};
				if(!opt.sxbm || !opt.mobile){
					return alert('sxbm和mobile必填！')
				}
		        opt.type = opt.type || 'accept';
				opt.projId = sessionStorage.getItem('__projId') || (opt.mobile + new Date().getTime());
				opt.time = new Date().Format("yyyy-MM-dd hh:mm:ss");
				var random = Math.floor(10000+Math.random()*10000);
				var accept = {
						data:JSON.stringify([{
							"handerDept": "市民卡公司",
							"dataVersion": "1",
							"acceptTime": opt.time,
							"projId": opt.projId,
							"systemCode": "SMKGS",
							"acceptMan": opt.mobile,
							"syncStatus": "I",
							"sxbm": opt.sxbm
						}]),
						systemCode: "SMKGS",
						sign:md5('SMKGSSMKGS'+random),
						randomStr:random,
				};
				var finish = {
						data:JSON.stringify([{
							"handerDept": "市民卡公司",
							"dataVersion": "1",
							"transactTime": opt.time,
							"projId": opt.projId,
							"systemCode": "SMKGS",
							"transactUser": opt.mobile,
							"syncStatus": "I",
							"transactResult": "办结",
							"sxbm": opt.sxbm
						}]),
						systemCode: "SMKGS",
						sign:md5('SMKGSSMKGS'+random),
						randomStr:random,
				};			
                if(opt.type == 'accept'){
					sessionStorage.setItem('__projId',opt.projId);
				}
				else{
					sessionStorage.removeItem('__projId');
				}	
				var data = {
					type:opt.type,
					mta:encodeURIComponent(JSON.stringify(_opt)),
					data:encodeURIComponent(JSON.stringify({type:opt.type == 'accept' ? 'S' : 'finish',data:formatParams(finish)}))
				}
				J.getFrame(CONFIG.GOV + '?' + formatParams(data))
	}
	
			
		/**
		 * 发起SDK支付
		 *
		 * @param {opt} 订单完整字段
		 * @returns
		 */
		var sdkPay = function(e){
			//{"orderNo":null,"dateTime":null,"amount":0,"cardnumber":null,"goods":null,"merCode":null,"mersign":null,"mertxtypeid":null,"storeid":null,"orderDesc":null,"payTime":null}
			var r = {
				appid: "appid",
				url: "smkapp://smkpayview",
				params: {
					orderNo: e.orderNo,
					dateTime: e.dateTime,
					amount: "" + e.amount,
					cardnumber: e.cardnumber,
					goods: e.goods,
					merCode: e.merCode,
					mersign: e.mersign,
					mertxtypeid: e.mertxtypeid,
					storeid: e.storeid
				}
			};
			location.href = "smkapp://smkpay/" + Base64.encoder(JSON.stringify(r));
		}

		/**
		 * 发起wap支付
		 *
		 * @param {t,mode} 订单加密字段
		 * @returns
		 */
		var wapPay = function(t,mode) {
			if(mode == 'dev'){
				location.href = "http://115.236.162.166:18081/exthtml/smkpay-h5/index.html#!/externalWapPay.html?smk_pay=" + t //测试环境
			}
			else{
				location.href = "https://mobilepay.96225.com/exthtml/smkpay-h5/index.html#!/externalWapPay.html?smk_pay=" + t //生产环境
			}
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
	  initAdvertise: adv(),
	  govMatter:govMatter,
	  sdkPay:sdkPay,
	  wapPay:wapPay
    }
  }
  window.jsBridge = SmkApp(J.init)
}(window));