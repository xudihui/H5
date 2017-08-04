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
      gotonative: "smknative:open{PAGE}",      
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
        lk = opt.shareUrl || "";
        protocol(Protocols.setshareinfo.replace("{shareTitle}", encodeURI(ti)).replace("{descContent}", encodeURI(des)).replace("{imgUrl}", img).replace("{lineLink}", lk))
       // protocol(encodeURI(Protocols.setshareinfo.replace("{shareTitle}", ti).replace("{descContent}", des).replace("{imgUrl}", img).replace("{lineLink}", lk)))

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

    function gotonative(page) {
      protocol(Protocols.gotonative.replace("{PAGE}", encodeURI(page)))
    }
    

    function actionbutton(name, callback) {
      Callbacks.afterActionbutton = callback;
      protocol(Protocols.actionbutton.replace("{NAME}", encodeURI(name)), callback)
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
      gotoNative: gotonative,
      actionbutton: actionbutton,
      enableDebug: enableDebug,
      protocol: protocol,
      Callbacks: Callbacks
    }
  }
  window.jsBridge = SmkApp(J.init)
}(window));