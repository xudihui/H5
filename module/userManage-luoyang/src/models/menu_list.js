/* global window */
import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import {  remove } from 'services/user'
import * as usersService from 'services/users'
import { model } from './common'
import {queryURL} from '../utils/index'
const { prefix,api } = config
import {ajax} from '../utils/index'

import _ from 'lodash'
import { notification,Icon,message } from 'antd';

async function queryTree (params) {
  return ajax({
    url:'sys/catalogNode/getTreeNodes',
    data:params
  });
}

//删除菜单目录
async function doDelete (params) {
  return ajax({
    url:'sys/catalogNode/doDelete',
    data:params
  });
}


//保存或修改菜单目录
async function doSave (params) {
  return ajax({
    url:'sys/catalogNode/doSave',
    data:params
  });
}


export default modelExtend(model, {
  namespace: 'menu_list',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    lists:[],
    checkeds:[],
    activeKey:'1',//默认选中
    role:'',
    current:{},//当前选中菜单
    currentNew:{},//新增的子菜单
    expandedKeys:[''],//初始化展开节点
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/menu_list') {
          dispatch({
            type: 'queryTree',
          })
          console.log('请求结束:',location)
        }
      })
    },
  },

  effects: {
    * doDelete({ payload }, { call, put, select }) {
      const data = yield call(doDelete,payload)
      const {lists} = yield select(_ => _.menu_list);
      _.remove(lists, function(n) {
            return n.id == payload.ids;
          });
      if (data.statusText == 'OK') {
        message.success('菜单删除成功！');
        yield put({ type: 'updateState', payload: { lists,current:{
          parentId:0
        }} })
      } else {
        throw data
      }
    },
    * doSave({ payload }, { call, put, select }) {
      const data = yield call(doSave,payload)

      if (data.statusText == 'OK') {
        message.success('菜单修改成功！');
        const {lists} = yield select(_ => _.menu_list);
        if(payload.id){
          //修改菜单
        }
        else{
          //新增菜单
          //lists.unshift(payload);//不现实啊，因为不知道入库之后的真实ID
        }
        yield put({ type: 'queryTree'})

      } else {
        throw data
      }
    },
    * queryTree({ payload }, { call, put, select }) {
      const data = yield call(queryTree)
      const {id} = yield select(_ => _.menu_list.current);
      if (data.statusText == 'OK') {
        const current = _.filter(data.data.response, function(o) { return (o.id == id ) })[0];
        if(id){
          yield put({ type: 'updateState', payload: { lists: data.data.response,current }})
        }
        else{
          yield put({ type: 'updateState', payload: { lists: data.data.response }})
        }

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
              pageSize: Number(payload.rows) || 3,//默认一页三个元素
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
