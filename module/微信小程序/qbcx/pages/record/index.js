//index.js
//获取应用实例
var CONFIG = require('../../src/config.js'); //请求地址模块引入
var AES = require('../../src/AES.js'); //加密模块引入
var data = '{"Trades":[{"NUM":537,"MONEY":560,"TRADETIME":"2017-01-10 10:39:09","TRADETYPE":1,"ROWNUM_":1},{"NUM":536,"MONEY":273,"TRADETIME":"2017-01-10 08:53:04","TRADETYPE":1,"ROWNUM_":2},{"NUM":535,"MONEY":364,"TRADETIME":"2016-12-30 16:06:38","TRADETYPE":1,"ROWNUM_":3},{"NUM":534,"MONEY":364,"TRADETIME":"2016-12-23 14:43:07","TRADETYPE":1,"ROWNUM_":4},{"NUM":533,"MONEY":164,"TRADETIME":"2016-12-21 08:53:52","TRADETYPE":1,"ROWNUM_":5},{"NUM":532,"MONEY":364,"TRADETIME":"2016-12-21 08:50:45","TRADETYPE":1,"ROWNUM_":6},{"NUM":531,"MONEY":273,"TRADETIME":"2016-11-29 18:29:31","TRADETYPE":1,"ROWNUM_":7},{"NUM":530,"MONEY":273,"TRADETIME":"2016-11-29 17:44:44","TRADETYPE":1,"ROWNUM_":8},{"NUM":529,"MONEY":164,"TRADETIME":"2016-10-31 18:17:10","TRADETYPE":1,"ROWNUM_":9},{"NUM":528,"MONEY":364,"TRADETIME":"2016-10-31 17:14:53","TRADETYPE":1,"ROWNUM_":10},{"NUM":527,"MONEY":364,"TRADETIME":"2016-10-28 21:46:14","TRADETYPE":1,"ROWNUM_":11},{"NUM":526,"MONEY":164,"TRADETIME":"2016-10-26 08:55:57","TRADETYPE":1,"ROWNUM_":12},{"NUM":525,"MONEY":364,"TRADETIME":"2016-10-26 08:51:20","TRADETYPE":1,"ROWNUM_":13},{"NUM":524,"MONEY":164,"TRADETIME":"2016-10-24 07:46:57","TRADETYPE":1,"ROWNUM_":14},{"NUM":523,"MONEY":364,"TRADETIME":"2016-10-24 07:42:07","TRADETYPE":1,"ROWNUM_":15},{"NUM":522,"MONEY":273,"TRADETIME":"2016-10-19 11:06:15","TRADETYPE":1,"ROWNUM_":16},{"NUM":521,"MONEY":273,"TRADETIME":"2016-10-19 08:54:12","TRADETYPE":1,"ROWNUM_":17},{"NUM":520,"MONEY":273,"TRADETIME":"2016-10-18 18:39:44","TRADETYPE":1,"ROWNUM_":18},{"NUM":519,"MONEY":273,"TRADETIME":"2016-10-18 07:16:42","TRADETYPE":1,"ROWNUM_":19},{"NUM":518,"MONEY":273,"TRADETIME":"2016-10-17 21:31:27","TRADETYPE":1,"ROWNUM_":20}],"CardMoney":"27885","ReturnSeq":"17011211314180","LastTradeTime":"20170110103909","RetMsg":"查询余额和交易记录成功","RetCode":"9000","FunCode":"6003"}'
var timeoutFlag = {};
Page({
    data: {
        tipText: '加载更多',
        CardMoney: '',
        Trades:'',
        pageno:1,
        CardNumber:''

    },
 onLoad: function (options) {   
    var that = this; 
    var date = new Date();
    var type = options.CardNumber.length=='9' ? "1":"3";
//钱包查询结果
/*
 * FunCode      6003        String  
 * ReqSeq       请求方流水号  String
 * CardNumber   卡号          String  
 * Currpage     当前页     
 * PageSize         
 * CardType     卡类型         1 市民卡 3：杭州通卡    String  
 ** UserNo      手机号     选填
 ** smid            
 */    


    var obj = {
        "ReqSeq":0,
        "CardNumber":options.CardNumber,
        "CardType":type,
        "FunCode":"6003",
        "PageSize":"20",
        "Currpage":that.data.pageno,
        "UserNo":"",
        "smid":""
    }
    wx.showToast({
        title: '拼命加载中...',
        icon: 'loading',
        duration: 6000
    });    
    wx.request({    
        url: CONFIG.purse,    
        method: 'GET',    
        data: {
        //  "request":AES(JSON.stringify(obj))
         "request":AES('{\"ReqSeq\":\"'+0+'\",\"smid\":\"'+''+'\",\"CardType\":\"'+type+'\",\"CardNumber\":\"'+options.CardNumber+'\",\"UserNo\":\"'+''+'\",\"Currpage\":\"'+that.data.pageno+'\",\"PageSize\":\"'+'20'+'\",\"FunCode\":\"'+'6003'+'\"}')
        // "request":AES('{\"smid\":\"'+''+'\",\"CardType\":\"'+(options.CardNumber.length=='9' ? "1":"3")+'\",\"CardNumber\":\"'+options.CardNumber+'\",\"UserNo\":\"'+''+'\",\"Currpage\":\"'+that.data.pageno+'\",\"PageSize\":\"'+20+'\",\"FunCode\":\"'+'6003'+'\"}')
        // "request":"Sm8XVFCJoSfCF90Es1lSUern5qhD5HXfzZHqluaPOe9XuRbSfrBJdov77r34hLDQlzZ1ZdpJtsepSL/QZB1XNP33Buz+oAEmx2hgPgOXgKiBE/D4zsDf9d5jGngt16gDKoOFC3wMj5JwJ2HdaKz9mpef2dDuLvJlr/ktwnlmcWQ="
        // "request":"0cUNA/BWXZEpTUdsksa6SPtVD1aGoqVpVsHc6t6IqO9hilmPKEhu/73VUhgubdBfQjYlR78Yt+ZccHPDxfVPGXwH9irb6VCeeODKo74HyKIf+9e9rrWFI5kq+CIwvq9STWw6FMeQLPTHBzpRl+moqVG0nYCra3raEuBV41O9fxw5QXj3UVCH3EiyfSGzFOX+"
        },
        header: {
         'content-type': 'application/json',
         'appId': 'com.smk.h5.tg',
         'channelId':'qd010',
         'activitycode':'wb_qb'
        },      
        success: function (res) {  
         wx.hideToast();   
         that.setData({      
          Trades: res.data.Trades,
          CardMoney:res.data.CardMoney/100,
          CardNumber:options.CardNumber,
          type:type
         });    
        },
        fail: function (res) {  
         wx.hideToast();   
         wx.showModal({
            content: '暂时无法获取钱包信息！',
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
    showTip: function(e) {
            wx.showModal({
            title: '查询结果说明',
            content: '因数据上传有延迟，查询结果仅供参考',
            confirmText:'知道了',
            showCancel:false,
            success: function(res) {
            if (res.confirm) {
            console.log('用户点击确定')
            }
            }
            })
    },  

    _setTimeoutFlag: function() {
        var that = this;
        var timer = null;
        timer = setTimeout(function() {
            that.setData({
                tipText: '查看更多'
            });
            timeoutFlag.timer = {
                isTimeout: true
            };
        },
        5800);
        timeoutFlag.timer = {
            isTimeout: false
        };
        return timer;
    },
    loadMore: function() {
        
        var that = this;
        if(that.data.tipText == '没有更多了'){
            wx.showToast({
                title: '已经没有更多了！',
                icon: 'success',
                duration: 2000
            });         
        }
        else{
            this.setData({
                tipText: '正在加载...'
            });
            wx.showToast({
                title: '拼命加载中...',
                icon: 'loading',
                duration: 6000
            });
            var timer = that._setTimeoutFlag();
            this._getMoreProductList(timer);            
        }

    },
    _getMoreProductList: function(timer) {
        var that = this;
    wx.request({    
        url: CONFIG.purse,    
        method: 'GET',    
        data: {
         "request":AES('{\"ReqSeq\":\"'+0+'\",\"smid\":\"'+''+'\",\"CardType\":\"'+that.data.type+'\",\"CardNumber\":\"'+that.data.CardNumber+'\",\"UserNo\":\"'+''+'\",\"Currpage\":\"'+that.data.pageno+'\",\"PageSize\":\"'+'20'+'\",\"FunCode\":\"'+'6003'+'\"}')},
        header: {
         'content-type': 'application/json',
         'appId': 'com.smk.h5.tg',
         'channelId':'qd010',
         'activitycode':'wb_qb'
        },      
        success: function (res) {  
         wx.hideToast();  
         console.log(data)
        if (!timeoutFlag.timer.isTimeout) {
            if (res.data.Trades.length > 1) {
                 that.setData({      
                  Trades: that.data.Trades.concat(res.data.Trades),
                  pageno: ++that.data.pageno,
                  tipText: '查看更多'
                 }); 
            } else {
                that.setData({
                    tipText: '没有更多啦'
                });
            }
        }
        clearTimeout(timer);
        wx.hideToast();          
  
        },
        fail: function (res) {  
         wx.hideToast();   
         wx.showModal({
            content: '暂时无法获取钱包信息！',
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
    }
})