//index.js
//获取应用实例
var timeoutFlag = {};
Page({
    data: {
        tipText: '加载更多'
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
        9800);
        timeoutFlag.timer = {
            isTimeout: false
        };
        return timer;
    },
    loadMore: function() {
        var that = this;
        this.setData({
            tipText: '正在加载...'
        });
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 10000
        });
        var timer = that._setTimeoutFlag();
        this._getMoreProductList(timer);
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