
import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import {  remove } from 'services/user'
import { pageModel } from './common'
import {Ajax} from '../utils/index'
import { message } from 'antd';


var api = {
  doQuery:'sys/role/findPageList',//查询
  doSave:'sys/role/doSave',      //增加和修改，增加的时候不传入ID，修改的时候传入ID
  doDelete:'sys/role/doDelete',  //删除，ids:'1,2,3,4'
}
var dataFormat = {
  nameSpace:'role_list',
  data:[
    {
      title: '角色编号',
      dataIndex: 'id',
      noEdit:true,//是否渲染到编辑字段

    }, {
      title: '角色代码',
      dataIndex: 'code',
      render:(text, record, index)=>{
        return(
          <span>{text=='city_act_org' ? '罗阳' : (text+'罗阳')}</span>
        )
      },
      rules: [
        {
          required: true,
          message:'角色代码不能为空'
        },
      ]
    }, {
      title: '中文名称',
      dataIndex: 'label',
      rules: [
        {
          required: true,
          message:'中文名称不能为空'
        },
      ]
    }, {
      title: '英文名称',
      dataIndex: 'name',
      rules: [
        {
          required: true,
          message:'英文名称不能为空'
        },
      ]
    }, {
      title: '备注',
      dataIndex: 'note',
      noRender:true,
      rules: [
        {
          required: true,
          message:'备注不能为空'
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
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === `/${dataFormat.nameSpace}`) {
          if(location.query){
            dispatch({
              type: 'query',
              payload:{
                ...location.query,
                page:location.query.page || 1,
                rows:location.query.rows || 10
              },
            })
          }
          else{
            dispatch({
              type: 'query',
              payload:{
                page:1,
                rows:10
              },
            })
          }
        }
      })
    },
  },

  effects: {

    * doSave({ payload }, { call, put, select }) {
      const data = yield call(api.doSave,payload)
      if (data.data.code == '0') {
        message.success('添加/修改成功！');
        yield put({
          type: 'query',
          payload:{
            page:1,
            rows:10
          },
        })
        yield put({
          type: 'updateState',
          payload:{
            selectedRows:!payload.id ? [] : [{...payload}],
          },
        })

      } else {
        throw data.data.msg
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(api.doQuery, payload)
      console.log('个人用户请求参数',data)
      if (data.data.code == '0') {
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

    * doDelete ({ payload }, { call, put, select }) {
      const data = yield call(api.doDelete, { ids: payload.ids.join(',') })
      if (data.data.code == '0') {
        message.success('删除成功！');
        yield put({ type: 'updateState', payload: { selectedRows: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

  },

  reducers: {


  },
})
