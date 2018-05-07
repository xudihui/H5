/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import {queryURL} from '../utils/index'
import { EnumRoleType } from 'enums'
import { query, logout } from 'services/app'
import * as menusService from 'services/menus'
import queryString from 'query-string'
const { prefix } = config
import {ajax} from '../utils/index'

//把地址栏中的token存储到local中
if(queryURL('smkToken')){
  localStorage.setItem('token',queryURL('smkToken'))
}
async function getLeftMenu (params) {
  return ajax({
    url:'sys/user/getTabsByUser',
    data:params
  });
}

export default {
  namespace: 'app',
  state: {
    user: JSON.parse(localStorage.getItem('user') || '{}'),
    permissions: {
      visit: [],
    },
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: 'Dashboard',
        router: '/dashboard',
      },
    ],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
  },
  subscriptions: {

    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },

    setup ({ dispatch }) {
      dispatch({ type: 'query' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },

  },
  effects: {

    * query ({
      payload,
    }, { call, put, select }) {
      var user_ = JSON.parse(localStorage.getItem('user') || '{}');
      var {token} = user_;
      if(!token){
        token = queryURL('smkToken') || false; //先从local捞取，再去url中捞取
      }
      if(token){
        const data = yield call(getLeftMenu,{catalogId:queryURL('smkCatalogId')});
        if (data.data.code == 0) {
          console.log(data.data.response)
          yield put({ type: 'updateState', payload:{
            menu:data.data.response
          }})
        } else {
          throw data
        }
        var menuTree = data.data.response;
        menuTree.map((i,index) => {
          i.name = i.label;
          i.icon = i.iconName;
          i.route = i.doInvoke;
          i.mpid = i.parentId;
        })
        var menu_a = [
          {
            id: '122',
            icon: 'laptop',
            name: '效果分析',
            route: '/dashboard',
          },
          /*
          {
            id: '322',
            name: '帮助文档',
            icon: 'laptop',
            route: '/help',
          },
          {
            id: '3222',
            name: '角色权限',
            icon: 'laptop',
            route: '/role_power',
          },
          {
            id: '32222',
            name: '菜单目录',
            icon: 'laptop',
            route: '/menu_list',
          },
          {
            id: '522',
            name: '图表',
            icon: 'code-o',
          },
          {
            id: '52123',
            bpid: '522',
            mpid: '522',
            name: 'highCharts',
            icon: 'bar-chart',
            route: '/chart/highCharts',
          },
          {
            id: '533123',
            bpid: '522',
            mpid: '522',
            name: 'Rechartst',
            icon: 'area-chart',
            route: '/chart/Recharts',
          }
          */
        ];
        const menu = menuTree.concat(menu_a);
        console.log(menu)
        yield put({
          type: 'updateState',
          payload: {
            menu,
          },
        })
        if (location.pathname === '/login') {
          yield put(routerRedux.replace({
            pathname: '/dashboard',
          }))
        }
        return


      }
      const { locationPathname } = yield select(_ => _.app)
       if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
        yield put(routerRedux.replace({
          pathname: '/login',
          search: queryString.stringify({
            from: locationPathname,
          }),
        }))
      }
    },

    * logout ({
      payload,
    }, { call, put }) {
    //  const data = yield call(logout, parse(payload))
      localStorage.setItem('user','{}');//清空localstorage，后续要增加yield接口
      yield put({ type: 'query' })
    },

    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
