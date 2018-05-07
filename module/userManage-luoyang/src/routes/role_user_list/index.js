import React from 'react'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'

import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row,Form, Col, Button, Popconfirm,Tree,Icon,Table,notification } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import Filter from './Filter'
import Edit from './Edit'
import { Layout } from 'components'
const {List} = Layout;
const Main = ({ location, dispatch, target, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination, dataFormat, selectedUsersRows, users, isMotion,current,lists,checkeds,expandedKeys, selectedRowKeys } = target
  const { pageSize } = pagination


  //修改
  const editProps = {
    item:target.selectedRows[0],
    dispatch,
    dataFormat,
    users,
    visible:target.v.edit,
    onOk(){
      if(selectedUsersRows.length != 1){
        return notification.open({
          message: '您需要先选中一条内容！',
          description: '一条都不选，或者选择了很多条，我作为系统也不知道绑定哪个用户啊',
          icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
        });
      }
      const { query, pathname } = location
      const match = pathToRegexp('/role_list/:id').exec(pathname)
      dispatch({
        type: `${dataFormat.nameSpace}/updateState`,
        payload: {v:{edit:false}},//隐藏弹窗
      })
      dispatch({
        type: `${dataFormat.nameSpace}/doSave`,
        payload: {roleId:match[1],userId:selectedUsersRows[0]['id']},//隐藏弹窗
      })
    }
  }


  const listProps = {
    dataSource: list,
    loading: loading.effects[`${dataFormat.nameSpace}/query`],
    pagination,
    dataFormat,
    location,
    dispatch,
    onClickItem(record){
      console.log('点击当前对象：',record)
      dispatch({
        type: `${dataFormat.nameSpace}/loadByRoleId`,
        payload: {roleId:record.id,record},
      })
    },
    onChange (page) {
      const { query, pathname } = location
      const match = pathToRegexp('/role_list/:id').exec(pathname)
      dispatch(routerRedux.replace({ //使用push并且在hashHistory的时候会被警告，push的主要作用是支持返回，暂时删除push
        pathname: `/role_list/${match[1]}`,
        query: {
          page:page.current,
          rows:page.pageSize
        }
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: `${dataFormat.nameSpace}/delete`,
        payload: id,
      })
    }
  }

  const filterProps = {
    isMotion,
    filter: {
      ...location.query,
    },
    dispatch,
    onFilterChange (value) {
      console.log('onFilterChange:',value)
      dispatch(routerRedux.replace({ //使用push并且在hashHistory的时候会被警告，push的主要作用是支持返回，暂时删除push
        pathname: `/${dataFormat.nameSpace}`,
        query: {
          ...value,
          page:1,
          rows:10
        }
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
          pathname: `/${dataFormat.nameSpace}`,
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        })) : dispatch(routerRedux.push({
          pathname: `/${dataFormat.nameSpace}`,
        }))
    },
    onAdd () {
      dispatch({
        type: `${dataFormat.nameSpace}/updateState`,
        payload: {v:{add:true}},//隐藏弹窗
      })
    },
    onEdit () {
      dispatch({
        type: `${dataFormat.nameSpace}/updateState`,
        payload: {v:{edit:true}},//隐藏弹窗
      })
    },
    onView () {
      if(target.selectedRows.length != 1){
        return notification.open({
          message: '您需要先选中一条内容！',
          description: '一条都不选，或者选择了很多条，我们不知道展开哪条信息给你看啊',
          icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
        });
      }
      dispatch({
        type: `${dataFormat.nameSpace}/updateState`,
        payload: {v:{view:true}},//隐藏弹窗
      })
    },

    onDelete () {
      if(target.selectedRows.length < 1){
        return notification.open({
          message: '您需要至少选中一条内容！',
          description: '一条都不选,我们不知道删除哪条消息哦',
          icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
        });
      }
      var ids = [];
      target.selectedRows.map((i,index) => {
        ids.push(i.id);
      })
      dispatch({
        type: `${dataFormat.nameSpace}/doDelete`,
        payload: {ids},//隐藏弹窗
      })
    }


  }


  const gridStyle = {
    width: '40%',
    textAlign: 'center',
  };
  return (
    <Page inner>
      <Filter {...filterProps}></Filter>
      <List {...listProps} />
      <Edit {...editProps} />

    </Page>
  )
}

Main.propTypes = {
  target: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect((opt) => ({ target:opt['role_user_list'], loading:opt['loading'] }))(Main)
