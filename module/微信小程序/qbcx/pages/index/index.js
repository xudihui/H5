//index.js
//获取应用实例
//
//
var AES = require('../../src/AES.js'); //加密模块引入
var CONFIG = require('../../src/config.js'); //请求地址模块引入
var file = 'pages/test/index';
var MOBILE = '';
var REG ={
    mobile: /^0?1[3-8|4|5|7|8][0-9]\d{8}$/,
    cardNumber:{
      smk:/^[a-zA-Z]+\d{7}[a-zA-Z0-9]+$/,
      hzt:/^\d{8,16}$/,
    },
    code:/^\d{6}$/
}
/*
 * 函数名：String.setStars
 * 变量：无
 * 依赖： 无
 * 作用：将手机号中间段替换为星
 */
String.prototype.setStars = function(index){  //扩展字符串原型方法，隐藏某个字符为*号，默认第二位，适用于不宜显示全部字段的场景
   var self = this.replace(/ /g,''); //去除空格    
   if(REG.mobile.test(self)){//是手机号码，进入手机号码加*号       
     return self.slice(0,3)+'****'+self.slice(-4);//使用最传统的前三后四     
   }else{
     var arr = self.split('');
     arr[ index||1 ] = ' * '; //默认为第二个字符，当然也可以传入参数，位数从0开始计算
     return arr.join('');    
   }
};
/*
 * 函数名：String.removeAllSpace
 * 变量：无
 * 依赖： 无
 * 作用：去除字符串所有空格，区别trim
 */
String.prototype.removeAllSpace = function(){ 
  var  self =  this;
  return self.replace(/\s+/g, "");
}


      var countDown = function(self,mobile,cardNumber){    
        self.setData({time:'发送中...'});  
    wx.showToast({
        title: '验证码发送中...',
        icon: 'loading',
        duration: 6000
    });         
    wx.request({    
        url: CONFIG.loginSend,    
        method: 'GET',    
        data: {
          "request":AES('{\"mobile\":\"'+mobile+'\",\"channelId\":\"'+'qd010'+'\",\"activitycode\":\"'+'wb_qb'+'\",\"userSystem\":\"'+'0028'+'\"}')
        },
        header: {
         'content-type': 'application/json',
         'appId': 'com.smk.h5.tg',
         'channelId':'qd010',
         'activitycode':'wb_qb'
        },      
        success: function (res) {  
         wx.hideToast();   
          var wait = 60;
          clearInterval(self.data.timer);
          var timer=setInterval(function(){
            if(wait==0){
              clearInterval(timer)
              self.setData({time:'重新发送'});
              wait=null;
            }else{
              self.setData({time:'重新发送('+wait+'s)'});
              wait--;
            }
          },1000);
          self.setData({timer:timer,cardNumber:cardNumber,sendType:res.data.sendType});   
        },
        fail: function (res) {  
         wx.hideToast();   
         wx.showModal({
            content: '暂时无法发送验证码！',
            confirmText:'知道了',
            showCancel:false,
            success: function(res) {
                if (res.confirm) {
                console.log('用户点击确定')
                }
            }
            })   
        }
   });         

      };

