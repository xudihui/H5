

//地址配置
/* nginx增加配置行
 *      location /web_hzsmk/AlipayBdServlet {
 *           proxy_pass   http://weixin.96225.com/web_hzsmk/AlipayBdServlet;
 *      }
 *
 * $AlipayBdServlet       公交充值唯一接口
 * $APPID      ajax请求头HEADER 
 * $userSystem 用户系统
 * 
 * 在app外部   ?activityCode=qmdb&channelId=360&inviteCode=xxx&mobile=15067425400
 * 在app内部   ?activityCode=qmdb&channelId=360&isApp=true
 *
 *
 * 
 */


//本地开发环境
//localStorage.clear();//测试阶段强制清空离线存储
var $AlipayBdServlet = "/web_hzsmk/AlipayBdServlet",
$UserSystemServlet = "/web_hzsmk/UserSystemServlet",
$APPID = "com.ext.alipay.bd",
$userSystem = "04",
$shareUrl = '',
$refund = {9000:"退款成功",
            9001:"原交易金额（可退款金额）小于请求退款金额",
            9002:"原交易已退款成功,重复退款",
            9003:"用户和订单不符",
            9006:"退款中",
            9999:"系统异常",
            9100:"该订单已退款",
            9200:"该订单不能退款",
            9300:"该订单不存在",
            9400:"退款失败"},
$cardType = {0:"普通卡",
            1:"老人优惠月卡",
            3:"学生优惠月卡",
            4:"成人优惠月卡",
            5:"成人优惠系卡",
            6:"成人优惠旬卡",
            7:"老人优惠卡",
            8:"老年年卡",
            9:"学生优惠期卡",
            10:"员工卡",
            11:"司机A卡",
            13:"停车管理员卡",
            14:"普通调度员卡",
            15:"公务A卡",
            16:"公务B卡",
            17:"杭州通",
            18:"市民卡",
            19:"Z卡",
            23:"旅游消费卡",
            26:"专用Z0卡",
            27:"停车卡",
            29:"淳安停车卡",
            33:"学生市民卡"};


/*
//生产环境地址配置
var $AlipayBdServlet = "/web_hzsmk/AlipayBdServlet";


var $APPID = "com.smk.h5.tg";
var $userSystem = "";
var $shareUrl = '';
*/

