/* global window */
import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import {  remove } from 'services/user'
import * as usersService from 'services/users'
import { pageModel } from './common'
import {queryURL} from '../utils/index'
const { prefix,api } = config
import {ajax} from '../utils/index'

import { notification,Icon,message } from 'antd';
async function query (params) {
  console.log('params',params)
  return ajax({
    url:'sys/role/findPageList',
    data:params
  });
}
async function queryTree (params) {
  return ajax({
    url:'sys/catalogNode/getTreeNodes',
    data:params
  });
}

//获取角色的菜单权限
async function loadByRoleId (params) {
  return ajax({
    url:'sys/CatalogRole/loadByRoleId',
    data:params
  });
}


//.保存或修改用户角色权限
async function doSave (params) {
  return ajax({
    url:'sys/CatalogRole/doSave',
    data:params
  });
}


export default modelExtend(pageModel, {
  namespace: 'role_power',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    lists:[],
    checkeds:[],
    role:'',
    current:{},//当前选中行
    expandedKeys:[''],//初始化展开节点
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        console.log('入参字段pathname:',location)

        if (location.pathname === '/role_power') {
          const payload = location.search ? { page: queryURL('page',location.search), rows: queryURL('rows',location.search) } : { page: 1, pageSize: 10 }
          console.log('入参字段01:',location.search)
          console.log('入参字段02:',payload)
          dispatch({
            type: 'query',
            payload,
          })
          dispatch({
            type: 'queryTree',
          })
          console.log('请求结束:',location)
        }
      })
    },
  },

  effects: {
    * doSave({ payload }, { call, put, select }) {
      const data = yield call(doSave,payload)
      if (data.data.code == '0') {
        message.success('权限修改成功！');
      } else {
        throw data.data.msg
      }
    },
    * loadByRoleId({ payload }, { call, put, select }) {
      const current = {...payload.record};
      const data = yield call(loadByRoleId,{roleId:payload.roleId})
      const powerNodeIds = data.data.response ? data.data.response.powerNodeIds : '';
      if (data.data.code == '0') {
        console.log('CURRENT:',current)
        current._id = data.data.response ? data.data.response.id : false;
        yield put({ type: 'updateState', payload: { checkeds: powerNodeIds.split(','),current, } })

      } else {
        throw data
      }
    },
    * queryTree({ payload }, { call, put, select }) {
      const data = yield call(queryTree)
      if (data.data.code == '0') {
        yield put({ type: 'updateState', payload: { lists: data.data.response } })
      } else {
        throw data
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      console.log('个人用户请求参数',data)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.response.searchData,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.rows) || 10,//默认一页三个元素
              total: data.data.response.totalNum,
            },
          },
        })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      console.log('payload',payload)
      const data = yield call(del, { ids: payload.ids.join(',') })
      const { selectedRowKeys } = yield select(_ => _.help)
      if (data.data.code == '0') {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload);
      if (data.data.code == '0') {
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
      if (data.data.code == '0') {
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
