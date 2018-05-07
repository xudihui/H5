/* global window */
import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import {  remove } from 'services/user'
import * as usersService from 'services/users'
import { pageModel } from './common'
import {queryURL} from '../utils/index'

const { prefix,api } = config



import axios from 'axios'
import { notification } from 'antd';
async function query (params) {
  console.log('params',params)
  return axios({
    method: 'post',
    url: api.help,
    data: params,
    headers: {'appId': 'com.smk.test.test'},
  })
}
async function create (params) {
  return axios({
    method: 'post',
    url: api.helpAdd,
    data: params,
    headers: {'appId': 'com.smk.test.test'},
  })
}

async function update (params) {
  return axios({
    method: 'post',
    url: api.helpUpdate,
    data: params,
    headers: {'appId': 'com.smk.test.test'},
  })
}
async function del (params) {
  return axios({
    method: 'delete',
    url: api.help,
    data: params,
    headers: {'appId': 'com.smk.test.test'},
  })
}

export default modelExtend(pageModel, {
  namespace: 'help',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        console.log('入参字段pathname:',location)

        if (location.pathname === '/help') {
          const payload = location.search ? { page: queryURL('page',location.search), rows: queryURL('rows',location.search) } : { page: 1, pageSize: 10 }
          console.log('入参字段01:',location.search)
          console.log('入参字段02:',payload)
          dispatch({
            type: 'query',
            payload,
          })
          console.log('请求结束:',location)
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      console.log('个人用户请求参数',data)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.response,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      console.log('payload',payload)
      const data = yield call(del, { ids: payload.ids.join(',') })
      const { selectedRowKeys } = yield select(_ => _.help)
      if (data.statusText == 'OK') {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload);
      if (data.statusText == 'OK') {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ help }) => help.currentItem._id)
      const newUser = { ...payload, id }
      const data = yield call(update, newUser)
      if (data.statusText == 'OK') {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

  },
})
