import { routerRedux } from 'dva/router'
//import { login } from 'services/login'


import axios from 'axios'
import { notification } from 'antd';
async function login (params) {
  return axios({
    method: 'post',
    url: $BASE + 'sys/user/login.do',
    data: params
  })
}

async function yzm (params) {
  return axios({
    method: 'post',
    url: $BASE + 'verification/getImg.do',
    data: params
  })
}


async function menu (params) {
  return axios({
    method: 'post',
    url: $BASE + 'sys/user/getRootTabsByUser.do',
    data: params
  })
}

export default {
  namespace: 'login',

  state: {yzm:{},menu:[]},
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/login') {
          dispatch({
            type: 'getYzm',
            payload:{
              yzm:''
            }
          })

        }
      })
    },
  },
  reducers: {
    updateLogin (state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    * getYzm ({
      payload,
    }, { put, call, select }) {
      const data = yield call(yzm)
      if (data.data.code == 0) {
        yield put({ type: 'updateLogin', payload:{
          yzm:data.data.response
        }})
      } else {
        throw data
      }
    },
    * getMenu ({
      payload,
    }, { put, call, select }) {
      const data = yield call(menu)
      if (data.data.code == 0) {
        yield put({ type: 'updateLogin', payload:{
          menu:data.data.response
        }})
      } else {
        throw data
      }
    },
    * login ({
      payload,
    }, { put, call, select }) {
      const data = yield call(login, payload)
      console.log('登录字段：',data)
      const { locationQuery } = yield select(_ => _.app)
      if (data.data.code == 0) {
        const { from } = locationQuery;
        localStorage.setItem('user',JSON.stringify(data.data.response));
        yield put({
          type: 'app/updateState',
          payload: {
            user:data.data.response
          },
        })
        yield put({ type: 'app/query' })
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        throw data
      }
    },
  },

}
