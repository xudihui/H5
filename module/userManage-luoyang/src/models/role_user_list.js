
import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { pageModel } from './common'
import {Ajax} from '../utils/index'
import { message } from 'antd';
import pathToRegexp from 'path-to-regexp'

var api = {
  doQuery:'sys/RoleUser/findPageList',//查询
  doSave:'sys/RoleUser/doSave',       //增加和修改，增加的时候不传入ID，修改的时候传入ID
  doDelete:'sys/RoleUser/doDelete',   //删除，ids:'1,2,3,4'
  doQueryUser:'sys/user/findPageList',//查询用户列表
}

var dataFormat = {
  nameSpace:'role_user_list',
  data:[
    {
      title: '用户名',
      dataIndex: 'userName',
    }, {
    title: '角色名称',
    dataIndex: 'roleLabel',
    rules: [
      {
        required: true,
        message:'角色名称不能为空'
      },
      ]
  },{
    title: 'userId',
    dataIndex: 'userId',
    rules: [
      {
        required: true,
        message:'userId不能为空'
      },
      ]
  },
    {
      title: 'roleId',
      dataIndex: 'roleId',
      rules: [
        {
          required: true,
          message:'roleId不能为空'
        },
        ]
    },{
      title: 'id(删除时使用)',
      dataIndex: 'id',
      rules: [
        {
          required: true,
          message:'id不能为空'
        },
      ]
    },{
    title: '创建时间',
    dataIndex: 'createTime',
    noEdit:true,//是否渲染到编辑字段
  }
    ]
}

for(let i in api){
  api[i] = Ajax(api[i])
}
export default modelExtend(pageModel, {
  namespace: dataFormat.nameSpace,
  state: {
    dataFormat,
    users:[],
    selectedUsersRows:[],
    roleId:'',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/role_list/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { roleId: match[1] } });
          dispatch({ type: 'updateState', payload: {roleId:match[1] } })
        }
        dispatch({ type: 'queryUser', payload: {page:1, rows:1000 } })

      })
    },
  },

  effects: {
    * doSave({ payload }, { call, put, select }) {
      const { roleId } = yield (select(_ => _[dataFormat.nameSpace]))
      const data = yield call(api.doSave,payload)
      if (data.statusText == 'OK') {
        message.success('添加/修改成功！');
        yield put({ type: 'query', payload: { roleId} });
      } else {
        throw data.data.msg
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(api.doQuery, payload)
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

    * queryUser ({ payload = {} }, { call, put }) {
      const data = yield call(api.doQueryUser, payload)
      console.log('个人用户请求参数111',data.data.response.searchData)
      if (data.data.code == '0') {
        yield put({
          type: 'updateState',
          payload: {
            users: data.data.response.searchData,
          },
        })
      }
    },

    * doDelete ({ payload }, { call, put, select }) {
      const data = yield call(api.doDelete, { ids: payload.ids.join(',') })
      const { roleId } = yield (select(_ => _[dataFormat.nameSpace]))
      if (data.data.code == '0') {
        message.success('删除成功！');
        yield put({ type: 'updateState', payload: { selectedRows: [] } })
        yield put({ type: 'query', payload: { roleId} });
      } else {
        throw data
      }
    },

  },

  reducers: {


  },
})
