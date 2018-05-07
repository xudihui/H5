const APIV1 = '/api/v1'
const APIV2 = '/api/v2'
const BASE = 'http://192.168.2.177:3000'
import logo from '../public/logo.png'


module.exports = {
  name: '杭州市民卡',
  prefix: 'antdAdmin',
  footerText: '杭州市民卡管理后台v.2.1 © 2018',
  logo,
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  CORS: [],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  api: {
    userLogin: `${APIV1}/user/login`,
    userLogout: `${APIV1}/user/logout`,
    userInfo: `${APIV1}/userInfo`,
    users: `${APIV1}/users`,
    posts: `${APIV1}/posts`,
    user: `${APIV1}/user/:id`,
    menus: `${APIV1}/menus`,
    help: `${BASE}/help`,
    helpAdd: `${BASE}/help/add`,
    helpUpdate: `${BASE}/help/update`
  },
}
