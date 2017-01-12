//index.js
//获取应用实例

var data = '{"Trades":[{"NUM":537,"MONEY":560,"TRADETIME":"2017-01-10 10:39:09","TRADETYPE":1,"ROWNUM_":1},{"NUM":536,"MONEY":273,"TRADETIME":"2017-01-10 08:53:04","TRADETYPE":1,"ROWNUM_":2},{"NUM":535,"MONEY":364,"TRADETIME":"2016-12-30 16:06:38","TRADETYPE":1,"ROWNUM_":3},{"NUM":534,"MONEY":364,"TRADETIME":"2016-12-23 14:43:07","TRADETYPE":1,"ROWNUM_":4},{"NUM":533,"MONEY":164,"TRADETIME":"2016-12-21 08:53:52","TRADETYPE":1,"ROWNUM_":5},{"NUM":532,"MONEY":364,"TRADETIME":"2016-12-21 08:50:45","TRADETYPE":1,"ROWNUM_":6},{"NUM":531,"MONEY":273,"TRADETIME":"2016-11-29 18:29:31","TRADETYPE":1,"ROWNUM_":7},{"NUM":530,"MONEY":273,"TRADETIME":"2016-11-29 17:44:44","TRADETYPE":1,"ROWNUM_":8},{"NUM":529,"MONEY":164,"TRADETIME":"2016-10-31 18:17:10","TRADETYPE":1,"ROWNUM_":9},{"NUM":528,"MONEY":364,"TRADETIME":"2016-10-31 17:14:53","TRADETYPE":1,"ROWNUM_":10},{"NUM":527,"MONEY":364,"TRADETIME":"2016-10-28 21:46:14","TRADETYPE":1,"ROWNUM_":11},{"NUM":526,"MONEY":164,"TRADETIME":"2016-10-26 08:55:57","TRADETYPE":1,"ROWNUM_":12},{"NUM":525,"MONEY":364,"TRADETIME":"2016-10-26 08:51:20","TRADETYPE":1,"ROWNUM_":13},{"NUM":524,"MONEY":164,"TRADETIME":"2016-10-24 07:46:57","TRADETYPE":1,"ROWNUM_":14},{"NUM":523,"MONEY":364,"TRADETIME":"2016-10-24 07:42:07","TRADETYPE":1,"ROWNUM_":15},{"NUM":522,"MONEY":273,"TRADETIME":"2016-10-19 11:06:15","TRADETYPE":1,"ROWNUM_":16},{"NUM":521,"MONEY":273,"TRADETIME":"2016-10-19 08:54:12","TRADETYPE":1,"ROWNUM_":17},{"NUM":520,"MONEY":273,"TRADETIME":"2016-10-18 18:39:44","TRADETYPE":1,"ROWNUM_":18},{"NUM":519,"MONEY":273,"TRADETIME":"2016-10-18 07:16:42","TRADETYPE":1,"ROWNUM_":19},{"NUM":518,"MONEY":273,"TRADETIME":"2016-10-17 21:31:27","TRADETYPE":1,"ROWNUM_":20}],"CardMoney":"27885","ReturnSeq":"17011211314180","LastTradeTime":"20170110103909","RetMsg":"查询余额和交易记录成功","RetCode":"9000","FunCode":"6003"}'
var timeoutFlag = {};
Page({
    data: {
        tipText: '加载更多',
        Trades:JSON.parse(data)['Trades']
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
                tipText: '没有更多了'
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
                title: '放弃吧，徐迪灰偷懒，根本没做更多数据',
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
            url: 'https://weixin.96225.com/weixin/financial/fronthtml',
            method: 'GET',
            data: {
                limit: 10,
                offset: this.data.offset + 10,
                shelf__id: this.data.shelfId,
                img_size: 'small'
            },
            success: function(data) {
                console.log(data)
                if (!timeoutFlag.timer.isTimeout) {
                    if (data.data.objects.length > 1) {
                        var objects = that.data.productList.concat(data.data.objects);
                        that.setData({
                            productList: objects,
                            offset: that.data.offset + 10,
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
            fail: function() {
                that.setData({
                    tipText: '查看更多'
                });
                wx.hideToast();
            }
        });
    }
})