let app = getApp();
var wetoast;
Page({
  data: {
    imgUrls: [
      '../../images/card1.png',
      '../../images/card2.png'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    css:'display:none',
    modalHidden: true,
    _mobile:'',
    mobile:'',
    time:'发送中...',
    timer:null,
    code:''
  },
  onLoad:function(option){
    // 页面初始化 options为页面跳转所带来的参数
    this.type = option.type
    this.setData({type:this.type})
    
    //创建可重复使用的toast实例，并附加到this上，通过this.wetoast访问
    new app.WeToast()
  },

  onRun () {
    let type = this.type
    this[type + 'Toast']()
  },
  updateCode: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  sendCode: function(e) {
    var self = this;
    if(self.data.time == '重新发送'){
      countDown(self,self.data.mobile,self.data.cardNumber)
    }
  },
  formBindsubmit:function(e){
    var self = this;
    var flag = false;
    var showTips = function(t){
      self.wetoast.toast({
          title: t,
          duration: 2000
      })
    }
    var mobile = e.detail.value.tel;
    var cardNumber = e.detail.value.card;
    if(!mobile){return showTips('请输入您的手机号')}
    if(!cardNumber){return showTips('请输入您要查询的卡号')}
    if(!REG.mobile.test(mobile)){return showTips('输入的手机号不规范，请重新输入')}
    if(cardNumber.length==9){
      if(!REG.cardNumber.smk.test(cardNumber)){return showTips('输入的卡号不存在，请重新输入')}
    }else{
      if(!REG.cardNumber.hzt.test(cardNumber)){return showTips('输入的卡号不存在，请重新输入')}
    }
    try {
     var value = wx.getStorageSync('mobile') || '';
     if (value==mobile) {
      flag = true;
     }
    } catch (e) {
      // Do something when catch error
    }
    if(!flag){

      var _mobile = mobile.setStars();//将手机号转星
      self.setData({_mobile:_mobile,mobile:mobile,code:'',modalHidden: false});

      if(!self.data.sendType || mobile!=MOBILE){ 
         MOBILE = mobile; //设置上次发验证码的手机号
         return countDown(self,mobile,cardNumber)
      }

    }
    else{
      wx.navigateTo({
      url: '../record/index?CardNumber='+cardNumber
      })
    }
  },
  modalOk: function(e) {
    var self = this;
    var showTips = function(t){
      self.wetoast.toast({
          title: t,
          duration: 2000
      })
    }
   var code = this.data.code;
   var mobile = this.data.mobile;
   if(!code){return showTips('请输入您收到的验证码')}
   if(!REG.code.test(code)){return showTips('请输入正确的验证码')}   

   wx.showToast({
        title: '验证码校验中...',
        icon: 'loading',
        duration: 6000
    });         
    wx.request({    
        url: CONFIG.loginNoPwd,    
        method: 'GET',    
        data: {
          "request":AES('{\"mobile\":\"'+mobile+'\",\"userSystem\":\"'+'0028'+'\",\"veriCode\":\"'+code+'\",\"channelId\":\"'+'qd010'+'\",\"activitycode\":\"'+'wb_qb'+'\",\"sendType\":\"'+self.data.sendType+'\"}')
        },
        header: {
         'content-type': 'application/json',
         'appId': 'com.smk.h5.tg',
         'channelId':'qd010',
         'activitycode':'wb_qb'
        },      
        success: function (res) {  
         wx.hideToast();  
          if(res.data.retCode=='9000'){
            try {
              wx.setStorageSync('mobile', self.data.mobile)
            } catch (e) {    
            }            
            self.setData({
             modalHidden: true,
             sendType:false
            });
            wx.navigateTo({
             url: '../record/index?CardNumber='+self.data.cardNumber
            })
          }else{
            showTips(res.data.retMsg)
          }

        },
        fail: function (res) {  
         wx.hideToast();   
         wx.showModal({
            content: '暂时无法校验验证码！',
            confirmText:'知道了',
            showCancel:false,
            success: function(res) {
                if (res.confirm) {
                console.log('用户点击确定')
                }
            }
            })   
        }
   });       


  },
  modalCancle: function(e) {
    this.setData({
      modalHidden: true
    })
  },

  showCard: function(e) {
    this.setData({
      css: 'display:block'
    })
  },  
  hideCard: function(e) {
    this.setData({
      css: 'display:none'
    })
  },  
  /**
   * 设置NavigationTitle
   */
  setNavigationBarTitle: function() {
    wx.setNavigationBarTitle({
      title: '我是通过API设置的NavigationBarTitle'
    })
  },

  /**
   * 设置加载状态
   */
  showNavigationBarLoading: function() {
    wx.showNavigationBarLoading()
  },

  /**
   * 隐藏加载状态
   */
  hiddenNavigationBarLoading: function() {
    wx.hideNavigationBarLoading()
  },

  /**
   * 保留当前Page跳转
   */
  navigateTo: function() {
    wx.navigateTo({
      //传递参数方式向get请求拼接参数一样
      url: '../test/index',
      success: function(res) {
        console.log(res)
      },
      fail: function(err) {
        console.log(err)
        console.log(11)
      }

    })
  },
  tapName: function() {   wx.navigateTo({     url: '../test/index'   }) },
  tapChange: function() {   wx.navigateTo({     url: '../change/index'   }) },
  tapList: function() {   wx.navigateTo({     url: '../list/index'   }) },
  /**
   * 关闭当前页面进行跳转当前页面会销毁
   */
  redirectTo: function() {
    wx.redirectTo({
       //传递参数方式向get请求拼接参数一样
      url: '../test/index'
    })
  },
  /**
   * 退回到上一个页面
   */
  navigateBack: function() {
    wx.navigateBack()
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})