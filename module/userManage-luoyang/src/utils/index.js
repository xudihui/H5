/* global window */
import classnames from 'classnames'
import lodash from 'lodash'
import config from './config'
import request from './request'
import { color } from './theme'
import { Tree,Icon } from 'antd'
import axios from 'axios'
const TreeNode = Tree.TreeNode;

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}


/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name,str) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = str ? str.substr(1).match(reg) : window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] == key) //改为非强制等于
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}



/**
 * 渲染树状菜单
 */
const getTree = (data) => {
    return getMenus(arrayToTree(data.filter(_ => _.parentId !== '-1'), 'id', 'parentId'))
}

// 递归生成树形结构
const getMenus = (menuTreeN) => {
  if(menuTreeN){//只有该节点存在的时候再进行递归
    return menuTreeN.map((item,index) => {
      if (item.children) {
        return (
          <TreeNode
            key={item.id}
            title={<span><Icon type="appstore-o" style={{color:'#333'}} /> {item.label}</span>   }
          >
            {getMenus(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          key={item.id}
          title={item.label}
        >

        </TreeNode>
      )
    })
  }
}


// 封装请求
const ajax = (params) => {
  return axios({
    method: 'post',
    url: $BASE + params.url + '.htm',
    headers: {'token': localStorage.getItem('token')},
    data: params.data
  })
}

// 封装请求
const Ajax = (url) => {
  return async function(params){
    return axios({
      method: 'post',
      url: $BASE + url + '.htm',
      headers: {'token': localStorage.getItem('token')},
      data: params
    })
  }

}

const Effects = (api) => {
  return {
    * doSave({ payload }, { call, put, select }) {
      const data = yield call(api.doSave,payload)
      if (data.statusText == 'OK') {
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

  }
}

module.exports = {
  config,
  request,
  color,
  classnames,
  queryURL,
  queryArray,
  arrayToTree,
  getTree,
  getMenus,
  ajax,
  Ajax,
  Effects,
}
