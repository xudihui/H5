import dva from 'dva';
import { request, config } from 'utils'
import axios from 'axios'
import { notification } from 'antd';
async function query (params) {
  return axios({
    method: 'post',
    url: 'http://localhost:3000/faq',
    headers: {'appId': 'com.smk.test.test'},
  })
}
async function add (params) {
  let i = 0;
  var arr = [];
  while(i<10){
    i++;
    let temp = {
      Q:Math.random(),
      A:Math.random(),
    }
    arr.push(temp);
  }
  params.movie.lists = arr

  return axios({
    method: 'post',
    url: 'http://localhost:3000/newfaq',
    data: params,
    headers: {'appId': 'com.smk.test.test'},
  })
}
async function del (params) {
  return axios({
    method: 'post',
    url: 'http://localhost:3000/admin/movie/del',
    params: {request:JSON.stringify(params)},
    headers: {'appId': 'com.smk.test.test'},
  })
}
function contains(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return false;
    }
  }
  return true;
}


export default {
  namespace: 'products',
  state: [
  ],
  reducers: {
    'init'(state, { payload: target }) {
      console.log('产品列表：',target)
      return [...target]
    },
    'delete'(state, { payload: id }) {
      var id = id.split(',');
      return state.filter(item => contains(id,item._id));
    },
    'add'(state, { payload: id }) {
      console.log('add',state);
      return [...state,id]
    }
  },
  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload);
      if (data) {
        yield put({ type: 'init', payload:data.data.response})
      }
    },
    * adder ({ payload = {} }, { call, put }) {
      const data = yield call(add, payload)
      console.log('add',payload);
      console.log('add返回数据',data)
      var obj = payload.movie;
      obj._id = data.data.id;
      if (data) {
        yield put({ type: 'add', payload:obj})
      }
    },
    * del ({ payload = {} }, { call, put }) {
      const data = yield call(del, payload)
      console.log('del',payload);
      console.log('删除',data)
      if (data) {
        yield put({ type: 'delete', payload:payload})
      }
    }
  }
};
